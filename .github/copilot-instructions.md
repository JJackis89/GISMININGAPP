<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EPA Mining Concessions Management System - Copilot Instructions

This is a professional GIS web dashboard application for managing mining concession data for the Environmental Protection Authority (EPA) of Ghana. The project uses modern web technologies with specific architectural patterns and conventions.

## Project Overview
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Mapping**: ArcGIS JavaScript API 4.28
- **Charts**: Recharts library
- **Icons**: Lucide React

## Code Conventions

### Component Structure
- Use functional components with TypeScript
- Follow the directory structure: components organized by feature
- Use proper TypeScript interfaces for props and data types
- Implement proper error handling and loading states

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow responsive design principles (mobile-first)
- Use consistent color palette defined in tailwind.config.js
- Maintain visual hierarchy with proper spacing and typography

### ArcGIS Integration
- Import ArcGIS modules from '@arcgis/core'
- Handle map lifecycle properly (creation and cleanup)
- Use GraphicsLayer for dynamic content
- Implement proper popup templates for feature information

### State Management
- Use React hooks (useState, useEffect, useContext)
- Implement React Context for authentication state
- Keep component state minimal and focused
- Use proper TypeScript typing for all state

### Data Handling
- Define proper TypeScript interfaces in src/types/
- Use mock data from src/data/mockData.ts
- Implement proper data filtering and sorting
- Handle async operations with proper error handling

### Authentication
- Role-based access control (admin, staff, guest)
- Secure route protection
- Persistent login state with localStorage
- Proper logout functionality

## Feature Implementation

### Map Features
- Interactive ArcGIS map with Ghana-focused extent
- Basemap toggle between topographic and satellite
- Polygon visualization for mining concessions
- Status-based color coding
- Popup templates with concession details
- Full-screen and scale bar widgets

### Dashboard Features
- Statistics cards with key metrics
- Interactive charts using Recharts
- Sortable and filterable data tables
- Search functionality across multiple fields
- Export capabilities (CSV, GeoJSON, PDF)

### User Interface
- Clean, professional design
- Responsive layout for all screen sizes
- Intuitive navigation with sidebar menu
- Loading states and error handling
- Accessible components with proper ARIA labels

## Best Practices
- Write clean, readable, and maintainable code
- Use proper TypeScript types and interfaces
- Implement proper error boundaries
- Optimize performance with useMemo and useCallback when needed
- Follow React best practices for component composition
- Ensure proper accessibility standards
- Use semantic HTML elements
- Implement proper form validation

## Testing Considerations
- Components should be testable with clear props interfaces
- Separate business logic from presentation logic
- Mock external dependencies (ArcGIS API) for testing
- Use proper data fixtures for consistent testing

When generating code for this project, please follow these guidelines and maintain consistency with the existing codebase patterns.
