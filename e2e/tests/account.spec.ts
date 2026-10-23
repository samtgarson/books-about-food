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

    // Analytics also posts to this page, so match the submitted name before
    // reloading to avoid cancelling the save request.
    const saved = page.waitForResponse(
      (res) =>
        res.request().method() === 'POST' &&
        res.url().includes('/account') &&
        res.request().postDataJSON()?.[0]?.name === 'New Name'
    )
    await nameInput.blur()
    const response = await saved
    await response.finished()

    await page.reload()
    // A freshly deployed preview can be slow to serve the reloaded page, so
    // give the persisted value longer than the default expect timeout.
    await expect(page.getByLabel('Name')).toHaveValue('New Name', {
      timeout: 30 * 1000
    })
  })
})
