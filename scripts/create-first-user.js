#!/usr/bin/env node

// Script to create first admin user for Payload CMS
import { getPayload } from 'payload'
import config from '../payload.config'

async function createFirstUser() {
  try {
    const payload = await getPayload({ config })
    
    // Check if any users exist
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.totalDocs > 0) {
      console.log('✅ Users already exist. No need to create first user.')
      process.exit(0)
    }

    // Create first admin user
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      },
    })

    console.log('✅ First admin user created successfully!')
    console.log('📧 Email: admin@example.com')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error creating first user:', error)
  } finally {
    process.exit(0)
  }
}

createFirstUser()