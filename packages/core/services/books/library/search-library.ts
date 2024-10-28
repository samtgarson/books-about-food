import { GoogleBooksGateway } from '@books-about-food/core/gateways/google-books'
import { Service } from '@books-about-food/core/services/base'
import { z } from 'zod'
import { BookResult } from '../../../models/types'

const client = new GoogleBooksGateway()

export const searchLibrary = new Service(
  z.object({ query: z.string() }),
  async ({ query } = {}): Promise<BookResult[]> => {
    if (!query.length) return []

    const result = await client.search(`intitle:"${query}" subject:Cooking`)

    if (!result) return []
    return result.flatMap((item, index) => {
      if (!item.id || !item.volumeInfo?.title) return []
      if (result.findIndex((i) => i.id === item.id) !== index) return []

      return {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors ?? [],
        image: item.volumeInfo.imageLinks?.smallThumbnail
      }
    })
  }
)
