import { MiningConcession } from '../../types'
import { Download, FileText, Table } from 'lucide-react'

interface ExportToolsProps {
  concessions: MiningConcession[]
}

export default function ExportTools({ concessions }: ExportToolsProps) {
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Size (ha)', 'Owner', 'Permit Type', 'Expiry Date', 'District', 'Region', 'Status']
    const csvContent = [
      headers.join(','),
      ...concessions.map(c => [
        c.id,
        `"${c.name}"`,
        c.size,
        `"${c.owner}"`,
        c.permitType,
        c.permitExpiryDate,
        c.district,
        c.region,
        c.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `mining-concessions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToGeoJSON = () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: concessions.map(c => ({
        type: 'Feature',
        properties: {
          id: c.id,
          name: c.name,
          size: c.size,
          owner: c.owner,
          permitType: c.permitType,
          permitExpiryDate: c.permitExpiryDate,
          district: c.district,
          region: c.region,
          status: c.status
        },
        geometry: {
          type: 'Polygon',
          coordinates: [c.coordinates.map(coord => [coord[1], coord[0]])] // Convert to lng,lat format
        }
      }))
    }

    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `mining-concessions-${new Date().toISOString().split('T')[0]}.geojson`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDFReport = async () => {
    try {
      // Dynamic import to avoid bundling issues
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      const pdf = new jsPDF()
      
      // Add title
      pdf.setFontSize(20)
      pdf.text('Mining Concessions Report', 20, 20)
      
      // Add date
      pdf.setFontSize(12)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
      
      // Add summary stats
      pdf.text(`Total Concessions: ${concessions.length}`, 20, 50)
      pdf.text(`Active Permits: ${concessions.filter(c => c.status === 'active').length}`, 20, 60)
      pdf.text(`Expired Permits: ${concessions.filter(c => c.status === 'expired').length}`, 20, 70)
      
      // Try to capture map if visible
      const mapElement = document.querySelector('.map-container')
      if (mapElement) {
        try {
          const canvas = await html2canvas(mapElement as HTMLElement)
          const imgData = canvas.toDataURL('image/png')
          pdf.addPage()
          pdf.text('Map View', 20, 20)
          pdf.addImage(imgData, 'PNG', 20, 30, 170, 120)
        } catch (error) {
          console.warn('Could not capture map:', error)
        }
      }

      pdf.save(`mining-concessions-report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report. Please try again.')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={exportToCSV}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Table className="h-4 w-4 mr-2" />
        Export CSV
      </button>

      <button
        onClick={exportToGeoJSON}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Download className="h-4 w-4 mr-2" />
        Export GeoJSON
      </button>

      <button
        onClick={generatePDFReport}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <FileText className="h-4 w-4 mr-2" />
        PDF Report
      </button>
    </div>
  )
}
