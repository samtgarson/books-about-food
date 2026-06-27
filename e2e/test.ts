import { BrowserContext, Page, test as base } from '@playwright/test'
import { createHmac } from 'crypto'
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
    const { token, expiresAt } = await createSession(userId)
    const signedToken = await signCookieValue(token)

    await page.goto('/', { waitUntil: 'commit' })

    const url = new URL(page.url())
    const isSecure = url.protocol === 'https:'
    const cookieName = isSecure
      ? '__Secure-better-auth.session_token'
      : 'better-auth.session_token'

    context.addCookies([
      {
        name: cookieName,
        value: signedToken,
        domain: url.hostname,
        path: '/',
        expires: Math.floor(expiresAt.getTime() / 1000),
        secure: isSecure
      }
    ])
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

const authSecret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET

async function signCookieValue(value: string): Promise<string> {
  if (!authSecret) throw new Error('BETTER_AUTH_SECRET or AUTH_SECRET must be set')
  const signature = createHmac('sha256', authSecret)
    .update(value)
    .digest('base64')
  return `${value}.${signature}`
}

async function createUser(email: string) {
  const res = await executeSql(`
    INSERT INTO "payload"."users" (email, name, "email_verified")
    VALUES ('${email}', 'Sam Garson', true)
    RETURNING id;
  `)

  const userId = res.trim()

  await executeSql(`
    INSERT INTO "payload"."users_role" ("order", parent_id, value)
    VALUES (1, '${userId}'::uuid, 'user');
  `)

  return userId
}

async function createSession(userId: string) {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await executeSql(`
    INSERT INTO "payload"."sessions" (token, user_id, expires_at)
    VALUES ('${token}', '${userId}'::uuid, '${expiresAt.toISOString()}');
  `)

  return { token, expiresAt }
}

async function deleteUser(email: string) {
  await executeSql(`
    DELETE FROM "payload"."sessions" WHERE user_id IN (
      SELECT id FROM "payload"."users" WHERE email = '${email}'
    );
    DELETE FROM "payload"."users_role" WHERE parent_id IN (
      SELECT id FROM "payload"."users" WHERE email = '${email}'
    );
    DELETE FROM "payload"."users" WHERE email = '${email}';
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
