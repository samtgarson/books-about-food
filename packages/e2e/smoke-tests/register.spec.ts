import prisma from '@books-about-food/database'
import { Inbox } from 'gmail-inbox'
import { expect, test } from 'test'

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Register and approve', async ({
    page,
    baseURL,
    helpers: { email }
  }) => {
    test.slow()
    await page.getByLabel('Email Address').fill(email)
    await page.getByRole('button', { name: 'Register' }).click()

    await expect(page.getByText("Thanks, we'll be in touch!")).toBeVisible()

    const url = await getVerificationUrl(email, baseURL)

    await page.goto(url)

    await expect(
      page.getByText("Thanks for registering! We'll be in touch soon.")
    ).toBeVisible()

    await prisma.user.update({
      where: { email },
      data: { role: 'user' }
    })

    await page.reload()
    await expect(page.getByText("Today's Specials")).toBeVisible({
      timeout: 30000
    })
  })
})

async function getVerificationUrl(email: string, baseURL?: string) {
  if (!baseURL) throw new Error('No base URL provided')
  const gmail = new Inbox('./gmail-credentials.json', './gmail-token.json')
  await gmail.authenticateAccount()

  const [message] = await gmail.waitTillMessage(
    // @ts-expect-error category is required for some reason
    { to: email },
    true,
    5, // 5 seconds
    60 * 5 // 5 minutes
  )
  if (!message) throw new Error('No verification email found')
  await gmail.gmailApi.users.messages.trash({
    id: message.messageId,
    userId: 'me'
  })

  const url = message.body.html
    ?.match(new RegExp(`>(${baseURL}.+)</a`))?.[1]
    .replace(/&amp;/g, '&')

  if (!url) throw new Error('No verification URL found')
  return url
}
