import { ComponentType } from 'react'
import BaseLayout from '../components/base-layout'

export type BaseProps = {
  recipientName?: string | null
}

export type TemplateProps<P, I = P> = {
  PreviewProps?: P
  subject: ((props: P) => string) | string
  transform?: (props: I) => Promise<P>
} & P

export function emailTemplate<P, I>({
  component: Component,
  previewProps,
  subject,
  preview,
  transform
}: {
  component: ComponentType<P>
  previewProps: P
  subject: string | ((props: P) => string)
  preview: string | ((props: P) => string)
  transform?: (props: I) => Promise<P>
}) {
  const template = ((props: P & BaseProps) => {
    const previewText = typeof preview === 'string' ? preview : preview(props)
    return (
      <BaseLayout recipientName={props.recipientName} preview={previewText}>
        <Component {...props} />
      </BaseLayout>
    )
  }) as ComponentType<P & BaseProps> & TemplateProps<P, I>

  template.PreviewProps = { ...previewProps, recipientName: 'John Doe' }
  template.subject = subject
  template.transform = transform
  return template
}
