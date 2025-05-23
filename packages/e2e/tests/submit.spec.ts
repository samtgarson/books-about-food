import { Page } from '@playwright/test'
import { expect, test } from '../test'

test.describe('Submit', function () {
  test.beforeEach(async function ({ page, helpers }) {
    await helpers.login()
    await page.goto('/')
  })

  test('can submit a new cookbook and fill in all the details', async function ({
    page
  }) {
    await page
      .getByRole('navigation')
      .getByRole('button', { name: 'Submit a new cookbook' })
      .click()

    await fillInTitleForm(page)
    await expect(
      page.getByRole('heading', { name: 'A Good Day to Bake', level: 1 })
    ).toBeVisible()

    await expect(toastContainer(page)).toContainText('Cookbook created')

    await page.getByRole('button', { name: 'Delete Cookbook' }).click()
    await expect(toastContainer(page)).toContainText('Cookbook deleted')
  })
})

async function fillInTitleForm(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Submit a new cookbook' })
  await dialog
    .getByRole('combobox', { name: 'Title' })
    .fill('a good day to bake', { timeout: 60 * 1000 })

  const option = page
    .getByRole('option')
    .filter({ hasText: /A Good Day to Bake/i })
  await expect(option).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Enter')

  await expect(dialog.getByLabel('Subtitle')).toHaveValue(
    'Simple Baking Recipes for Every Mood'
  )
  await expect(dialog).toContainText('Benjamina Ebuehi') // Author

  await dialog.getByRole('combobox', { name: 'Author(s)' }).fill('Abby')
  await page.getByRole('option', { name: 'Abby Camilleri' }).click()
  await dialog.getByRole('button', { name: 'Save & continue' }).click()
}

function toastContainer(page: Page) {
  return page.getByLabel(/^Notifications.+$/)
}
