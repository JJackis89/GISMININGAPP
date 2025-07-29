/**
 * Hydration-safe utilities for browser APIs
 * Prevents hydration mismatch errors by handling SSR vs client differences
 */

import { useEffect, useState } from 'react'

/**
 * Hook that only runs after hydration is complete
 * Prevents hydration mismatch by ensuring client-only code runs after mount
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook for safely accessing window properties after hydration
 */
export function useWindowProperty<T>(
  getter: () => T,
  defaultValue: T
): T {
  const [value, setValue] = useState<T>(defaultValue)
  const isClient = useIsClient()

  useEffect(() => {
    if (isClient) {
      setValue(getter())
    }
  }, [isClient, getter])

  return value
}

/**
 * Hook for safely accessing localStorage after hydration
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const isClient = useIsClient()

  useEffect(() => {
    if (isClient) {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key, isClient])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Safe wrapper for document/window operations
 */
export const safeWindow = {
  getLocation: () => {
    if (typeof window !== 'undefined') {
      return window.location
    }
    return {
      hostname: 'localhost',
      pathname: '/',
      search: '',
      hash: ''
    }
  },

  getHostname: () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname
    }
    return 'localhost'
  },

  reload: () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
}

/**
 * Safe wrapper for localStorage operations
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
        return null
      }
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }
  },

  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error)
      }
    }
  }
}
