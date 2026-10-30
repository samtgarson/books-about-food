import type { CollectionConfig } from 'payload'
import { editorField } from 'src/payload/fields/editor'
import { adminOnly, anyone } from '../../access'
import { revalidatePaths } from '../../plugins/cache-revalidation'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  orderable: true,
  typescript: {
    interface: 'FAQ'
  },
  custom: {
    revalidatePaths: revalidatePaths(() => ['/frequently-asked-questions'])
  },
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question']
  },
  labels: {
    singular: 'FAQ',
    plural: 'FAQs'
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      unique: true
    },
    editorField('answer', {
      required: true,
      placeholder: 'Type answer...'
    })
  ]
}
