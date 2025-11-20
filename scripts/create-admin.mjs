/**
 * Manual script to create admin user for Payload CMS
 * Run this if onInit hook doesn't work
 */

import { getPayload } from 'payload'

async function createAdminUser() {
  try {
    console.log('🚀 Connecting to Payload...')
    
    // Import the config
    const configPromise = import('../payload.config.ts')
    const { default: config } = await configPromise
    
    const payload = await getPayload({ config })
    
    console.log('✅ Connected to Payload')
    
    // Check if users exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    if (existingUsers.totalDocs > 0) {
      console.log('ℹ️  Users already exist. Skipping creation.')
      console.log('📧 Try logging in with existing credentials')
      process.exit(0)
    }
    
    // Create admin user
    console.log('🔨 Creating admin user...')
    
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'dev@payloadcms.com',
        password: 'test',
        name: 'Dev Admin',
        role: 'admin',
      },
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: dev@payloadcms.com')
    console.log('🔑 Password: test')
    console.log('🌐 Go to: http://localhost:3000/admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:')
    console.error(error)
    
    // Common solutions
    console.log('\n💡 Common solutions:')
    console.log('1. Make sure MongoDB is running')
    console.log('2. Check DATABASE_URI in .env file')
    console.log('3. Restart the dev server: npm run dev')
    console.log('4. Try accessing /admin/create-first-user')
    
  } finally {
    process.exit(0)
  }
}

// Run the script
createAdminUser()