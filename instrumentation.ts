export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side only code
    const { patchPayloadHydration } = await import('./lib/payload-hydration-patch')
    patchPayloadHydration()
  }
}
