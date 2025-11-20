import {GlobalConfig} from 'payload'

export const Header: GlobalConfig = {
    slug: 'header',
    fields: [
        {
        type: 'array',
        name: 'headerLinks',
        fields: [
            {
                name: 'destination',
                type: 'relationship',
                relationTo: 'posts' as any, // Reference to Posts collection slug
            },
            {
                name: 'newtab',
                label: 'Open in New Tab',
                type: 'checkbox',
                defaultValue: false, 
            }
        ]
    }
    ]
}