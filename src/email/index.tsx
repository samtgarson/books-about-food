import { render } from '@react-email/components'
import pkg from 'open'
const { default: open, apps } = pkg as typeof import('open')
import type { BasePayload } from 'payload'
import { ServerClient } from 'postmark'
import { EmailTemplateMap, EmailTemplateProps } from './emails'

export type { EmailTemplate } from './emails'

const client = new ServerClient(process.env.SMTP_PASS as string)

export async function sendEmail<K extends keyof EmailTemplateMap>(
  payload: BasePayload,
  recipientEmail: string,
  recipientName: string | null,
  data: EmailTemplateProps[K]
) {
  const propsWithName = { ...data.props, recipientName }
  const Template = EmailTemplateMap[data.key]
  const props = Template.transform
    ? // @ts-expect-error how to type this
      await Template.transform(propsWithName, { payload })
    : propsWithName

  // @ts-expect-error how to type this
  const component = <Template {...props} />

  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true })
  ])

  const subject =
    typeof Template.subject === 'function'
      ? // @ts-expect-error how to type this
        Template.subject(props)
      : Template.subject

  const res = await client.sendEmail({
    From: 'Books About Food <no-reply@booksabout.food>',
    To: recipientEmail,
    Subject: subject,
    HtmlBody: html,
    TextBody: text
  })

  if (process.env.NODE_ENV === 'development') {
    await open(`http://localhost:5000/dev/email-preview/${res.MessageID}`, {
      app: { name: apps.chrome }
    })
  }
}
