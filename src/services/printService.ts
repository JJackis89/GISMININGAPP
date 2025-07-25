/**
 * Print Service for EPA Mining Concessions Management System
 * Handles printing and PDF export of mining concession data with map integration
 * Version: 2.0.0 - Updated with geometry utilities integration
 */

import { MiningConcession, User } from '../types'
import { processConcessionBoundary } from '../utils/geometryUtils'

export interface PrintOptions {
  includeMap: boolean
  mapSize: 'small' | 'medium' | 'large'
  paperSize: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
  includeLogo: boolean
  includeWatermark: boolean
  showCoordinates: boolean
  showDetails: boolean
}

export class PrintService {
  private static instance: PrintService
  private printWindow: Window | null = null

  static getInstance(): PrintService {
    if (!PrintService.instance) {
      PrintService.instance = new PrintService()
    }
    return PrintService.instance
  }

  /**
   * Print a mining concession with custom layout
   */
  async printConcession(
    concession: MiningConcession,
    options: Partial<PrintOptions> = {},
    user?: User | null
  ): Promise<void> {
    const defaultOptions: PrintOptions = {
      includeMap: true,
      mapSize: 'medium',
      paperSize: 'A4',
      orientation: 'portrait',
      includeLogo: true,
      includeWatermark: true,
      showCoordinates: true,
      showDetails: true,
    }

    const printOptions = { ...defaultOptions, ...options }

    try {
      console.log('🖨️ Print Service v2.0.0 - Using geometry utilities integration')
      
      // Process boundary geometry using the same utilities as the React components
      const boundaryGeometry = processConcessionBoundary(concession)
      console.log('📊 Processed boundary:', {
        vertices: boundaryGeometry.vertices.length,
        area: boundaryGeometry.area,
        perimeter: boundaryGeometry.perimeter,
        sampleVertex: boundaryGeometry.vertices[0]
      })

      // Create print window
      this.printWindow = window.open('', '_blank', 'width=800,height=600')
      
      if (!this.printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.')
      }

      // Generate print content
      const printContent = await this.generatePrintContent(concession, printOptions, user)
      
      // Write content to print window
      this.printWindow.document.write(printContent)
      this.printWindow.document.close()

      // Wait for content to load, then print
      this.printWindow.onload = () => {
        setTimeout(() => {
          this.printWindow?.print()
          this.printWindow?.close()
        }, 500)
      }

    } catch (error) {
      console.error('Print error:', error)
      throw new Error(`Failed to print concession: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Export concession data as PDF
   */
  async exportToPDF(
    concession: MiningConcession,
    options: Partial<PrintOptions> = {},
    user?: User | null
  ): Promise<void> {
    const defaultOptions: PrintOptions = {
      includeMap: true,
      mapSize: 'large',
      paperSize: 'A4',
      orientation: 'portrait',
      includeLogo: true,
      includeWatermark: true,
      showCoordinates: true,
      showDetails: true,
    }

    const printOptions = { ...defaultOptions, ...options }

    try {
      // Create print window for PDF export
      this.printWindow = window.open('', '_blank', 'width=800,height=600')
      
      if (!this.printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.')
      }

      // Generate print content
      const printContent = await this.generatePrintContent(concession, printOptions, user)
      
      // Write content to print window
      this.printWindow.document.write(printContent)
      this.printWindow.document.close()

      // Instruct user to save as PDF
      this.printWindow.onload = () => {
        setTimeout(() => {
          alert('Please use your browser\'s print dialog and select "Save as PDF" as the destination.')
          this.printWindow?.print()
        }, 500)
      }

    } catch (error) {
      console.error('PDF export error:', error)
      throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Print multiple concessions (batch print)
   */
  async printBatch(
    concessions: MiningConcession[],
    options: Partial<PrintOptions> = {},
    user?: User | null
  ): Promise<void> {
    try {
      for (let i = 0; i < concessions.length; i++) {
        await this.printConcession(concessions[i], options, user)
        
        // Add delay between prints to avoid overwhelming the browser
        if (i < concessions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error('Batch print error:', error)
      throw new Error(`Failed to print batch: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate HTML content for printing
   */
  private async generatePrintContent(
    concession: MiningConcession,
    options: PrintOptions,
    user?: User | null
  ): Promise<string> {
    const styles = this.getPrintStyles(options)
    const content = this.getContentHTML(concession, options, user)

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mining Concession - ${concession.name}</title>
        <style>${styles}</style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `
  }

  /**
   * Generate CSS styles for print layout
   */
  private getPrintStyles(options: PrintOptions): string {
    return `
      @page { ${options.paperSize === 'A3' ? 'size: A3' : options.paperSize === 'Letter' ? 'size: letter' : 'size: A4'} ${options.orientation}; margin: 1cm; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; font-size: 12px; color: #1f2937; background: white; }
      .print-container { width: 100%; background: white; }
      .header { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 3px solid #f97316; margin-bottom: 20px; }
      .logo { width: 80px; height: 80px; }
      .header-content { text-align: center; flex: 1; }
      .header h1 { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
      .header h2 { font-size: 14px; color: #f97316; margin-bottom: 5px; }
      .header p { font-size: 10px; color: #6b7280; }
      .print-date { width: 80px; text-align: right; font-size: 10px; }
      .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
      .section { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
      .section.full-width { grid-column: 1 / -1; }
      .section h3 { font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #d1d5db; }
      .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; }
      .detail-label { font-weight: 600; color: #4b5563; flex: 0 0 40%; }
      .detail-value { color: #1f2937; flex: 1; text-align: right; }
      .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
      .status-active { background: #dcfce7; color: #166534; }
      .status-expired { background: #fee2e2; color: #991b1b; }
      .status-pending { background: #fef3c7; color: #92400e; }
      .geometric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
      .geometric-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
      .geometric-label { font-weight: 600; color: #4b5563; }
      .geometric-value { color: #1f2937; font-family: monospace; }
      .map-section { margin: 20px 0; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; }
      .map-container { background: white; border: 1px solid #cbd5e1; border-radius: 4px; padding: 15px; margin: 15px 0; min-height: 200px; display: flex; align-items: center; justify-content: center; }
      .map-placeholder { color: #64748b; font-style: italic; }
      .map-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; text-align: left; }
      .coordinates-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
      .coordinates-table th, .coordinates-table td { padding: 8px 12px; border: 1px solid #d1d5db; text-align: center; }
      .coordinates-table th { background: #f3f4f6; font-weight: bold; color: #374151; }
      .coordinates-table td { color: #1f2937; font-family: monospace; }
      .footer { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 10px; }
      .footer-right { text-align: right; }
      .doc-id { font-family: monospace; font-weight: bold; color: #374151; }
      .verification { font-style: italic; color: #6b7280; margin-top: 5px; }
      .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; font-weight: bold; color: rgba(249, 115, 22, 0.1); z-index: -1; pointer-events: none; }
    `
  }

  /**
   * Generate HTML content for concession
   */
  private getContentHTML(concession: MiningConcession, options: PrintOptions, user?: User | null): string {
    const statusClass = `status-${concession.status}`
    const boundaryGeometry = processConcessionBoundary(concession)
    
    return `
      <div class="print-container">
        ${options.includeWatermark ? '<div class="watermark">EPA GHANA</div>' : ''}
        
        <div class="header">
          ${options.includeLogo ? `
            <div class="logo">
              <img src="/epa-logo.png" alt="EPA Ghana Logo" style="width: 80px; height: 80px; object-fit: contain;" />
            </div>
          ` : ''}
          
          <div class="header-content">
            <h1>ENVIRONMENTAL PROTECTION AUTHORITY</h1>
            <h2>MINING CONCESSION REPORT</h2>
            <p>Republic of Ghana • Mining Department</p>
          </div>
          
          <div class="print-date">
            <p><strong>Print Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            ${user ? `<p><strong>Generated by:</strong> ${user.full_name || user.email}</p>` : ''}
          </div>
        </div>

        <div class="content-grid">
          <div class="section">
            <h3>Concession Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${concession.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Owner:</span>
              <span class="detail-value">${concession.owner}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Size:</span>
              <span class="detail-value">${boundaryGeometry.area.toLocaleString()} hectares</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${concession.permitType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="status-badge ${statusClass}">${concession.status.toUpperCase()}</span>
            </div>
          </div>

          <div class="section">
            <h3>Location Details</h3>
            <div class="detail-row">
              <span class="detail-label">Region:</span>
              <span class="detail-value">${concession.region}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">District:</span>
              <span class="detail-value">${concession.district}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString('en-GB')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Expiry Date:</span>
              <span class="detail-value">${new Date(concession.permitExpiryDate).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        <div class="section full-width">
          <h3>Geometric Properties</h3>
          <div class="geometric-grid">
            <div class="geometric-item">
              <span class="geometric-label">Total Area:</span>
              <span class="geometric-value">${boundaryGeometry.area.toLocaleString()} hectares</span>
            </div>
            <div class="geometric-item">
              <span class="geometric-label">Perimeter:</span>
              <span class="geometric-value">${boundaryGeometry.perimeter.toFixed(2)} km</span>
            </div>
            <div class="geometric-item">
              <span class="geometric-label">Boundary Vertices:</span>
              <span class="geometric-value">${boundaryGeometry.vertices.length} points</span>
            </div>
            <div class="geometric-item">
              <span class="geometric-label">Centroid:</span>
              <span class="geometric-value">${boundaryGeometry.centroid.latitude.toFixed(6)}°N, ${boundaryGeometry.centroid.longitude.toFixed(6)}°E</span>
            </div>
          </div>
        </div>

        ${options.includeMap ? `
          <div class="section full-width">
            <h3>Concession Boundary Map</h3>
            <div class="map-container">
              <div class="map-placeholder">
                📍 Concession Boundary Map<br/>
                <strong>${concession.name}</strong><br/>
                Area: ${boundaryGeometry.area.toLocaleString()} hectares<br/>
                ${boundaryGeometry.vertices.length} boundary points
              </div>
            </div>
            <div class="map-info">
              <div>
                <strong>Coordinate System:</strong> WGS84 (EPSG:4326)
              </div>
              <div>
                <strong>UTM Zone:</strong> 30N (Ghana)
              </div>
              <div>
                <strong>Centroid:</strong> ${boundaryGeometry.centroid.latitude.toFixed(6)}°N, ${boundaryGeometry.centroid.longitude.toFixed(6)}°E
              </div>
              <div>
                <strong>Perimeter:</strong> ${boundaryGeometry.perimeter.toFixed(2)} km
              </div>
            </div>
          </div>
        ` : ''}

        ${options.showCoordinates ? `
          <div class="section full-width">
            <h3>Boundary Coordinates</h3>
            <table class="coordinates-table">
              <thead>
                <tr>
                  <th>Point</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
                </tr>
              </thead>
              <tbody>
                ${boundaryGeometry.vertices.map((vertex) => `
                  <tr>
                    <td>P${vertex.index}</td>
                    <td>${vertex.longitude.toFixed(6)}</td>
                    <td>${vertex.latitude.toFixed(6)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="footer">
          <div class="footer-left">
            <p><strong>Environmental Protection Authority</strong></p>
            <p>Mining Department, Accra, Ghana</p>
            <p>Generated: ${new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <div class="footer-right">
            <p><strong>Document Reference:</strong></p>
            <p class="doc-id">EPA-MC-${concession.id}-${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}</p>
            <p class="verification">This document is computer-generated and does not require a signature</p>
          </div>
        </div>
      </div>
    `
  }
}

// Export singleton instance
export const printService = PrintService.getInstance()
