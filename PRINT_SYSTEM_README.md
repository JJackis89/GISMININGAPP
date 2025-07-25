# EPA Mining Concessions Print System

## Overview

The EPA Mining Concessions Print System provides professional document generation and printing capabilities for mining concession certificates. This system integrates seamlessly with the existing EPA Mining Dashboard and offers both single and batch printing options with customizable layouts.

## Features

### ✨ Core Features
- **Professional Document Layout**: EPA-branded certificates with official formatting
- **Single & Batch Printing**: Print individual concessions or multiple certificates at once
- **PDF Export**: Generate PDF files for sharing and archival purposes
- **Customizable Options**: Configure paper size, orientation, and content sections
- **Interactive Maps**: Include map visualizations in printed documents
- **Coordinate Tables**: Display boundary coordinates in tabular format

### 🎨 Design Features
- **EPA Branding**: Official logos, colors, and styling
- **Responsive Layout**: Works on different paper sizes (A4, A3, Letter)
- **Professional Typography**: Clean, readable fonts optimized for printing
- **Watermarks**: Optional EPA watermarks for document authenticity
- **Status Indicators**: Visual status badges and expiry warnings

## Components

### PrintButton Component
```tsx
import { PrintButton } from './components/Print'

// Single concession print
<PrintButton 
  concession={miningConcession} 
  variant="single" 
  size="md"
/>

// Batch print multiple concessions
<PrintButton 
  concessions={concessionArray} 
  variant="batch" 
  size="lg"
/>
```

**Props:**
- `concession?: MiningConcession` - Single concession data
- `concessions?: MiningConcession[]` - Array of concessions for batch printing
- `variant?: 'single' | 'batch'` - Print mode (default: 'single')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `className?: string` - Additional CSS classes

### PrintLayoutTemplate Component
```tsx
import { PrintLayoutTemplate } from './components/Print'

<PrintLayoutTemplate
  concession={miningConcession}
  printDate={new Date()}
  showCoordinates={true}
  showMap={true}
  logoUrl="/path/to/logo.png"
/>
```

**Props:**
- `concession: MiningConcession` - Required concession data
- `mapImageUrl?: string` - URL for map visualization
- `printDate: Date` - Document generation date
- `logoUrl?: string` - Custom logo URL
- `showCoordinates?: boolean` - Include coordinates table (default: true)
- `showMap?: boolean` - Include map section (default: true)

### PrintService Class
```tsx
import { printService } from './services/printService'

// Print single concession
await printService.printConcession(concession, {
  paperSize: 'A4',
  orientation: 'portrait',
  includeMap: true,
  mapSize: 'medium'
})

// Export to PDF
await printService.exportToPDF(concession, options)

// Batch print
await printService.printBatch(concessions, options)
```

## Print Options

### Document Settings
- **Paper Size**: A4, A3, Letter
- **Orientation**: Portrait, Landscape
- **Quality**: Standard, High-resolution

### Content Options
- **Include EPA Logo**: Official agency branding
- **Include Watermark**: "EPA GHANA" background watermark
- **Show Coordinates**: Boundary coordinates table
- **Show Details**: Complete concession information
- **Include Map**: Map visualization section

### Map Options
- **Map Size**: Small (200px), Medium (300px), Large (400px)
- **Map Type**: Satellite, Terrain, Streets
- **Show Boundaries**: Highlight concession boundaries

## Usage Examples

### Integration with ConcessionTable
The print functionality is already integrated into the `ConcessionTable` component:

```tsx
// Individual row actions
<PrintButton 
  concession={concession} 
  variant="single" 
  size="sm" 
  className="ml-2"
/>

// Batch actions header
<PrintButton 
  concessions={allConcessions} 
  variant="batch" 
  size="md"
/>
```

### Custom Implementation
```tsx
import React from 'react'
import { PrintButton, printService } from './components/Print'

const MyComponent = () => {
  const handleCustomPrint = async () => {
    try {
      await printService.printConcession(concession, {
        paperSize: 'A3',
        orientation: 'landscape',
        includeMap: true,
        mapSize: 'large',
        showCoordinates: true
      })
    } catch (error) {
      console.error('Print failed:', error)
    }
  }

  return (
    <div>
      <PrintButton concession={data} />
      <button onClick={handleCustomPrint}>
        Custom Print
      </button>
    </div>
  )
}
```

## API Reference

### PrintOptions Interface
```typescript
interface PrintOptions {
  includeMap: boolean           // Include map visualization
  mapSize: 'small' | 'medium' | 'large'  // Map display size
  paperSize: 'A4' | 'A3' | 'Letter'     // Paper format
  orientation: 'portrait' | 'landscape'  // Page orientation
  includeLogo: boolean          // Show EPA logo
  includeWatermark: boolean     // Add background watermark
  showCoordinates: boolean      // Display coordinates table
  showDetails: boolean          // Include detailed information
}
```

### PrintService Methods
```typescript
// Print single concession
printConcession(concession: MiningConcession, options?: Partial<PrintOptions>): Promise<void>

// Export to PDF
exportToPDF(concession: MiningConcession, options?: Partial<PrintOptions>): Promise<void>

// Batch print
printBatch(concessions: MiningConcession[], options?: Partial<PrintOptions>): Promise<void>

// Generate preview
getPreviewDataURL(concession: MiningConcession, options?: Partial<PrintOptions>): Promise<string>
```

## File Structure

```
src/
├── components/
│   └── Print/
│       ├── index.ts                    # Main exports
│       ├── PrintButton.tsx             # Print button component
│       ├── PrintLayoutTemplate.tsx     # Document layout template
│       └── PrintDemo.tsx               # Demo component
├── services/
│   └── printService.ts                 # Core print service
└── types/
    └── index.ts                        # TypeScript interfaces
```

## Styling

The print system uses Tailwind CSS with EPA-specific color classes:
- `text-epa-orange-600` - EPA orange text
- `bg-epa-green-100` - EPA green backgrounds
- `border-epa-orange-500` - EPA orange borders

Custom print styles are included for optimal printing:
```css
@page {
  size: A4 portrait;
  margin: 1cm;
}

@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

## Error Handling

The print service includes comprehensive error handling:
- Network connectivity issues
- Browser compatibility problems
- Print dialog cancellation
- Data validation errors

```tsx
try {
  await printService.printConcession(concession)
} catch (error) {
  if (error.message.includes('Pop-up blocked')) {
    // Handle popup blocker
  } else if (error.message.includes('Network')) {
    // Handle network issues
  }
  // Show user-friendly error message
}
```

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Print Features
- ✅ CSS Grid layouts
- ✅ Flexbox positioning
- ✅ Custom fonts
- ✅ Background colors/images
- ✅ SVG graphics

## Testing

### Print Demo Component
Use the `PrintDemo` component to test all print functionality:

```tsx
import { PrintDemo } from './components/PrintDemo'

// Render demo in your app
<PrintDemo />
```

### Manual Testing Checklist
- [ ] Single concession print works
- [ ] Batch printing processes multiple items
- [ ] PDF export generates correctly
- [ ] Print options dialog functions properly
- [ ] Document layout appears professional
- [ ] EPA branding displays correctly
- [ ] Coordinate tables format properly
- [ ] Map sections render (when available)

## Deployment Notes

### Production Considerations
1. **HTTPS Required**: Print functionality requires secure context
2. **Popup Settings**: Users may need to allow popups
3. **Print Permissions**: Some corporate environments may restrict printing
4. **File Size**: Large coordinate datasets may affect performance

### Environment Variables
```env
# Optional: Custom logo URL
REACT_APP_EPA_LOGO_URL=https://your-domain.com/logo.png

# Optional: Enable/disable features
REACT_APP_ENABLE_BATCH_PRINT=true
REACT_APP_ENABLE_PDF_EXPORT=true
```

## Troubleshooting

### Common Issues

**Print dialog doesn't appear**
- Check popup blocker settings
- Ensure HTTPS in production
- Verify browser permissions

**Layout appears broken**
- Check CSS print styles
- Verify Tailwind CSS classes
- Test in different browsers

**PDF export fails**
- Check browser print-to-PDF support
- Verify file permissions
- Test with smaller datasets

**Batch printing stops**
- Check browser popup limits
- Reduce batch size
- Add delays between prints

### Debug Mode
Enable debug logging:
```typescript
// In development
localStorage.setItem('EPA_PRINT_DEBUG', 'true')
```

## Future Enhancements

### Planned Features
- [ ] Map integration with real GIS data
- [ ] Custom template editor
- [ ] Email delivery of PDFs
- [ ] QR codes for digital verification
- [ ] Multi-language support
- [ ] Advanced layout customization

### Integration Opportunities
- [ ] ESRI ArcGIS integration
- [ ] Government document standards
- [ ] Digital signature support
- [ ] Audit trail logging
- [ ] Archive management system

## Support

For issues or questions regarding the print system:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Test with the PrintDemo component
4. Verify data format matches MiningConcession interface

---

*This documentation covers the EPA Mining Concessions Print System v1.0. For technical support or feature requests, please refer to the project repository.*
