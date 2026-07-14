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

  test('can search, sort and filter cookbooks', async ({ page }) => {
    await page.goto('/cookbooks')

    const books = page.getByRole('main').getByRole('list').first()
    const search = page.getByRole('searchbox', { name: 'Search' })

    await search.fill('tokyo stories')
    await expect(page).toHaveURL(/search=tokyo(?:\+|%20)stories/)
    await expect(books.getByRole('listitem')).toHaveCount(1)
    await expect(
      books.getByRole('listitem', { name: 'Tokyo Stories' })
    ).toBeVisible()

    await search.fill('')
    await expect(page).toHaveURL('/cookbooks')

    const defaultFirstBook = await books
      .getByRole('listitem')
      .first()
      .getAttribute('aria-label')

    await page.getByRole('button', { name: 'Sort & Filter' }).click()
    let filters = page.getByRole('dialog', { name: 'Sort & Filter' })
    await filters.getByRole('button', { name: 'Recently Added' }).click()
    await filters.getByRole('link', { name: 'Save' }).click()

    await expect(page).toHaveURL('/cookbooks?sort=createdAt')
    await expect(books.getByRole('listitem').first()).not.toHaveAttribute(
      'aria-label',
      defaultFirstBook ?? ''
    )

    await page.getByRole('button', { name: 'Sort & Filter' }).click()
    filters = page.getByRole('dialog', { name: 'Sort & Filter' })
    await filters.getByRole('link', { name: 'Reset' }).click()
    await expect(page).toHaveURL('/cookbooks')

    await page.getByRole('button', { name: 'Sort & Filter' }).click()
    filters = page.getByRole('dialog', { name: 'Sort & Filter' })
    const cuisine = filters.getByText('Cuisine', { exact: true }).locator('..')
    await cuisine.getByRole('searchbox', { name: 'Search' }).fill('italian')
    await expect(cuisine.getByRole('button', { name: 'Italian' })).toBeVisible()
    await expect(cuisine.getByRole('button', { name: 'African' })).toBeHidden()
    await cuisine.getByRole('button', { name: 'Italian' }).click()
    await filters.getByRole('link', { name: 'Save' }).click()

    await expect(page).toHaveURL('/cookbooks?tags=italian')
    await expect(books.getByRole('listitem').first()).toBeVisible()

    await page.getByRole('button', { name: 'Sort & Filter' }).click()
    filters = page.getByRole('dialog', { name: 'Sort & Filter' })
    await filters.getByRole('link', { name: 'Reset' }).click()
    await expect(page).toHaveURL('/cookbooks')

    await page.getByRole('button', { name: 'Sort & Filter' }).click()
    filters = page.getByRole('dialog', { name: 'Sort & Filter' })
    await filters.getByRole('button', { name: 'red colour' }).click()
    await filters.getByRole('link', { name: 'Save' }).click()

    await expect(page).toHaveURL('/cookbooks?color=red')
    await expect(books.getByRole('listitem').first()).toBeVisible()
  })
})
