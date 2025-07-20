# EPA Mining Concessions Management System

A professional web-based GIS dashboard application for managing and visualizing mining concession data in Ghana. Developed for the Environmental Protection Authority (EPA) of Ghana with integrated ArcGIS Online mapping capabilities and Supabase authentication.

## About EPA Ghana

The Environmental Protection Authority (EPA) of Ghana is responsible for the protection and management of the country's environment. This system helps EPA manage mining concessions, monitor environmental compliance, and ensure sustainable mining practices across Ghana.

## 🌐 Live Demo

**GitHub Pages**: [https://JJackis89.github.io/GISMININGAPP/](https://JJackis89.github.io/GISMININGAPP/)

## � Quick Start

### Easy Launch (Windows)
Double-click `start-epa-dashboard.bat` to automatically start the development server.

### Manual Setup
1. Install [Node.js](https://nodejs.org/) (version 18+)
2. Clone this repository
3. Run `npm install`
4. Configure your `.env` file with Supabase credentials
5. Run `npm run dev`

## Features

### 🔐 User Authentication (Supabase)
- Email-based registration and login
- Secure session management
- Role-based access control
- Password reset functionality

### 🗺️ Interactive Map Viewer
- ArcGIS Online integration with Ghana-focused extent
- Real data from EPA database (71+ mining concessions)
- Basemap toggle (Topographic/Satellite)
- Mining concession visualization with status-based color coding
- Interactive popups with detailed concession information
- Full-screen mode, zoom controls, and scale bar

### 🔍 Search & Filter
- Real-time search across concession names, IDs, regions, and owners
- Advanced filtering by region, status, permit type, and expiry dates
- Dynamic results updating

### 📊 Data Management
- Sortable and filterable attribute table
- Detailed concession information modal
- Status tracking (Active, Expired, Pending)
- Permit expiration alerts

### 📈 Analytics & Reporting
- Dashboard statistics cards
- Interactive charts showing concessions by region and type
- Permit status distribution visualizations
- Export capabilities (CSV, GeoJSON, PDF reports)

### 🚨 Notifications
- Visual alerts for permits expiring within 30 days
- Status indicators throughout the interface

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Mapping**: ArcGIS JavaScript API 4.28
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + html2canvas

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gis-mining-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

Use these credentials to test different user roles:

- **Admin**: username: `admin`, password: `password`
- **Staff**: username: `staff`, password: `password`  
- **Guest**: username: `guest`, password: `password`
- **Analytics**: Charts and statistics dashboard
- **Export Tools**: PDF reports, CSV, and GeoJSON export capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: ArcGIS JavaScript API 4.28
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gis-mining-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

- **Admin**: username: `admin`, password: `password`
- **Staff**: username: `staff`, password: `password`  
- **Guest**: username: `guest`, password: `password`

## Usage

### Map Features
- Toggle between topographic and satellite basemaps
- Click on concession polygons to view detailed information
- Use full-screen mode for better visualization
- Zoom and pan to explore different regions

### Search and Filtering
- Search by concession name, ID, region, or owner
- Filter by region, status, permit type, or expiry window
- Combine multiple filters for precise results

### Data Export
- **CSV Export**: Download concession data as spreadsheet
- **GeoJSON Export**: Download spatial data for GIS software
- **PDF Report**: Generate printable reports with map snapshots

### Analytics Dashboard
- View total concessions and permit statistics
- Analyze distribution by region and permit type
- Monitor permits approaching expiration

## Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Charts/          # Chart and analytics components
│   ├── Dashboard/       # Main dashboard components
│   ├── Export/          # Export functionality
│   ├── Filters/         # Filter panel components
│   ├── Layout/          # Layout components (Navbar, Sidebar)
│   ├── Map/             # ArcGIS map components
│   ├── Search/          # Search functionality
│   └── Table/           # Data table components
├── contexts/            # React contexts (Auth)
├── data/                # Mock data and utilities
├── types/               # TypeScript type definitions
└── main.tsx             # Application entry point
```

## Configuration

### ArcGIS Integration

The application uses the ArcGIS JavaScript API for mapping functionality. To use your own web maps:

1. Update the basemap in `src/components/Map/MapViewer.tsx`
2. Replace with your ArcGIS Online web map ID:

```typescript
const map = new Map({
  basemap: 'your-webmap-id' // Replace with your web map ID
})
```

### Data Source

Currently uses mock data in `src/data/mockData.ts`. To connect to real data:

1. Replace mock data with API calls
2. Update the data fetching logic in dashboard components
3. Implement CRUD operations for admin functionality

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Adding New Features

1. Create components in appropriate directories
2. Add routes in `App.tsx` if needed
3. Update types in `src/types/index.ts`
4. Add mock data if required

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.
