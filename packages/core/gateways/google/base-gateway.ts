import { getEnv } from '@books-about-food/shared/utils/get-env'

export abstract class BaseGoogleGateway {
  private key = getEnv('GOOGLE_API_KEY')
  abstract path: string
  protected subdomain = 'www'

  protected request(
    path: string,
    params: Record<string, unknown> = {},
    options: {
      headers?: Record<string, string>
      method?: 'GET' | 'POST'
      useHeaderAuth?: boolean
    } = {}
  ) {
    if (!path.startsWith('/')) path = `/${path}`

    const { headers = {}, method = 'GET', useHeaderAuth = false } = options

    const url = new URL(`${this.path}${path}`, this.baseUrl)

    const fetchHeaders: Record<string, string> = { ...headers }

    if (useHeaderAuth) {
      fetchHeaders['X-Goog-Api-Key'] = this.key
      fetchHeaders['Content-Type'] = 'application/json'
    } else {
      url.searchParams.append('key', this.key)
    }

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders
    }

    if (method === 'POST') {
      fetchOptions.body = JSON.stringify(params)
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          url.searchParams.append(key, value)
        }
      })
    }

    return fetch(url.toString(), fetchOptions)
  }

  private get baseUrl() {
    return `https://${this.subdomain}.googleapis.com`
  }
}
