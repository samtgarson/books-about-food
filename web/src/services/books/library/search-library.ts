import { Service } from 'src/utils/service'
import { z } from 'zod'
import { books } from '@googleapis/books'
import { getEnv } from 'shared/utils/get-env'

const client = books({
  version: 'v1',
  auth: getEnv('GOOGLE_BOOKS_API_KEY')
})

export type BookLibrarySearchResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export const searchLibrary = new Service(
  z.object({ query: z.string() }),
  async ({ query } = {}): Promise<BookLibrarySearchResult[]> => {
    if (!query.length) return []

    const result = await client.volumes.list({
      q: `intitle:"${query}" subject:Cooking`,
      fields: 'items(id,volumeInfo(title,authors,imageLinks/smallThumbnail))'
    })

    if (!result.data.items) return []
    return result.data.items.flatMap((item) => {
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
