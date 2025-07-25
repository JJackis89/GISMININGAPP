import React from 'react';
import { MiningConcession } from '../../types';
import { 
  processConcessionBoundary, 
  formatCoordinates, 
  type BoundaryGeometry 
} from '../../utils/geometryUtils';

interface PrintLayoutTemplateProps {
  concession: MiningConcession;
  mapImageUrl?: string;
  printDate: Date;
  logoUrl?: string;
  showCoordinates?: boolean;
  showMap?: boolean;
  coordinateFormat?: 'decimal' | 'dms' | 'utm';
}

export const PrintLayoutTemplate: React.FC<PrintLayoutTemplateProps> = ({
  concession,
  mapImageUrl,
  printDate,
  logoUrl = '/epa-logo.png',
  showCoordinates = true,
  showMap = true,
  coordinateFormat = 'decimal'
}) => {
  // Process boundary geometry to extract vertices and calculations
  const boundaryGeometry: BoundaryGeometry = processConcessionBoundary(concession);
  
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatSize = (size: number) => {
    return `${size.toLocaleString()} hectares`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-white p-8 print:p-6 font-sans text-black">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 border-b-4 border-epa-orange-500 pb-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img 
              src={logoUrl} 
              alt="EPA Ghana Logo" 
              className="h-20 w-20 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-20 w-20 bg-epa-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
              EPA
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Environmental Protection Authority
            </h1>
            <p className="text-lg text-epa-orange-600 font-semibold">
              Republic of Ghana
            </p>
            <p className="text-md text-gray-600 font-medium">
              Mining Concession Management System
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p className="font-medium">Print Date: {formatDate(printDate)}</p>
          <p>Document ID: EPA-MC-{concession.id}</p>
          <p className="text-xs text-gray-500 mt-2">Official Document</p>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          MINING CONCESSION CERTIFICATE
        </h2>
        <div className="bg-epa-orange-50 border-l-6 border-epa-orange-500 p-6 rounded-r-lg">
          <h3 className="text-2xl font-bold text-epa-orange-800 mb-2">
            {concession.name}
          </h3>
          <p className="text-epa-orange-700 font-medium">
            Concession Reference: {concession.id}
          </p>
        </div>
      </div>

      {/* Location Information Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
          <label className="block text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">
            Region
          </label>
          <p className="text-xl font-semibold text-blue-900">
            {concession.region}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
          <label className="block text-sm font-bold text-green-800 mb-2 uppercase tracking-wide">
            District
          </label>
          <p className="text-xl font-semibold text-green-900">
            {concession.district}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
          <label className="block text-sm font-bold text-purple-800 mb-2 uppercase tracking-wide">
            Town/Location
          </label>
          <p className="text-xl font-semibold text-purple-900">
            {(concession as any).town || 'Not specified'}
          </p>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">CONCESSION BOUNDARY MAP</h4>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            {mapImageUrl ? (
              <div className="relative">
                <img 
                  src={mapImageUrl} 
                  alt="Concession Boundary Map" 
                  className="w-full h-96 object-contain rounded border"
                />
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 p-3 rounded shadow text-xs">
                  <p className="font-semibold">Map Scale: 1:25,000</p>
                  <p>Coordinate System: WGS 84 UTM Zone 30N</p>
                  <p>Datum: WGS 1984</p>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-xl font-semibold mb-2">CONCESSION MAP</p>
                  <p className="text-sm">Boundary map will be displayed here</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {boundaryGeometry.vertices.length > 0 
                      ? `${boundaryGeometry.vertices.length} boundary vertices | ${boundaryGeometry.perimeter.toFixed(2)} km perimeter`
                      : 'No coordinate data available'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Concession Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-indigo-800 mb-2 uppercase tracking-wide">
              Concession Size
            </label>
            <p className="text-2xl font-bold text-indigo-900">
              {formatSize(concession.size)}
            </p>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-emerald-800 mb-2 uppercase tracking-wide">
              Contract Period
            </label>
            <p className="text-lg font-semibold text-emerald-900">
              {(concession as any).contractPeriod || 'As per permit conditions'}
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-rose-800 mb-2 uppercase tracking-wide">
              Permit Type
            </label>
            <p className="text-lg font-semibold text-rose-900 capitalize">
              {concession.permitType}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-violet-50 border border-violet-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-violet-800 mb-2 uppercase tracking-wide">
              Contract Number
            </label>
            <p className="text-lg font-bold text-violet-900 font-mono">
              {(concession as any).contractNumber || `CON-${concession.id}`}
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-amber-800 mb-2 uppercase tracking-wide">
              Permit Number
            </label>
            <p className="text-lg font-bold text-amber-900 font-mono">
              {(concession as any).permitNumber || `PERMIT-${concession.id}`}
            </p>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg">
            <label className="block text-sm font-bold text-cyan-800 mb-2 uppercase tracking-wide">
              Concession Owner
            </label>
            <p className="text-lg font-semibold text-cyan-900">
              {concession.owner}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Concession Information */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-8">
        <h4 className="text-xl font-bold text-gray-900 mb-6">
          DETAILED CONCESSION INFORMATION
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(concession.status)}`}>
                {concession.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Issue Date:</span>
              <span className="font-mono">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Expiry Date:</span>
              <span className="font-mono text-red-600 font-semibold">
                {formatDate(concession.permitExpiryDate)}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Mineral Type:</span>
              <span className="capitalize font-medium">
                {(concession as any).mineralType || 'General Mining'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Mining Method:</span>
              <span className="capitalize font-medium">
                {(concession as any).miningMethod || 'Surface Mining'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Environmental Status:</span>
              <span className="text-green-600 font-semibold">
                {(concession as any).environmentalStatus || 'Compliant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      {concession.contactInfo && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-bold text-blue-900 mb-4">CONTACT INFORMATION</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {concession.contactInfo.phone && (
              <div>
                <span className="font-semibold text-blue-800">Phone:</span>
                <p className="text-blue-900 font-mono">{concession.contactInfo.phone}</p>
              </div>
            )}
            {concession.contactInfo.email && (
              <div>
                <span className="font-semibold text-blue-800">Email:</span>
                <p className="text-blue-900 font-mono">{concession.contactInfo.email}</p>
              </div>
            )}
            {concession.contactInfo.address && (
              <div>
                <span className="font-semibold text-blue-800">Address:</span>
                <p className="text-blue-900">{concession.contactInfo.address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coordinates Table */}
      {showCoordinates && boundaryGeometry.vertices.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            BOUNDARY COORDINATES (WGS 84)
          </h4>
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-epa-orange-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Vertex</th>
                  <th className="px-4 py-3 text-left font-bold">Longitude (°)</th>
                  <th className="px-4 py-3 text-left font-bold">Latitude (°)</th>
                  <th className="px-4 py-3 text-left font-bold">Easting (m)</th>
                  <th className="px-4 py-3 text-left font-bold">Northing (m)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {boundaryGeometry.vertices.map((vertex, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold">V{vertex.index}</td>
                    <td className="px-4 py-3 font-mono">{vertex.longitude.toFixed(6)}</td>
                    <td className="px-4 py-3 font-mono">{vertex.latitude.toFixed(6)}</td>
                    <td className="px-4 py-3 font-mono text-blue-600">{vertex.easting?.toLocaleString() || '-'}</td>
                    <td className="px-4 py-3 font-mono text-blue-600">{vertex.northing?.toLocaleString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Total Vertices:</strong> {boundaryGeometry.vertices.length}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Perimeter:</strong> {boundaryGeometry.perimeter.toFixed(2)} km
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <strong>Calculated Area:</strong> {boundaryGeometry.area.toLocaleString()} hectares
            </div>
          </div>
        </div>
      )}
      
      {/* Centroid Information */}
      {boundaryGeometry.vertices.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-8">
          <h4 className="text-md font-bold text-indigo-900 mb-3">GEOMETRIC PROPERTIES</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-indigo-800">Centroid:</span>
              <p className="text-indigo-900 font-mono">
                {boundaryGeometry.centroid.latitude.toFixed(6)}°N, {boundaryGeometry.centroid.longitude.toFixed(6)}°E
              </p>
            </div>
            <div>
              <span className="font-semibold text-indigo-800">Bounding Box:</span>
              <p className="text-indigo-900 font-mono text-xs">
                N: {boundaryGeometry.boundingBox.north.toFixed(4)}° | S: {boundaryGeometry.boundingBox.south.toFixed(4)}°<br/>
                E: {boundaryGeometry.boundingBox.east.toFixed(4)}° | W: {boundaryGeometry.boundingBox.west.toFixed(4)}°
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legal Notice */}
      <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-bold text-yellow-800 mb-3">LEGAL NOTICE</h4>
        <div className="text-sm text-yellow-900 space-y-2">
          <p>
            <strong>1.</strong> This concession is granted subject to the provisions of the Minerals and Mining Act, 2006 (Act 703) and all applicable regulations.
          </p>
          <p>
            <strong>2.</strong> The holder must comply with all environmental protection requirements as specified by the Environmental Protection Authority.
          </p>
          <p>
            <strong>3.</strong> This document serves as official proof of mining rights within the specified boundaries.
          </p>
          <p>
            <strong>4.</strong> Any changes to concession boundaries or ownership must be approved by the EPA Mining Division.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-epa-orange-500 pt-6 mt-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-bold text-lg text-gray-900">Environmental Protection Authority</p>
            <p className="text-gray-700 font-medium">Mining Concessions Division</p>
            <p className="text-gray-600">Republic of Ghana</p>
            <div className="mt-3 text-sm text-gray-600">
              <p>📍 EPA House, Ministries, Accra</p>
              <p>📞 +233 302 664 697-8</p>
              <p>✉️ info@epa.gov.gh</p>
              <p>🌐 www.epa.gov.gh</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Generated: {formatDate(printDate)}</p>
            <p className="text-sm text-gray-600">Page 1 of 1</p>
            <div className="mt-4 p-3 bg-gray-100 rounded border">
              <p className="text-xs font-semibold text-gray-800">Document Verification</p>
              <p className="text-xs text-gray-600 font-mono">EPA-MC-{concession.id}-{formatDate(printDate).replace(/\//g, '')}</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">
            <strong>CONFIDENTIAL DOCUMENT:</strong> This document contains sensitive information and is intended for official use only.
          </p>
          <p className="text-xs text-gray-400">
            Unauthorized reproduction, distribution, or use of this document is strictly prohibited and may result in legal action.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintLayoutTemplate;
