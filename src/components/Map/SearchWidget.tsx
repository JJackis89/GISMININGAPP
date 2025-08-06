import React, { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Building2, MapIcon, X } from 'lucide-react'

interface SearchSuggestion {
  id: string
  title: string
  subtitle: string
  type: 'concession' | 'district' | 'region' | 'location'
  data: any
  icon: React.ReactNode
}

interface SearchWidgetProps {
  onSearchSelect: (suggestion: SearchSuggestion) => void
  concessions: any[]
  className?: string
}

export default function SearchWidget({ onSearchSelect, concessions, className = '' }: SearchWidgetProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Generate suggestions based on query
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const query = searchQuery.toLowerCase()
    const suggestions: SearchSuggestion[] = []

    // Search in concessions
    concessions.forEach(concession => {
      const matchFields = [
        { field: concession.name || concession.Name, label: 'Name' },
        { field: concession.contactPerson || concession.ContactPerson, label: 'Contact Person' },
        { field: concession.town || concession.Town, label: 'Town' },
        { field: concession.district || concession.District, label: 'District' },
        { field: concession.region || concession.Region, label: 'Region' },
        { field: concession.permitType || concession.PermitType, label: 'Permit Type' },
        { field: concession.id || concession.ConcessionID, label: 'ID' }
      ]

      matchFields.forEach(({ field, label }) => {
        if (field && field.toString().toLowerCase().includes(query)) {
          const title = concession.name || concession.Name || `Concession ${concession.id || concession.ConcessionID}`
          const subtitle = `${label}: ${field} • ${concession.district || concession.District || 'Unknown District'}`
          
          // Avoid duplicates
          if (!suggestions.find(s => s.id === concession.id && s.title === title)) {
            suggestions.push({
              id: concession.id || concession.ConcessionID || Math.random().toString(),
              title,
              subtitle,
              type: 'concession',
              data: concession,
              icon: <Building2 className="w-4 h-4 text-blue-600" />
            })
          }
        }
      })
    })

    // Search districts (extract unique districts from concessions)
    const districts = new Set<string>()
    concessions.forEach(c => {
      const district = c.district || c.District
      if (district && district.toLowerCase().includes(query)) {
        districts.add(district)
      }
    })

    districts.forEach(district => {
      const concessionsInDistrict = concessions.filter(c => 
        (c.district || c.District) === district
      ).length

      suggestions.push({
        id: `district-${district}`,
        title: `${district} District`,
        subtitle: `${concessionsInDistrict} concession${concessionsInDistrict !== 1 ? 's' : ''}`,
        type: 'district',
        data: { district, concessions: concessionsInDistrict },
        icon: <MapIcon className="w-4 h-4 text-green-600" />
      })
    })

    // Search regions (extract unique regions from concessions)
    const regions = new Set<string>()
    concessions.forEach(c => {
      const region = c.region || c.Region
      if (region && region.toLowerCase().includes(query)) {
        regions.add(region)
      }
    })

    regions.forEach(region => {
      const concessionsInRegion = concessions.filter(c => 
        (c.region || c.Region) === region
      ).length

      suggestions.push({
        id: `region-${region}`,
        title: `${region} Region`,
        subtitle: `${concessionsInRegion} concession${concessionsInRegion !== 1 ? 's' : ''}`,
        type: 'region',
        data: { region, concessions: concessionsInRegion },
        icon: <MapPin className="w-4 h-4 text-purple-600" />
      })
    })

    // Limit to top 8 suggestions and sort by relevance
    return suggestions
      .slice(0, 8)
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.title.toLowerCase().startsWith(query)
        const bExact = b.title.toLowerCase().startsWith(query)
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        
        // Then by type (concessions first)
        if (a.type === 'concession' && b.type !== 'concession') return -1
        if (a.type !== 'concession' && b.type === 'concession') return 1
        
        return 0
      })
  }

  // Handle input change
  useEffect(() => {
    const newSuggestions = generateSuggestions(query)
    setSuggestions(newSuggestions)
    setSelectedIndex(-1)
    setIsOpen(newSuggestions.length > 0)
  }, [query, concessions])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSearchSelect(suggestion)
    inputRef.current?.blur()
  }

  // Handle clear search
  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder="Search concessions, districts, regions..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-epa-orange-500 focus:border-epa-orange-500 bg-white text-gray-900 placeholder-gray-500 text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 transition-colors duration-150 ${
                  index === selectedIndex ? 'bg-epa-orange-50 border-l-4 border-epa-orange-500' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {suggestion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.subtitle}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {suggestion.type === 'concession' && 'Mining Concession'}
                    {suggestion.type === 'district' && 'Administrative District'}
                    {suggestion.type === 'region' && 'Administrative Region'}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer with search hint */}
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span className="text-epa-orange-600 font-medium">{suggestions.length} result{suggestions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
