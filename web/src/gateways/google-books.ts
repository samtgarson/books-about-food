import { z } from 'zod'
import { BaseGoogleGateway } from './google/base-gateway'

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

export class GoogleBooksGateway extends BaseGoogleGateway {
  path = '/books/v1/volumes'

  async search(query: string) {
    const response = await this.request('', {
      q: `intitle:"${query}" subject:Cooking`
    })
    if (!response.ok) return []
    const result = await response.json()

    return z.array(volumeSchema).parse(result.items ?? [])
  }

  async fetch(id: string) {
    const response = await this.request(id)
    if (!response.ok) return
    const result = await response.json()

    return volumeSchema.parse(result)
  }
}
