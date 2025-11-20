import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Collections',
  },
  access: {
    // Only admins can see all users
    read: ({ req: { user } }) => {
      if ((user as any)?.role === 'admin') return true
      // Users can only see themselves
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Only admins can create users
    create: ({ req: { user } }) => (user as any)?.role === 'admin',
    // Only admins can update other users, users can update themselves
    update: ({ req: { user } }) => {
      if ((user as any)?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'User Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      admin: {
        description: 'Admin: Full access, Editor: Can edit content, User: Limited access',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media' as any,
      label: 'Profile Picture',
    },
  ],
}
