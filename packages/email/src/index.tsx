import { buildSendMail } from 'mailing-core'
import nodemailer from 'nodemailer'
import { resolve } from 'path'
import { NewClaim, NewClaimProps } from './templates/new-claim'
import { SuggestEdit, SuggestEditProps } from './templates/suggest-edit'
import { VerifyEmail, VerifyEmailProps } from './templates/verify-email'

export const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }),
  defaultFrom: 'Books About Food <no-reply@booksaboutfood.info',
  configPath: resolve(__dirname, '../mailing.config.json')
})

export const renderEmailTemplate = ({ key, props }: EmailTemplate) => {
  switch (key) {
    case 'newClaim':
      return <NewClaim {...props} />
    case 'suggestEdit':
      return <SuggestEdit {...props} />
    case 'verifyEmail':
      return <VerifyEmail {...props} />
  }
}

export type EmailTemplates = [
  { key: 'newClaim'; props: NewClaimProps },
  { key: 'suggestEdit'; props: SuggestEditProps },
  { key: 'verifyEmail'; props: VerifyEmailProps }
]
export type EmailTemplate = EmailTemplates[number]

export default sendMail
