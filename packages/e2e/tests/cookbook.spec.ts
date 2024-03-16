import { expect, test } from '../test'

test.describe('Cookbooks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('index & detail pages have content', async ({ page }) => {
    const section = page.getByRole('region', { name: 'Coming Soon' })
    await section.getByRole('link', { name: 'View More' }).click()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Cookbooks'
    )

    const list = page.getByRole('list')
    await expect(list.getByRole('listitem').count()).resolves.toBeGreaterThan(0)

    await page.getByRole('searchbox').fill('tokyo')
    await page.getByRole('listitem', { name: 'Tokyo Stories' }).click()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Tokyo Stories'
    )
  })
})
