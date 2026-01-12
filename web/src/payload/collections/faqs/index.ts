import type { CollectionConfig } from 'payload'
import { editorField } from 'src/payload/fields/editor'
import { revalidatePaths } from '../../plugins/cache-revalidation'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
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
