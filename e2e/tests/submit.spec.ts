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
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Account' })
    ).toBeVisible()

    await page
      .getByRole('navigation')
      .getByRole('button', { name: 'Submit a new cookbook' })
      .click()

    await fillInTitleForm(page)
    await expect(
      page.getByRole('heading', { name: 'A Good Day to Bake', level: 1 })
    ).toBeVisible()

    await expect(toastContainer(page)).toContainText('Cookbook created')

    await fillInGeneralInformationForm(page)

    await page.getByRole('button', { name: 'Delete Cookbook' }).click()
    await expect(toastContainer(page)).toContainText('Cookbook deleted')
  })
})

async function fillInTitleForm(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Submit a new cookbook' })
  await expect(dialog).toBeVisible()
  await dialog
    .getByRole('combobox', { name: 'Title' })
    .fill('a good day to bake', { timeout: 60 * 1000 })

  const option = page
    .getByRole('option')
    .filter({ hasText: /A Good Day to Bake/i })
  await expect(option).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Enter')

  await expect(dialog).toContainText('Benjamina Ebuehi') // Author

  await dialog.getByRole('button', { name: 'Save & continue' }).click()
}

async function fillInGeneralInformationForm(page: Page) {
  await page.getByRole('link', { name: 'General Information' }).click()
  await expect(
    page.getByRole('heading', { name: 'General Information', level: 2 })
  ).toBeVisible()

  await expect(page.getByLabel('Subtitle')).toHaveValue(
    'Simple Baking Recipes for Every Mood'
  )
  await page.getByRole('combobox', { name: 'Author(s)' }).fill('Abby')
  await page.getByRole('option', { name: 'Abby Camilleri' }).click()
  await page.getByRole('button', { name: 'Save and Continue' }).click()
}

function toastContainer(page: Page) {
  return page.getByLabel(/^Notifications.+$/)
}
