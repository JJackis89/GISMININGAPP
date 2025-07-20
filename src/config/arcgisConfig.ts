// ArcGIS Configuration for EPA Mining Dashboard
// Update these settings to connect to your specific ArcGIS resources

export interface ArcGISConfig {
  // Your primary web map ID
  primaryWebMapId: string
  
  // Alternative web map ID (fallback)
  fallbackWebMapId?: string
  
  // Direct feature service URLs (if you prefer to use feature services directly)
  featureServiceUrls?: {
    miningConcessions?: string
    permits?: string
    regions?: string
  }
  
  // Portal settings
  portalUrl?: string
  
  // Authentication settings (if required)
  requiresAuth?: boolean
  
  // Field mappings for your data
  fieldMappings: {
    id: string[]
    name: string[]
    owner: string[]
    size: string[]
    permitType: string[]
    expiryDate: string[]
    district: string[]
    region: string[]
    status: string[]
    phone: string[]
    email: string[]
    address: string[]
  }
}

export const arcgisConfig: ArcGISConfig = {
  // Your EPA web map ID
  primaryWebMapId: 'b7d490ce18644f9c8f38989586c4d0d4',
  
  // Public fallback web map
  fallbackWebMapId: '05e015c5f0314db9a487a9b46cb37b5a',
  
  // ArcGIS Online portal (default)
  portalUrl: 'https://www.arcgis.com',
  
  // Set to true if your web map requires login
  requiresAuth: false,
  
  // Add your feature service URLs here if you want to use them directly
  featureServiceUrls: {
    // Example: 'https://services.arcgis.com/your-org/arcgis/rest/services/MiningConcessions/FeatureServer/0'
    miningConcessions: undefined
  },
  
  // Field mappings - add more variations based on your actual data schema
  fieldMappings: {
    id: ['OBJECTID', 'ID', 'FID', 'PERMIT_ID', 'CONCESSION_ID'],
    name: ['Name', 'COMPANY_NAME', 'PROJECT_NAME', 'CONCESSION_NAME', 'MINE_NAME'],
    owner: ['Owner', 'COMPANY', 'OPERATOR', 'HOLDER', 'APPLICANT'],
    size: ['Area', 'SIZE', 'HECTARES', 'AREA_HA', 'ACREAGE'],
    permitType: ['PERMIT_TYPE', 'TYPE', 'CATEGORY', 'SCALE', 'OPERATION_TYPE'],
    expiryDate: ['EXPIRY_DATE', 'END_DATE', 'EXPIRATION', 'VALID_UNTIL'],
    district: ['District', 'DISTRICT', 'LOCALITY', 'ADMINISTRATIVE_AREA'],
    region: ['Region', 'REGION', 'PROVINCE', 'STATE'],
    status: ['Status', 'STATUS', 'PERMIT_STATUS', 'STATE', 'CONDITION'],
    phone: ['PHONE', 'CONTACT_PHONE', 'TELEPHONE', 'MOBILE'],
    email: ['EMAIL', 'CONTACT_EMAIL', 'E_MAIL'],
    address: ['ADDRESS', 'LOCATION', 'PHYSICAL_ADDRESS', 'POSTAL_ADDRESS']
  }
}

// Instructions for making your web map publicly accessible:
/*
TO MAKE YOUR WEB MAP PUBLICLY ACCESSIBLE:

1. Go to ArcGIS Online (https://www.arcgis.com)
2. Sign in to your account
3. Go to "Content" and find your web map
4. Click on the web map title to open its details
5. Click "Share" button
6. Select "Everyone (public)" 
7. Click "Save"

ALTERNATIVE - USE FEATURE SERVICE DIRECTLY:
1. Go to your feature service in ArcGIS Online
2. Copy the REST URL (it should end with /FeatureServer/0)
3. Add it to the featureServiceUrls.miningConcessions above
4. Make sure the feature service is also shared publicly

FIELD MAPPING:
- Update the fieldMappings above to match your actual field names
- The system will try all variations listed for each field type
- Add more field name variations if your data uses different naming conventions
*/
