'use client'

import { useEffect } from 'react'

export function PayloadLayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject admin-hydration-fix script if not already present
    if (!document.querySelector('script[data-admin-hydration-fix]')) {
      const script = document.createElement('script')
      script.src = '/admin-hydration-fix.js'
      script.setAttribute('data-admin-hydration-fix', 'true')
      script.async = false
      document.head.prepend(script)
    }

    // Force remove extension attributes on mount
    const removeExtensionAttrs = () => {
      const attrs = ['bis_register', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
      attrs.forEach(attr => {
        Array.from(document.body.attributes).forEach(bodyAttr => {
          if (bodyAttr.name === attr || bodyAttr.name.includes('__processed_')) {
            document.body.removeAttribute(bodyAttr.name)
          }
        })
      })
    }

    removeExtensionAttrs()
    
    // Monitor and clean up any new attributes added by extensions
    const observer = new MutationObserver(() => {
      removeExtensionAttrs()
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['bis_register', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'],
    })

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
