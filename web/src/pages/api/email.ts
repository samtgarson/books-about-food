import { EmailData, EmailTemplate, send } from 'email'
import { NextApiRequest, NextApiResponse } from 'next'
import { getEnv } from 'shared/utils/get-env'
import { appURl } from 'src/utils/app-url'
import z from 'zod'

export const schema = z.object({
  to: z.string().email(),
  template: z.nativeEnum(EmailTemplate),
  data: z.custom<EmailData>((data) => {
    if (typeof data !== 'object') {
      throw new Error('Data must be an object')
    }
    return data
  })
})

export default async function EmailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.authorization !== getEnv('CRON_SECRET')) {
    return res.status(401).json({ ok: false })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false })
  }
  const { to, template, data } = schema.parse(req.body)

  await send(template, to, data)
  return res.status(200).json({ ok: true })
}

export const sendEmail = async (
  template: EmailTemplate,
  to: string,
  data: EmailData
) => {
  const res = await fetch(new URL('/api/email', appURl), {
    method: 'POST',
    headers: {
      Authorization: getEnv('CRON_SECRET'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, template, data })
  })

  if (!res.ok) {
    throw new Error('Failed to send email')
  }
}
