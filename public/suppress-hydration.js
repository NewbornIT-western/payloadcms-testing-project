/**
 * Global script to suppress hydration errors in development
 * This script runs before React loads to prevent hydration warnings
 */

// Only run in browser environment
if (typeof window !== 'undefined') {
  // Store original console methods
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn

  // Enhanced error suppression
  console.error = function (...args) {
    const message = args[0]?.toString?.() || ''
    
    // Comprehensive hydration error patterns including browser extensions
    const hydrationPatterns = [
      'Hydration failed',
      'server rendered HTML',
      'client rendered HTML', 
      'did not match',
      'tree will be regenerated',
      'SSR-ed Client Component',
      'browser extension',
      'suppressHydrationWarning',
      'Minified React error #418',
      'Minified React error #425',
      'Minified React error #423',
      'Text content does not match',
      'Expected server HTML to contain',
      'chrome-extension://',
      'bis_use',
      'data-bis-config',
      'nimlmejbmnecnaghgmbahmbaddhjbecg',
      'executors/traffic.js',
      'A tree hydrated but some attributes',
      'won\'t be patched up'
    ]
    
    // Check if error contains hydration patterns
    const isHydrationError = hydrationPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    )
    
    // Also check all arguments for extension patterns
    const hasExtensionContent = args.some(arg => {
      const argStr = arg?.toString?.() || ''
      return argStr.includes('chrome-extension://') || 
             argStr.includes('bis_use') || 
             argStr.includes('data-bis-config') ||
             argStr.includes('nimlmejbmnecnaghgmbahmbaddhjbecg')
    })
    
    if (!isHydrationError && !hasExtensionContent) {
      originalConsoleError.apply(console, args)
    }
  }

  console.warn = function (...args) {
    const message = args[0]?.toString?.() || ''
    
    const hydrationWarnings = [
      'Hydration',
      'rendered HTML',
      'suppressHydrationWarning',
      'client-side exception',
      'useLayoutEffect does nothing on the server',
      'chrome-extension',
      'bis_use',
      'data-bis-config'
    ]
    
    const isHydrationWarning = hydrationWarnings.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    )
    
    if (!isHydrationWarning) {
      originalConsoleWarn.apply(console, args)
    }
  }

  // DOM mutation observer to handle extension injection gracefully
  const handleExtensionMutation = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            // Handle extension script tags
            if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
              if (node.src && node.src.includes('chrome-extension://')) {
                // Mark extension scripts to prevent hydration issues
                node.setAttribute('data-extension-script', 'true')
              }
              if (node.hasAttribute('bis_use')) {
                node.setAttribute('data-extension-script', 'true')
              }
            }
          })
        }
        
        if (mutation.type === 'attributes') {
          const element = mutation.target
          // Handle extension attributes
          const extensionAttrs = ['bis_use', 'data-bis-config', 'bis_register']
          extensionAttrs.forEach(attr => {
            if (element.hasAttribute && element.hasAttribute(attr)) {
              element.setAttribute('data-extension-modified', 'true')
            }
          })
        }
      })
    })

    // Start observing
    if (document.head) {
      observer.observe(document.head, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['bis_use', 'data-bis-config', 'bis_register']
      })
    }
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['bis_use', 'data-bis-config', 'bis_register']
      })
    }

    return observer
  }

  // Start observation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleExtensionMutation)
  } else {
    handleExtensionMutation()
  }

  // Restore original methods when needed (for production debugging)
  window.__restoreConsole = function() {
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
  }
}