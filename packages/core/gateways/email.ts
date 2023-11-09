import { appUrl } from 'core/utils/app-url'
import { EmailData, EmailTemplate } from 'email'
import { getEnv } from 'shared/utils/get-env'

export const sendEmail = async (
  template: EmailTemplate,
  to: string,
  data: EmailData
) => {
  const res = await fetch(new URL('/api/email', appUrl), {
    method: 'POST',
    headers: {
      Authorization: getEnv('CRON_SECRET'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, template, data })
  })

  if (!res.ok) {
    console.error('Email send error', await res.text())
    throw new Error('Failed to send email')
  }
}
