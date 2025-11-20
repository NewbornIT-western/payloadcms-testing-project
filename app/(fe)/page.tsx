 import {getPayload} from 'payload'
 import config from '@payload-config'
 
 const payload = await getPayload({ config })
 const posts = await payload.find({
   collection: 'posts' as any,
 }) 

 const postByID = await payload.findByID({
    collection: 'posts' as any,
    id: 'some-id',
})

const numberOfPosts = await payload.count({
    collection: 'post' as any,

})

 const createPost = await payload.create({
    collection: 'posts' as any,
    data: {

    }
})

const updateAllPosts = await payload.update({
    collection: 'posts' as any,
    where: {
        // Conditions to filter posts to update
    },
    data: {
        // Fields to update
    },
})

const updateByID = await payload.update({
    collection: 'posts' as any,
    id: 'some-id',
    data: {
        // Fields to update
    }
})

const deletePosts = await payload.delete({
    collection: 'posts' as any,
    where: {
        // Conditions to filter posts to delete
    },
})

const deletePostByID = await payload.delete({
    collection: 'posts' as any,
    id: 'some-id',
})

const findGlobal = await payload.findGlobal({
    slug: 'header',
    depth: 2, // Populate relationships
} as any)

const updateGlobal = await payload.updateGlobal({
    slug: 'header',
    data: {
        // Fields to update
    }
} as any)