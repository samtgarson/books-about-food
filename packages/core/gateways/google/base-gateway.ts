import { getEnv } from '@books-about-food/shared/utils/get-env'

export abstract class BaseGoogleGateway {
  private key = getEnv('GOOGLE_API_KEY')
  abstract path: string
  protected subdomain = 'www'

  protected request(
    path: string,
    params: Record<string, string> = {},
    headers?: Headers
  ) {
    if (!path.startsWith('/')) path = `/${path}`
    const url = new URL(`${this.path}${path}`, this.baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
    url.searchParams.append('key', this.key)

    return fetch(url.toString(), { headers })
  }

  private get baseUrl() {
    return `https://${this.subdomain}.googleapis.com`
  }
}
