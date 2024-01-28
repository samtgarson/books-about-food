export async function openBrowser() {
  if (process.env.NODE_ENV === 'production') {
    const { chromium } = await import('playwright-core')
    const { default: chromiumExec } = await import('chrome-aws-lambda')
    return await chromium.launch({
      args: chromiumExec.args,
      executablePath: await chromiumExec.executablePath,
      headless: true
    })
  }

  const { chromium } = await import('playwright')
  return await chromium.launch({ headless: true })
}
