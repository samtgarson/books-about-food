import { getEnv } from 'shared/utils/get-env'
import { z } from 'zod'

export type GoogleBookResult = z.infer<typeof volumeSchema>

const volumeSchema = z.object({
  id: z.string(),
  volumeInfo: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    authors: z.array(z.string()).optional(),
    imageLinks: z
      .object({
        smallThumbnail: z.string().optional(),
        thumbnail: z.string().optional(),
        medium: z.string().optional(),
        large: z.string().optional(),
        extraLarge: z.string().optional()
      })
      .optional(),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    pageCount: z.number().optional()
  })
})

export class GoogleBooksGateway {
  private key = getEnv('GOOGLE_BOOKS_API_KEY')
  private baseUrl = 'https://www.googleapis.com/books/v1/volumes'

  async search(query: string) {
    const url = new URL(this.baseUrl)
    url.searchParams.append('q', `intitle:"${query}" subject:Cooking`)
    url.searchParams.append('key', this.key)

    const response = await fetch(url)
    if (!response.ok) return []
    const result = await response.json()

    return z.array(volumeSchema).parse(result.items ?? [])
  }

  async fetch(id: string) {
    const url = new URL(`/${id}`, this.baseUrl)
    url.searchParams.append('key', this.key)

    const response = await fetch(url)
    if (!response.ok) return
    const result = await response.json()

    return volumeSchema.parse(result)
  }
}
