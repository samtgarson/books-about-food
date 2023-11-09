import { UpdateBookInput } from 'core/services/books/update-book'
import { EventSchemas, Inngest } from 'inngest'

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'books-about-food',
  schemas: new EventSchemas().fromRecord<{
    'book.updated': {
      data: {
        id: string
        input: UpdateBookInput
      }
    }
  }>()
})
