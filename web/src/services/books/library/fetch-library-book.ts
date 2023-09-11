import { Service } from 'src/utils/service'
import { z } from 'zod'
import { GoogleBookResult, GoogleBooksGateway } from 'src/gateways/google-books'

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

export const fetchLibraryBook = new Service(
  z.object({ id: z.string() }),
  async ({ id } = {}) => {
    const result = await client.volumes.get({ volumeId: id })
    if (!result.data.id || !result.data.volumeInfo?.title) return

    const date = result.data.volumeInfo.publishedDate
    return {
      id: result.data.id,
      title: result.data.volumeInfo.title,
      subtitle: result.data.volumeInfo.subtitle,
      authors: result.data.volumeInfo.authors ?? [],
      cover: extractImage(result.data.volumeInfo),
      publisher: result.data.volumeInfo.publisher,
      releaseDate: date ? new Date(date) : undefined,
      pages: result.data.volumeInfo.pageCount
    }
  }
)

const extractImage = ({ imageLinks }: GoogleBookResult['volumeInfo']) => {
  if (imageLinks?.extraLarge) return imageLinks.extraLarge
  if (imageLinks?.large) return imageLinks.large
  if (imageLinks?.medium) return imageLinks.medium
  if (imageLinks?.thumbnail) return imageLinks.thumbnail
}
