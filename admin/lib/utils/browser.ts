import { chromium as playwright } from 'playwright-chromium'

export async function openBrowser() {
  if (process.env.NODE_ENV !== 'production') {
    return await playwright.launch({ headless: false })
  }

  const { default: chromium } = await import('@sparticuz/chromium-min')
  return await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'
    ),
    headless: true
  })
}
