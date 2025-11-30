import { encode } from '@auth/core/jwt'
import { BrowserContext, Page, test as base } from '@playwright/test'
import { $ } from 'execa'

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
    const userId = await createUser(email)
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
        userId,
        role: 'user',
        publishers: []
      },
      salt: cookieName,
      secret: process.env.AUTH_SECRET as string
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

    await deleteUser(email)
  }
})

const databaseUrl =
  process.env.DATABASE_DIRECT_URL || 'postgres://localhost:5432/baf_dev'

async function createUser(email: string) {
  const res = await executeSql(`
    INSERT INTO "users" (email, role, "email_verified")
    VALUES ('${email}', 'user', NOW())
    RETURNING id;
  `)

  return res.trim()
}

async function deleteUser(email: string) {
  await executeSql(`
    DELETE FROM "users"
    WHERE email = '${email}';
  `)
}

async function executeSql(sql: string) {
  const preparedSql = sql.replace(/\n/g, ' ').replace(/"/g, '\\"').trim()
  const res = await $({
    shell: true
  })`psql "${databaseUrl}" -c "${preparedSql}" -tq`
  if (res.failed) throw new Error(`SQL execution failed: ${res.stderr}`)
  return res.stdout
}

export { expect } from '@playwright/test'
