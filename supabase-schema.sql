-- EPA Mining Concessions Management System
-- Supabase Database Schema for Authentication and User Management

-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user roles and additional information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'staff', 'guest')) DEFAULT 'guest',
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'role', 'guest'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create mining_concessions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.mining_concessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concession_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  license_type TEXT CHECK (license_type IN ('Reconnaissance', 'Prospecting', 'Small Scale', 'Large Scale')) NOT NULL,
  status TEXT CHECK (status IN ('Active', 'Pending', 'Suspended', 'Expired')) DEFAULT 'Pending',
  mineral_type TEXT NOT NULL,
  area_hectares DECIMAL(10,2),
  issue_date DATE,
  expiry_date DATE,
  location_region TEXT,
  location_district TEXT,
  coordinates JSONB, -- Store polygon coordinates
  environmental_status TEXT CHECK (environmental_status IN ('Compliant', 'Non-Compliant', 'Under Review')) DEFAULT 'Under Review',
  last_inspection_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on mining_concessions table
ALTER TABLE public.mining_concessions ENABLE ROW LEVEL SECURITY;

-- Create policies for mining_concessions table
CREATE POLICY "Mining concessions are viewable by authenticated users" ON public.mining_concessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin and staff can insert mining concessions" ON public.mining_concessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Only admin and staff can update mining concessions" ON public.mining_concessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Only admin can delete mining concessions" ON public.mining_concessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create trigger for updating updated_at on mining_concessions
DROP TRIGGER IF EXISTS update_mining_concessions_updated_at ON public.mining_concessions;
CREATE TRIGGER update_mining_concessions_updated_at
  BEFORE UPDATE ON public.mining_concessions
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO public.mining_concessions (
  concession_id, company_name, license_type, status, mineral_type, 
  area_hectares, issue_date, expiry_date, location_region, location_district,
  environmental_status, coordinates
) VALUES 
(
  'GH-2024-001',
  'Ghana Gold Mining Ltd',
  'Large Scale',
  'Active',
  'Gold',
  2500.00,
  '2024-01-15',
  '2029-01-14',
  'Ashanti',
  'Obuasi',
  'Compliant',
  '{"type":"Polygon","coordinates":[[[-1.5,6.2],[-1.4,6.2],[-1.4,6.3],[-1.5,6.3],[-1.5,6.2]]]}'
),
(
  'GH-2024-002',
  'West African Bauxite Co.',
  'Large Scale',
  'Active',
  'Bauxite',
  1800.50,
  '2024-02-20',
  '2029-02-19',
  'Western',
  'Shama',
  'Under Review',
  '{"type":"Polygon","coordinates":[[[-2.1,5.1],[-2.0,5.1],[-2.0,5.2],[-2.1,5.2],[-2.1,5.1]]]}'
),
(
  'GH-2024-003',
  'Northern Diamond Exploration',
  'Prospecting',
  'Pending',
  'Diamond',
  500.25,
  '2024-03-10',
  '2026-03-09',
  'Northern',
  'Tamale',
  'Non-Compliant',
  '{"type":"Polygon","coordinates":[[[-0.8,9.4],[-0.7,9.4],[-0.7,9.5],[-0.8,9.5],[-0.8,9.4]]]}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mining_concessions_status ON public.mining_concessions(status);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_license_type ON public.mining_concessions(license_type);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_region ON public.mining_concessions(location_region);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with roles and additional information';
COMMENT ON TABLE public.mining_concessions IS 'Mining concession records for EPA management';
COMMENT ON COLUMN public.mining_concessions.coordinates IS 'GeoJSON polygon coordinates for the concession area';
