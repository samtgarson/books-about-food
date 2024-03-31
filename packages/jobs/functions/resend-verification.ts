import { inngest } from '@books-about-food/core/jobs'
import { appUrl } from '@books-about-food/shared/utils/app-url'

const url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : appUrl()

export const sendVerification = inngest.createFunction(
  { id: 'send-verification', name: 'Resend user verification email' },
  { event: 'jobs.send-verification' },
  async ({ event }) => {
    const { csrfToken, cookie } = await getCsrfToken()

    const body = new URLSearchParams()
    body.set('csrfToken', csrfToken)
    body.set('email', event.data.email)

    const headers = {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'X-Auth-Return-Redirect': '1'
    }

    const res = await fetch(`${url}/api/auth/signin/email`, {
      method: 'POST',
      headers,
      body: body.toString()
    })

    if (!res.ok) {
      throw new Error(
        `Failed to send verification email: [${
          res.statusText
        }] ${await res.text()}`
      )
    }

    return { success: true, res: await res.json() }
  }
)

async function getCsrfToken() {
  const response = await fetch(`${url}/api/auth/csrf`)
  const { csrfToken } = await response.json()

  // CSRF token header includes the token from the body
  const cookies = response.headers
    .getSetCookie()
    .find((c) => c.includes(csrfToken))
  if (!cookies) throw new Error('No CSRF token cookie found')

  const cookie = cookies.split(';')[0]
  return { csrfToken, cookie }
}
