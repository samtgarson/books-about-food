/* eslint-disable @typescript-eslint/no-explicit-any */
import sendMail from '@sendgrid/mail'
import { openPreview, render, Template } from 'mailing-core'
import { ComponentProps } from 'react'
import NewClaim from './templates/new-claim'
import SuggestEdit from './templates/suggest-edit'
import VerifyEmail from './templates/verify-email'

sendMail.setApiKey(process.env.SMTP_PASS as string)

export enum EmailTemplate {
  NewClaim,
  VerifyEmail,
  SuggestEdit
}

const templates = {
  [EmailTemplate.NewClaim]: NewClaim,
  [EmailTemplate.VerifyEmail]: VerifyEmail,
  [EmailTemplate.SuggestEdit]: SuggestEdit
} as const

export type EmailData = ComponentProps<(typeof templates)[EmailTemplate]>

const from = 'Books About Food <no-reply@booksaboutfood.info'

function renderComponent<T extends Template<any>>(
  Template: T,
  props: ComponentProps<T>
) {
  return <Template {...props} />
}

function renderTemplate<T extends Template<any>>(
  Template: T,
  props: ComponentProps<T>
) {
  const { html, errors } = render(renderComponent(Template, props))
  if (errors.length) console.error('Email rendering error', errors)
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
    const component = renderComponent(Template, props)
    return openPreview({ component }, { subject, to, from })
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
