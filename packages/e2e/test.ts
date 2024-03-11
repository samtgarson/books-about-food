import { encode } from '@auth/core/jwt'
import { BrowserContext, Page, test as base } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const helpers = ({
  context,
  page,
  email
}: {
  page: Page
  context: BrowserContext
  email: string
}) => ({
  email,
  async login() {
    const user = await prisma.user.create({
      data: { email, role: 'user', emailVerified: new Date() }
    })
    await page.goto('/', { waitUntil: 'commit' })
    const cookies = await context.cookies()
    const authCookie = cookies.find(
      ({ name }) => name.includes('authjs') && name.endsWith('callback-url')
    )
    if (!authCookie) throw new Error('No auth cookie found')

    const prefix = authCookie.name.split('.')[0]
    const cookieName = `${prefix}.session-token`
    const token = await encode({
      token: {
        name: 'Sam Garson',
        email,
        userId: user.id,
        role: 'user',
        teams: []
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
    const email = `sam+${crypto.randomUUID()}@samgarson.com`

    await use(helpers({ page, context, email }))

    await prisma.user.deleteMany({ where: { email } })
  }
})

export { expect } from '@playwright/test'
