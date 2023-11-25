import { EmailTemplate } from '@books-about-food/email'
import { EventSchemas, Inngest } from 'inngest'

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'books-about-food',
  schemas: new EventSchemas().fromRecord<{
    'book.updated': {
      data: {
        id: string | string[] | 'all'
        coverImageChanged?: boolean
      }
    }
    'jobs.email': { data: EmailTemplate }
    'jobs.generate-all-palettes': { data: { force: boolean } }
  }>()
})
