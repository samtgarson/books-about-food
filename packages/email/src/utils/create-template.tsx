import { IMjmlSectionProps } from '@faire/mjml-react'
import { Template } from 'mailing-core'
import { ReactNode } from 'react'
import BaseLayout from '../components/base-layout'

export type BaseProps = {
  recipientName?: string | null
}

export abstract class EmailTemplate<
  Props extends Record<string, unknown> | undefined = undefined,
  TransformedProps = Props
> {
  constructor(protected props: Props) {}
  static key: string

  protected abstract subject: Template<TransformedProps>['subject']
  protected abstract preview: Template<TransformedProps>['subject']
  protected abstract content(props: TransformedProps): ReactNode
  public async transform(): Promise<
    TransformedProps & Partial<IMjmlSectionProps>
  > {
    return this.props as unknown as TransformedProps &
      Partial<IMjmlSectionProps>
  }

  async renderSubject() {
    return typeof this.subject === 'function'
      ? this.subject(await this.transform())
      : this.subject
  }

  async render(recipientName: string | null) {
    const Content = this.content
    const props = await this.transform()
    return (
      <BaseLayout
        recipientName={recipientName}
        preview={
          typeof this.preview === 'function'
            ? this.preview(props)
            : this.preview
        }
      >
        <Content {...props} />
      </BaseLayout>
    )
  }
}
