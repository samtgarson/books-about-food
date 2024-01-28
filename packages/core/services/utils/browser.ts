import { Page } from 'playwright-core'

export async function openBrowser() {
  if (process.env.NODE_ENV === 'production') {
    const [{ chromium: playwright }, { default: chromium }] = await Promise.all(
      [import('playwright-core'), import('@sparticuz/chromium')]
    )

    chromium.setGraphicsMode = false

    return await playwright.launch({
      args: [...chromium.args, '--disable-gl-drawing-for-tests'],
      executablePath: await chromium.executablePath()
    })
  }

  const { chromium } = await import('playwright')
  return await chromium.launch({ headless: true })
}

const blockedResources = ['image', 'media', 'font', 'texttrack', 'stylesheet']
export function blockResources(page: Page) {
  page.route('*/**', (route) => {
    if (blockedResources.includes(route.request().resourceType())) {
      route.abort()
    } else route.continue()
  })
  return page
}
