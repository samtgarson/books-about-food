import nodemailer from 'nodemailer'
import { buildSendMail } from 'mailing-core'
import NewClaim from './templates/new-claim'
import { ComponentProps } from 'react'
import VerifyEmail from './templates/verify-email'

const transport = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendMail = buildSendMail({
  transport,
  defaultFrom: 'Books About Food <no-reply@booksaboutfood.info',
  configPath: './mailing.config.json'
})

const templates = {
  'new-claim': NewClaim,
  'verify-email': VerifyEmail
} as const

export function send<T extends keyof typeof templates>(
  template: T,
  to: string,
  props: ComponentProps<(typeof templates)[T]>
) {
  const Template = templates[template]
  return sendMail({
    to,
    // @ts-expect-error get this to work later
    component: <Template {...props} />
  })
}

export default sendMail
