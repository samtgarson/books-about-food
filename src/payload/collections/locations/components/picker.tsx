'use client'

import { useAllFormFields, useFormFields } from '@payloadcms/ui'
import { useCallback, useRef, useState, useTransition } from 'react'
import {
  type LocationSearchResult,
  getLocationDetails,
  searchLocations
} from './actions'

export function LocationPicker() {
  const [, dispatchFields] = useAllFormFields()
  const displayText = useFormFields(
    ([fields]) => fields.displayText?.value as string | undefined
  )

  const [query, setQuery] = useState(displayText ?? '')
  const [results, setResults] = useState<LocationSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const sessionToken = useRef(Math.random().toString(36).substring(2, 12))
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (value.length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const searchResults = await searchLocations(value, sessionToken.current)
        setResults(searchResults)
        setIsOpen(true)
      })
    }, 250)
  }, [])

  const updateField = useCallback(
    (path: string, value: string | number) => {
      dispatchFields({
        type: 'UPDATE',
        path,
        value
      })
    },
    [dispatchFields]
  )

  const handleSelect = useCallback(
    async (result: LocationSearchResult) => {
      setIsOpen(false)
      setQuery(result.displayText)

      const details = await getLocationDetails(
        result.placeId,
        result.displayText
      )
      if (!details) return

      updateField('placeId', details.placeId)
      updateField('displayText', details.displayText)
      updateField('slug', details.slug)
      updateField('country', details.country ?? '')
      updateField('region', details.region ?? '')
      updateField('latitude', details.latitude)
      updateField('longitude', details.longitude)

      // Generate new session token for next search
      sessionToken.current = Math.random().toString(36).substring(2, 12)
    },
    [updateField]
  )

  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 500
        }}
      >
        Search Location
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search for a location..."
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          fontSize: '14px'
        }}
      />
      {isPending && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '42px',
            color: 'var(--theme-elevation-400)'
          }}
        >
          Searching...
        </div>
      )}
      {isOpen && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            padding: 0,
            listStyle: 'none',
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 100
          }}
        >
          {results.map((result) => (
            <li
              key={result.placeId}
              onClick={() => handleSelect(result)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--theme-elevation-100)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--theme-elevation-100)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {result.displayText}
            </li>
          ))}
        </ul>
      )}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
