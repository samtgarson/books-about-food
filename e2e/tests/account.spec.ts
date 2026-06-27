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

    await nameInput.selectText()
    await page.keyboard.type('New Name')
    await page.keyboard.press('Tab')

    await expect(page.getByText('Account updated')).toBeVisible()

    await page.reload()
    await expect(page.getByLabel('Name')).toHaveValue('New Name')
  })
})
