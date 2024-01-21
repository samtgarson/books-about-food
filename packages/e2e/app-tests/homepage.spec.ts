import { expect, test } from '../test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('basic content', async ({ page }) => {
    await expect(page).toHaveTitle(/Books About Food/)
    await expect(page.getByText("Today's Specials")).toBeVisible()
  })

  test('protected content', async ({ page }) => {
    await page.getByRole('navigation').getByLabel('Sign In').click()

    await expect(page.getByText('Login or create an account')).toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page, helpers }) => {
      await helpers.login()
      await page.goto('/')
    })

    test('protected content', async ({ page }) => {
      await page.getByRole('navigation').getByLabel('Account').click()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'Account'
      )
    })
  })
})
