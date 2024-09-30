/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildSendMail } from 'mailing-core'
import nodemailer from 'nodemailer'
import { resolve } from 'path'
import { ClaimApproved } from './templates/claim-approved'
import { NewClaim } from './templates/new-claim'
import { SubmissionPublished } from './templates/submission-published'
import { SuggestEdit } from './templates/suggest-edit'
import { TeamInvite } from './templates/team-invite'
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
  defaultFrom: 'Books About Food <no-reply@booksabout.food',
  configPath: resolve(__dirname, '../mailing.config.json')
})

export async function renderEmailTemplate<K extends keyof EmailTemplateMap>(
  recipientName: string | null | undefined,
  data: EmailTemplateProps[K]
) {
  // @ts-expect-error not sure how to type this
  const service = new EmailTemplateMap[data.key](data.props)
  const [component, subject] = await Promise.all([
    service.render(recipientName ?? null),
    service.renderSubject()
  ])

  return { component, subject }
}

export const EmailTemplateMap = {
  claimApproved: ClaimApproved,
  newClaim: NewClaim,
  submissionPublished: SubmissionPublished,
  suggestEdit: SuggestEdit,
  teamInvite: TeamInvite,
  userApproved: UserApproved,
  verifyEmail: VerifyEmail
} as const

type EmailTemplateMap = typeof EmailTemplateMap

type EmailTemplateProps = {
  [K in keyof EmailTemplateMap]: {
    key: K
    props: ConstructorParameters<EmailTemplateMap[K]>[0]
  }
}

export type EmailTemplate = EmailTemplateProps[keyof EmailTemplateMap]

export default sendMail
