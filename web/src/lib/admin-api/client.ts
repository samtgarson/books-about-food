import { z } from 'zod'

export class AdminApiClient {
  private host = process.env.NEXT_PUBLIC_ADMIN_API_HOST as string

  constructor(private token: string) {}

  async edelweissImport(url: string) {
    const [error, json] = await this.request('/api/edelweiss-import', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) return { success: false as const, message: error }

    const parsed = z.object({ slug: z.string() }).safeParse(json)
    if (!parsed.success) {
      return {
        success: false as const,
        message: 'Could not parse Edelweiss+ page'
      }
    }

    return { success: true as const, data: parsed.data }
  }

  private async request(
    path: string,
    req: Partial<RequestInit> = {}
  ): Promise<[string | null, unknown]> {
    const res = await fetch(new URL(path, this.host), {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${this.token}`
      }
    })

    if (!res.ok) {
      return [await res.text(), null]
    }

    return [null, await res.json()]
  }
}
