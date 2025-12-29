import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  dbName: 'frequently_asked_questions',
  admin: {
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
