import { encode } from '@auth/core/jwt'
import prisma from '@books-about-food/database'
import { BrowserContext, Page, test as base } from '@playwright/test'

const helpers = ({
  context,
  page
}: {
  page: Page
  context: BrowserContext
}) => ({
  async login() {
    await page.goto('/', { waitUntil: 'commit' })
    const cookies = await context.cookies()
    const authCookie = cookies.find(
      ({ name }) => name.includes('authjs') && name.endsWith('callback-url')
    )
    if (!authCookie) throw new Error('No auth cookie found')

    const prefix = authCookie.name.split('.')[0]
    const cookieName = `${prefix}.session-token`
    const email = 'samtgarson@gmail.com'
    const user = await prisma.user.findUniqueOrThrow({ where: { email } })
    const token = await encode({
      token: {
        name: 'Sam Garson',
        email,
        userId: user.id,
        role: 'user'
      },
      salt: cookieName,
      secret: process.env.NEXTAUTH_SECRET as string
    })

    context.addCookies([{ ...authCookie, name: cookieName, value: token }])
  }
})

type Fixtures = {
  helpers: ReturnType<typeof helpers>
}

export const test = base.extend<Fixtures>({
  async helpers({ page, context }, use) {
    await use(helpers({ page, context }))
  }
})

export { expect } from '@playwright/test'
