import { Template } from 'mailing-core'
import { ReactNode } from 'react'
import BaseLayout from '../components/base-layout'

export type BaseProps = {
  recipientName?: string | null
}

export function createTemplate<Props>({
  subject,
  preview,
  content: Content
}: {
  subject: Template<Props>['subject']
  preview: Template<Props>['subject']
  content: (props: Props) => ReactNode
}) {
  const template: Template<Props & BaseProps> = (props: Props & BaseProps) => (
    <BaseLayout
      recipientName={props.recipientName}
      preview={typeof preview === 'function' ? preview(props) : preview}
    >
      <Content {...props} />
    </BaseLayout>
  )

  template.subject = subject

  return template
}
