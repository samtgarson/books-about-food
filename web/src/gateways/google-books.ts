import { getEnv } from 'shared/utils/get-env'
import { z } from 'zod'

export class GoogleBooksGateway {
  private baseUrl = 'https://www.googleapis.com/books/v1/volumes'
  private key = getEnv('GOOGLE_BOOKS_API_KEY')

  private volumeSchema = z.object({
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

  async search(query: string, { fields }: { fields?: string } = {}) {
    const queryString = new URLSearchParams({
      key: this.key,
      q: `intitle:"${query}" subject:Cooking`
    })
    if (fields) queryString.append('fields', fields)

    const response = await fetch(
      new URL(`?${queryString}`, this.baseUrl).toString()
    )
    if (!response.ok) return []
    const result = await response.json()

    return z.array(this.volumeSchema).parse(result.items ?? [])
  }

  async fetch(id: string) {
    const queryString = new URLSearchParams({
      key: this.key
    })

    const response = await fetch(
      new URL(`/${id}?${queryString}`, this.baseUrl).toString()
    )
    if (!response.ok) return
    const result = await response.json()

    return this.volumeSchema.parse(result)
  }
}
