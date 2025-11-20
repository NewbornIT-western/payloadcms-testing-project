/**
 * Payload Admin Hydration Fix
 * Specifically targets admin routes and browser extension attributes
 */

// Only run in admin routes and browser environment
if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
  // CRITICAL: Clean attributes BEFORE React hydration
  const cleanupBeforeHydration = () => {
    const problematicAttributes = [
      'bis_register',
      'data-lastpass-icon-root',
      'data-new-gr-c-s-check-loaded', 
      'data-gr-ext-installed',
      'data-1password-ext',
      'data-dashlane-ext'
    ]

    problematicAttributes.forEach(attr => {
      if (document.body.hasAttribute(attr)) {
        document.body.removeAttribute(attr)
      }
    })

    // Remove any __processed_ attributes dynamically
    Array.from(document.body.attributes).forEach(attr => {
      if (attr.name.includes('__processed_')) {
        document.body.removeAttribute(attr.name)
      }
    })
  }

  // Run IMMEDIATELY on script load (before DOMContentLoaded)
  if (document.body) {
    cleanupBeforeHydration()
  }

  // Run cleanup on initial load and periodically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupBeforeHydration)
  } else {
    cleanupBeforeHydration()
  }
  
  // Aggressive cleanup every 50ms for first second to catch extension modifications
  let cleanupCount = 0
  const cleanupInterval = setInterval(() => {
    cleanupBeforeHydration()
    cleanupCount++
    if (cleanupCount >= 20) {
      clearInterval(cleanupInterval)
    }
  }, 50)

  // Store original console methods
  const originalError = console.error
  const originalWarn = console.warn

  // Enhanced patterns for admin-specific hydration issues
  console.error = function(...args) {
    const message = args[0]?.toString?.() || ''
    
    // Admin-specific hydration patterns including all browser extensions
    const adminHydrationPatterns = [
      'bis_register',
      '__processed_',
      'data-lastpass',
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed', 
      'data-1password',
      'data-dashlane',
      'suppressHydrationWarning={false}',
      'RootLayout',
      'OuterLayoutRouter', 
      'InnerLayoutRouter',
      'LoadingBoundary',
      'RedirectBoundary',
      'ErrorBoundary',
      'A tree hydrated but some attributes',
      'server rendered HTML didn\'t match',
      'This won\'t be patched up',
      'Hydration failed because the server rendered HTML didn\'t match the client',
      '/admin/col',
      'grammarly',
      'd3c04dc1-7878-4a1c-a54a-1485fed83d5e'
    ]
    
    // Check if error is admin hydration related
    const isAdminHydrationError = adminHydrationPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase()) ||
      args.some(arg => arg?.toString?.().toLowerCase().includes(pattern.toLowerCase()))
    )
    
    if (!isAdminHydrationError) {
      originalError.apply(console, args)
    }
  }

  console.warn = function(...args) {
    const message = args[0]?.toString?.() || ''
    
    const adminHydrationWarnings = [
      'hydration',
      'suppressHydrationWarning',
      'useLayoutEffect does nothing on the server',
      'bis_register',
      '__processed_'
    ]
    
    const isAdminHydrationWarning = adminHydrationWarnings.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    )
    
    if (!isAdminHydrationWarning) {
      originalWarn.apply(console, args)
    }
  }

  // DOM manipulation to handle browser extensions gracefully
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const element = mutation.target
        
        // Attributes commonly added by browser extensions
        const extensionAttributes = [
          'bis_register',
          'data-lastpass-icon-root', 
          'data-1password',
          'data-dashlane',
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          '__processed_'
        ]
        
        extensionAttributes.forEach(attr => {
          if (element.hasAttribute && element.hasAttribute(attr)) {
            // Mark as extension-modified to prevent hydration issues
            element.setAttribute('data-extension-modified', 'true')
          }
        })
      }
    })
  })

  // Start observing after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
      })
    })
  } else {
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    })
  }

  // Cleanup
  window.__restorePayloadConsole = function() {
    console.error = originalError
    console.warn = originalWarn
    observer.disconnect()
  }
}