import { buildSendMail } from 'mailing-core'
import nodemailer from 'nodemailer'
import { resolve } from 'path'
import { ComponentProps, JSXElementConstructor } from 'react'
import { ClaimApproved } from './templates/claim-approved'
import { NewClaim } from './templates/new-claim'
import { SubmissionPublished } from './templates/submission-published'
import { SuggestEdit } from './templates/suggest-edit'
import { UserApproved } from './templates/user-approved'
import { VerifyEmail } from './templates/verify-email'

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

export const renderEmailTemplate = (
  name: string | null,
  { key, props }: EmailTemplate
) => {
  switch (key) {
    case 'newClaim':
      return <NewClaim recipientName={name} {...props} />
    case 'suggestEdit':
      return <SuggestEdit recipientName={name} {...props} />
    case 'verifyEmail':
      return <VerifyEmail recipientName={name} {...props} />
    case 'userApproved':
      return <UserApproved recipientName={name} {...props} />
    case 'claimApproved':
      return <ClaimApproved recipientName={name} {...props} />
    case 'submissionPublished':
      return <SubmissionPublished recipientName={name} {...props} />
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmailProps<Component extends JSXElementConstructor<any>> = Omit<
  ComponentProps<Component>,
  'recipientName'
>

export type EmailTemplates = [
  { key: 'newClaim'; props: EmailProps<typeof NewClaim> },
  { key: 'suggestEdit'; props: EmailProps<typeof SuggestEdit> },
  { key: 'verifyEmail'; props: EmailProps<typeof VerifyEmail> },
  { key: 'userApproved'; props: EmailProps<typeof UserApproved> },
  { key: 'claimApproved'; props: EmailProps<typeof ClaimApproved> },
  {
    key: 'submissionPublished'
    props: EmailProps<typeof SubmissionPublished>
  }
]
export type EmailTemplate = EmailTemplates[number]

export default sendMail
