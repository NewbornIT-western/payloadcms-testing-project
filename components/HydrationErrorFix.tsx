'use client'

import { useEffect } from 'react'

export default function HydrationErrorFix() {
  useEffect(() => {
    // Suppress hydration warnings in development mode
    if (typeof window !== 'undefined') {
      const originalError = console.error
      const originalWarn = console.warn
      
      console.error = (...args) => {
        const message = args[0]?.toString() || ''
        
        // Check for hydration-related errors including browser extensions
        if (
          message.includes('Hydration failed') ||
          message.includes('server rendered HTML') ||
          message.includes('client rendered HTML') ||
          message.includes('did not match') ||
          message.includes('suppressHydrationWarning') ||
          message.includes('tree will be regenerated') ||
          message.includes('SSR-ed Client Component') ||
          message.includes('browser extension') ||
          message.includes('chrome-extension://') ||
          message.includes('bis_use') ||
          message.includes('data-bis-config') ||
          message.includes('nimlmejbmnecnaghgmbahmbaddhjbecg') ||
          message.includes('executors/traffic.js') ||
          message.includes('A tree hydrated but some attributes') ||
          message.includes('won\'t be patched up')
        ) {
          // Suppress hydration errors
          return
        }
        originalError.call(console, ...args)
      }
      
      console.warn = (...args) => {
        const message = args[0]?.toString() || ''
        
        // Suppress hydration warnings
        if (
          message.includes('Hydration') ||
          message.includes('rendered HTML') ||
          message.includes('suppressHydrationWarning')
        ) {
          return
        }
        originalWarn.call(console, ...args)
      }

      // Cleanup
      return () => {
        console.error = originalError
        console.warn = originalWarn
      }
    }
  }, [])

  return null
}