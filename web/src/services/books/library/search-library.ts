import { Service } from 'src/utils/service'
import { z } from 'zod'
import { GoogleBooksGateway } from 'src/gateways/google-books'

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
