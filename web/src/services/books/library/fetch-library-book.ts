import { GoogleBookResult, GoogleBooksGateway } from 'src/gateways/google-books'
import { Service } from 'src/utils/service'
import { z } from 'zod'

const client = new GoogleBooksGateway()

export type BookLibrarySearchResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export const fetchLibraryBook = new Service(
  z.object({ id: z.string() }),
  async ({ id } = {}) => {
    const result = await client.fetch(id)
    if (!result?.id || !result.volumeInfo?.title) return

    const date = result.volumeInfo.publishedDate
    return {
      id: result.id,
      title: result.volumeInfo.title,
      subtitle: result.volumeInfo.subtitle,
      authors: result.volumeInfo.authors ?? [],
      cover: extractImage(result.volumeInfo),
      publisher: result.volumeInfo.publisher,
      releaseDate: date ? new Date(date) : undefined,
      pages: result.volumeInfo.pageCount
    }
  }
)

const extractImage = ({ imageLinks }: GoogleBookResult['volumeInfo']) => {
  if (imageLinks?.extraLarge) return imageLinks.extraLarge
  if (imageLinks?.large) return imageLinks.large
}
