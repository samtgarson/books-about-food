// @ts-nocheck
import { Inbox } from 'gmail-inbox'
import { resolve } from 'path'

const path = (p) => resolve(import.meta.url.replace('file://', ''), p)

async function generateGoogleToken() {
  const gmail = new Inbox(
    path('../../gmail-credentials.json'),
    path('../../gmail-token.json')
  )
  await gmail.authenticateAccount()
}

generateGoogleToken()
  .then(() => process.exit(0))
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
