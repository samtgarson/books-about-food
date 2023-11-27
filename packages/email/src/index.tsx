import { buildSendMail } from 'mailing-core'
import nodemailer from 'nodemailer'
import { resolve } from 'path'
import { ClaimApproved, ClaimApprovedProps } from './templates/claim-approved'
import { NewClaim, NewClaimProps } from './templates/new-claim'
import { SuggestEdit, SuggestEditProps } from './templates/suggest-edit'
import { UserApproved, UserApprovedProps } from './templates/user-approved'
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
    case 'userApproved':
      return <UserApproved {...props} />
    case 'claimApproved':
      return <ClaimApproved {...props} />
  }
}

export type EmailTemplates = [
  { key: 'newClaim'; props: NewClaimProps },
  { key: 'suggestEdit'; props: SuggestEditProps },
  { key: 'verifyEmail'; props: VerifyEmailProps },
  { key: 'userApproved'; props: UserApprovedProps },
  { key: 'claimApproved'; props: ClaimApprovedProps }
]
export type EmailTemplate = EmailTemplates[number]

export default sendMail
