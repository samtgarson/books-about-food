import { EventSchemas, Inngest } from 'inngest'
import { UpdateBookInput } from 'src/services/books/update-book'

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
