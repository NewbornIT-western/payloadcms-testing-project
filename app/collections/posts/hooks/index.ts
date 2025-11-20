import type { 
  CollectionBeforeChangeHook, 
  CollectionAfterChangeHook, 
  CollectionBeforeValidateHook, 
  CollectionBeforeDeleteHook, 
  CollectionAfterDeleteHook, 
  CollectionAfterReadHook,
  CollectionBeforeReadHook,
  CollectionAfterOperationHook,
  CollectionBeforeOperationHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterRefreshHook,
  CollectionAfterMeHook,
  CollectionAfterForgotPasswordHook,
} from 'payload'

// ============================================
// BEFORE VALIDATE HOOK
// ============================================
export const beforeValidateHook: CollectionBeforeValidateHook = async ({
  data, // incoming data
  req, // full express request
  operation, // 'create' | 'update'
  originalDoc, // original document (for update operations)
  context, // custom context object
}) => {
  // Runs before validation
  console.log('Before Validate:', operation)
  console.log('User:', req.user?.email)
  console.log('Original Doc:', originalDoc?.id)
  
  return data
}

// ============================================
// BEFORE CHANGE HOOK
// ============================================
export const beforeChangeHook: CollectionBeforeChangeHook = async ({
  data, // incoming data to be changed
  req, // full express request
  operation, // 'create' | 'update'
  originalDoc, // original document (for updates)
  context, // custom context object
}) => {
  // Runs before create/update
  // Auto-generate slug from title if not provided
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Add timestamps
  if (operation === 'create') {
    data.createdBy = req.user?.id
  }
  data.updatedBy = req.user?.id

  console.log('Before Change:', operation, data.slug)
  console.log('User:', req.user?.email)
  console.log('Original Doc ID:', originalDoc?.id)
  
  return data
}

// ============================================
// AFTER CHANGE HOOK
// ============================================
export const afterChangeHook: CollectionAfterChangeHook = async ({
  doc, // full document after change
  req, // full express request
  operation, // 'create' | 'update'
  previousDoc, // document before change (for updates)
  context, // custom context object
}) => {
  // Runs after create/update
  console.log('After Change:', operation, doc.id)
  console.log('User:', req.user?.email)
  console.log('Previous Doc ID:', previousDoc?.id)
  // Don't log full doc as it may contain non-serializable data
  
  // You can trigger external actions here
  // e.g., send notification, update cache, revalidate pages, etc.
  
  return doc
}

// ============================================
// BEFORE DELETE HOOK
// ============================================
export const beforeDeleteHook: CollectionBeforeDeleteHook = async ({
  req, // full express request
  id, // document id being deleted
  context, // custom context object
}) => {
  // Runs before delete
  console.log('Before Delete:', id)
  console.log('User:', req.user?.email)
  
  // You can prevent deletion here by throwing an error
  // if (someCondition) {
  //   throw new Error('Cannot delete this post')
  // }
}

// ============================================
// AFTER DELETE HOOK
// ============================================
export const afterDeleteHook: CollectionAfterDeleteHook = async ({
  req, // full express request
  id, // document id that was deleted
  doc, // deleted document
  context, // custom context object
}) => {
  // Runs after delete
  console.log('After Delete:', id)
  console.log('User:', req.user?.email)
  // Don't log full doc as it may contain non-serializable data
  
  // Clean up related data here
  // e.g., delete related media, clear cache, etc.
  
  return doc
}

// ============================================
// AFTER READ HOOK
// ============================================
export const afterReadHook: CollectionAfterReadHook = async ({
  doc, // document that was read
  req, // full express request
  query, // query used to find the document
  findMany, // boolean - true if finding many documents
  context, // custom context object
}) => {
  // Runs after reading a document
  // You can modify the data before sending to client
  
  // Example: Add computed field
  if (doc) {
    doc.readAt = new Date().toISOString()
    doc.readBy = req.user?.email || 'anonymous'
  }
  
  console.log('After Read:', doc?.id)
  console.log('Find Many:', findMany)
  
  return doc
}

// ============================================
// BEFORE READ HOOK
// ============================================
export const beforeReadHook: CollectionBeforeReadHook = async ({
  req, // full express request
  query, // query object that will be used
  context, // custom context object
}) => {
  // Runs before reading documents
  // You can modify the query here
  // Don't log query as it may contain non-serializable data
  console.log('Before Read')
  console.log('User:', req.user?.email)
  
  // Example: Add filters based on user role
  // if (req.user?.role !== 'admin') {
  //   query.where = { ...query.where, published: { equals: true } }
  // }
  
  return query
}

// ============================================
// BEFORE OPERATION HOOK
// ============================================
export const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args, // arguments passed to the operation
  operation, // 'create' | 'read' | 'update' | 'delete' | 'login' | 'refresh'
  req, // full express request (if available)
  context, // custom context object
}) => {
  // Runs before any operation (create, read, update, delete)
  console.log('Before Operation:', operation)
  // Don't log args or req as they may contain non-serializable objects
  console.log('User Email:', req?.user?.email)
  
  // You can modify args here
  // e.g., add default filters, validate permissions, etc.
  
  return args
}


export const afterOperationHook: CollectionAfterOperationHook = async ({
  result, // result of the operation
  operation, // 'create' | 'read' | 'update' | 'delete' | 'login' | 'refresh'
  args, 
  req, 
}) => {
  // Runs after any operation
  console.log('After Operation:', operation)
  console.log('User Email:', req?.user?.email)
  

  return result
}

export const postsHooks = {
  // Validation
  beforeValidate: [beforeValidateHook],
  
  // Change (Create/Update)
  beforeChange: [beforeChangeHook],
  afterChange: [afterChangeHook],
  
  // Delete
  beforeDelete: [beforeDeleteHook],
  afterDelete: [afterDeleteHook],
  
  // Read
  beforeRead: [beforeReadHook],
  afterRead: [afterReadHook],
  
  // Operations (Global)
  beforeOperation: [beforeOperationHook],
  afterOperation: [afterOperationHook],
}
