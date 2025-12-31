import type { CollectionConfig } from 'payload'
import { revalidatePaths } from '../plugins/cache-revalidation'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
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
    {
      name: 'answer',
      type: 'textarea',
      required: true
    }
  ]
}
