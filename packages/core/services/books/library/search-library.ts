import { GoogleBooksGateway } from 'core/gateways/google-books'
import { Service } from 'core/services/base'
import { z } from 'zod'

export type BookLibrarySearchResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

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