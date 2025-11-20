import { Block } from 'payload'

export const ContentWithMedia: Block = {
    slug: 'contentWithMedia',
    labels:{
        singular: 'Content with Media Block',
        plural: 'Content with Media Blocks',
    },  
    fields: [
        {
            name: 'content',
            type: 'richText',
        },
        {
            name: 'media',
            type: 'upload', 
            relationTo: 'media' as any,
        },
        {
            type: 'radio',
            name: 'textPosition',
            label: 'Media Position',
            options: ['left', 'right']
        }
    ]
}