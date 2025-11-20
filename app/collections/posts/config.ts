import {CollectionConfig} from 'payload'
import { ContentWithMedia } from '../blocks/ContentWithMedia'
import { postsHooks } from './hooks'
import { lexicalEditor, FixedToolbarFeature,BlocksFeature } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        group: 'Posts',
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
        listSearchableFields: ['title', 'slug'],
    },
    hooks: postsHooks,
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
    },
    defaultSort: '-title',
    timestamps: true,
    fields:[
        {
            type: 'blocks',
            blocks: [ContentWithMedia],
            name: 'block test',
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
        },
        {
            name: 'content',
            type: 'richText',
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                ...defaultFeatures,
                BlocksFeature({
                    blocks: [ContentWithMedia],
                }),
                FixedToolbarFeature(),
                ],
            }),
        }

    ]
 }
