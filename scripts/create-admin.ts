import { getPayload } from 'payload'
import config from '@payload-config'

async function createAdmin() {
  try {
    const payload = await getPayload({ config })
    
    console.log('🔄 Checking for existing users...')
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.totalDocs === 0) {
      console.log('🔄 Creating admin user...')
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
          name: 'Dev User',
          role: 'admin',
        } as any,
      })
      console.log('✅ Admin user created!')
      console.log('📧 Email: dev@payloadcms.com')
      console.log('🔑 Password: test')
    } else {
      console.log('ℹ️  User already exists')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createAdmin()
