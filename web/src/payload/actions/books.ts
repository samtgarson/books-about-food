'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import type { ActionResult } from '../components/actions/action-button'

export async function publishBook(bookId: string): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    const book = await payload.findByID({
      collection: 'books',
      id: bookId
    })

    if (!book) {
      return { success: false, error: 'Book not found' }
    }

    if (book.status === 'published') {
      return { success: false, error: 'Book is already published' }
    }

    await payload.update({
      collection: 'books',
      id: bookId,
      data: {
        status: 'published'
      }
    })

    // TODO: Trigger notification email via Inngest
    // await inngest.send({ name: 'book/published', data: { bookId } })

    return { success: true, message: 'Book published successfully' }
  } catch (error) {
    console.error('Error publishing book:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish book'
    }
  }
}
