import React, { useState } from 'react'
import { Settings, Database, Shield, Globe, Bell, Save, RefreshCw } from 'lucide-react'

interface SystemSettingsProps {
  className?: string
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState({
    systemName: 'EPA Mining Concessions Management System',
    organizationName: 'Environmental Protection Authority - Ghana',
    contactEmail: 'gis@epa.gov.gh',
    maxUsers: 100,
    sessionTimeout: 30,
    enableAuditLogs: true,
    enableEmailNotifications: true,
    defaultUserRole: 'viewer',
    mapDefaultZoom: 7,
    mapDefaultCenter: '7.9, -1.0',
    backupFrequency: 'daily',
    dataRetentionDays: 365
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        systemName: 'EPA Mining Concessions Management System',
        organizationName: 'Environmental Protection Authority - Ghana',
        contactEmail: 'gis@epa.gov.gh',
        maxUsers: 100,
        sessionTimeout: 30,
        enableAuditLogs: true,
        enableEmailNotifications: true,
        defaultUserRole: 'viewer',
        mapDefaultZoom: 7,
        mapDefaultCenter: '7.9, -1.0',
        backupFrequency: 'daily',
        dataRetentionDays: 365
      })
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure system-wide settings and preferences
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* General Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h4 className="text-md font-medium text-gray-900">General Settings</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name
              </label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => setSettings(prev => ({ ...prev, systemName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default User Role
              </label>
              <select
                value={settings.defaultUserRole}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultUserRole: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="viewer">Viewer</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <h4 className="text-md font-medium text-gray-900">Security Settings</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Users
              </label>
              <input
                type="number"
                value={settings.maxUsers}
                onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="auditLogs"
                checked={settings.enableAuditLogs}
                onChange={(e) => setSettings(prev => ({ ...prev, enableAuditLogs: e.target.checked }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="auditLogs" className="text-sm font-medium text-gray-700">
                Enable Audit Logs
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, enableEmailNotifications: e.target.checked }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                Enable Email Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Map Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h4 className="text-md font-medium text-gray-900">Map Settings</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Zoom Level
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.mapDefaultZoom}
                onChange={(e) => setSettings(prev => ({ ...prev, mapDefaultZoom: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Center (Lat, Lng)
              </label>
              <input
                type="text"
                value={settings.mapDefaultCenter}
                onChange={(e) => setSettings(prev => ({ ...prev, mapDefaultCenter: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="7.9, -1.0"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h4 className="text-md font-medium text-gray-900">Data Management</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => setSettings(prev => ({ ...prev, dataRetentionDays: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-600">1.0.1</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="ml-2 text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Environment:</span>
              <span className="ml-2 text-gray-600">Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
