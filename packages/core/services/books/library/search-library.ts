import { GoogleBooksGateway } from '@books-about-food/core/gateways/google-books'
import { Service } from '@books-about-food/core/services/base'
import { z } from 'zod'
import { BookResult } from '../../../types'

export type BookLibrarySearchResult = BookResult

const client = new GoogleBooksGateway()

export const searchLibrary = new Service(
  z.object({ query: z.string() }),
  async ({ query } = {}): Promise<BookLibrarySearchResult[]> => {
    if (!query.length) return []

    const result = await client.search(`intitle:"${query}" subject:Cooking`)

    if (!result) return []
    return result.flatMap((item) => {
      if (!item.id || !item.volumeInfo?.title) return []

      return {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors ?? [],
        image: item.volumeInfo.imageLinks?.smallThumbnail
      }
    })
  }
)
