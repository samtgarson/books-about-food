import {
  GoogleBookResult,
  GoogleBooksGateway
} from '@books-about-food/core/gateways/google-books'
import { AuthedService } from '@books-about-food/core/services/base'
import { z } from 'zod'

const client = new GoogleBooksGateway()

export type LibraryBook = ReturnType<typeof mapGoogleBook>

export const fetchLibraryBook = new AuthedService(
  z.object({ id: z.string() }),
  async ({ id } = {}) => {
    const result = await client.fetch(id)
    if (!result?.id || !result.volumeInfo?.title) return

    return mapGoogleBook(result)
  }
)

function extractImage({ imageLinks }: GoogleBookResult['volumeInfo']) {
  if (imageLinks?.extraLarge) return imageLinks.extraLarge
  if (imageLinks?.large) return imageLinks.large
}

function mapGoogleBook(result: GoogleBookResult) {
  const date = result.volumeInfo.publishedDate
  return {
    id: result.id,
    title: result.volumeInfo.title,
    subtitle: result.volumeInfo.subtitle,
    authors: result.volumeInfo.authors ?? [],
    cover: extractImage(result.volumeInfo),
    releaseDate: date ? new Date(date) : undefined,
    pages: result.volumeInfo.pageCount
  }
}
