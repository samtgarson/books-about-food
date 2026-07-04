import { expect, test } from '../test'

test.describe('Account', () => {
  test.beforeEach(async ({ page, helpers }) => {
    await helpers.login()
    await page.goto('/account')
  })

  test('name field is pre-populated', async ({ page }) => {
    await expect(page.getByLabel('Name')).toHaveValue('Sam Garson')
  })

  test('email field is pre-populated', async ({ page, helpers }) => {
    await expect(page.getByLabel('Email')).toHaveValue(helpers.email)
  })

  test('can update name', async ({ page }) => {
    const nameInput = page.getByLabel('Name')
    await expect(nameInput).toHaveValue('Sam Garson')

    await nameInput.fill('New Name')

    // The form auto-submits via a server action when the field blurs. Wait for
    // that POST to round-trip rather than the transient success toast, which
    // auto-dismisses and can be slow to appear on a cold preview deploy.
    const saved = page.waitForResponse(
      (res) =>
        res.request().method() === 'POST' && res.url().includes('/account')
    )
    await nameInput.blur()
    await saved

    await page.reload()
    await expect(page.getByLabel('Name')).toHaveValue('New Name')
  })
})
