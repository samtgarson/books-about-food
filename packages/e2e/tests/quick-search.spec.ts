import { expect, test } from '../test'

test.describe('Quick Search', () => {
  test.beforeEach(async ({ page, helpers }) => {
    await helpers.login()
    await page.goto('/')
  })

  test('finds a page', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Search' })
      .waitFor({ state: 'visible' })
    await page.keyboard.press('Meta+k')

    const input = page.getByPlaceholder('Type something...')
    expect(input).toBeFocused()

    await input.fill('hard')
    await page.getByRole('link', { name: 'Hardie Grant', exact: true }).click()

    await expect(page).toHaveTitle(/Hardie Grant/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Hardie Grant' })
    ).toBeVisible()
  })
})
