import sharp from 'sharp'
import { lexicalEditor, FixedToolbarFeature,BlocksFeature } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import path from 'path'
import { Users } from './app/collections/user'
import { Posts } from './app/collections/posts/config'
import {Header} from './app/globals/Header/config'

const Media = {
  slug: 'media',
  upload: true,
  admin: {
    group: 'Collections',
  },
  fields: [],
}

const Navigation = {
  slug: 'navigation',
  label: 'Navigation',
  fields: [
    {
      name: 'navItems',
      type: 'array' as const,
      label: 'Navigation Items',
      fields: [
        {
          name: 'label',
          type: 'text' as const,
          required: true,
          label: 'Menu Label',
        },
        {
          name: 'url',
          type: 'text' as const,
          required: true,
          label: 'URL',
        },
        {
          name: 'newTab',
          type: 'checkbox' as const,
          label: 'Open in New Tab',
          defaultValue: false,
        },
      ],
    },
  ],
}

// Site Settings Global
const SiteSettings = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'siteName',
      type: 'text' as const,
      label: 'Site Name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea' as const,
      label: 'Site Description',
    },
    {
      name: 'footer',
      type: 'group' as const,
      label: 'Footer',
      fields: [
        {
          name: 'copyright',
          type: 'text' as const,
          label: 'Copyright Text',
        },
      ],
    },
  ],
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
    autoLogin: {
      email: 'dev@payloadcms.com',
      password: 'test',
      prefillOnly: false, // Auto login instead of just prefill
    },
    meta: {
      titleSuffix: '- My App Admin',
      description: 'Admin panel for My App',
    },
  },
  onInit: async (payload) => {
    // Create default admin user if none exists
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })

      if (users.totalDocs === 0) {
        console.log('🔄 Creating default admin user...')
        await payload.create({
          collection: 'users',
          data: {
            email: 'dev@payloadcms.com',
            password: 'test',
            name: 'Dev User',
            role: 'admin',
          } as any,
        })
        console.log('✅ Default admin user created!')
        console.log('📧 Email: dev@payloadcms.com')
        console.log('🔑 Password: test')
      } else {
        console.log('ℹ️  Admin user already exists')
      }
    } catch (error) {
      console.error('❌ Error during user creation:', error)
    }
  },
    cors: ['http://localhost:3000', process.env.DOMAIN_NAME || ''],
    csrf: ['http://localhost:3000', process.env.DOMAIN_NAME || ''],
  collections: [Users, Media, Posts],
  globals: [Header, Navigation, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
  ],
  serverURL: process.env.SERVER_URL || ' ',
})