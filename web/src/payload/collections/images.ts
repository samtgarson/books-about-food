import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { randomUUID } from 'crypto'
import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  upload: {
    displayPreview: true,
    mimeTypes: ['image/*'],
    adminThumbnail: function ({ doc }) {
      return imageUrl(doc.filename as string, doc.prefix as string)
    },
    formatOptions: { format: 'png', options: { force: true } },
    imageSizes: [
      {
        name: 'blurPlaceholder',
        width: 4,
        height: undefined,
        position: 'center',
        formatOptions: {
          format: 'png',
          options: { quality: 20, force: true }
        }
      }
    ]
  },
  admin: {
    group: 'Resources',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'owner', 'imageType', 'caption']
  },
  hooks: {
    beforeOperation: [
      async function ({ operation, req }) {
        if (['create', 'update'].includes(operation) && req.file) {
          req.file.name = randomUUID() + '.png'
        }
      }
    ],
    beforeChange: [
      async function ({ data, req }) {
        if (!req?.payloadUploadSizes?.blurPlaceholder) return data
        const buffer = req.payloadUploadSizes.blurPlaceholder
        const placeholderUrl = `data:image/png;base64,${buffer.toString('base64')}`
        console.log('Generated placeholder URL for image', placeholderUrl)
        return {
          ...data,
          placeholderUrl
        }
      }
    ]
  },
  fields: [
    {
      name: 'placeholderUrl',
      type: 'text',
      admin: {
        readOnly: true
      }
    }
  ]
}
