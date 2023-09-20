import { openPreview, render, Template } from 'mailing-core'
import NewClaim from './templates/new-claim'
import { ComponentProps } from 'react'
import VerifyEmail from './templates/verify-email'
import sendMail from '@sendgrid/mail'

sendMail.setApiKey(process.env.SMTP_PASS as string)

export enum EmailTemplate {
  NewClaim = 'new-claim',
  VerifyEmail = 'verify-email'
}

const templates = {
  [EmailTemplate.NewClaim]: NewClaim,
  [EmailTemplate.VerifyEmail]: VerifyEmail
} as const

export type EmailData = ComponentProps<(typeof templates)[EmailTemplate]>

const from = 'Books About Food <no-reply@booksaboutfood.info'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTemplate<T extends Template<any>>(
  Template: T,
  props: ComponentProps<T>
) {
  const { html, errors } = render(<Template {...props} />)
  if (errors) console.error('Email rendering error', errors)
  return {
    subject:
      Template.subject instanceof Function
        ? Template.subject(props)
        : Template.subject,
    html
  }
}

export async function send<T extends EmailTemplate>(
  template: T,
  to: string,
  props: ComponentProps<(typeof templates)[T]>
) {
  const Template = templates[template]
  const { subject, html } = renderTemplate(Template, props)

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.FORCE_SEND_EMAIL !== 'true'
  ) {
    return openPreview({ html }, { subject, to, from })
  }

  try {
    await sendMail.send({
      to,
      from,
      subject,
      html
    })
    console.log(`Email sent to ${to} with subject ${subject}`)
  } catch (e) {
    console.error('Email delivery error', e)
  }
}

export default function () {}
