'use client'
import { Button } from '../atoms/button'
import { Body, Content } from '../atoms/sheet'
import { SheetComponent } from './types'

export type CookbookSubmittedSheetProps = {
  title: string
}

const CookbookSubmittedSheet: SheetComponent<CookbookSubmittedSheetProps> = ({
  title
}) => {
  return (
    <Content>
      <Body title={`${title}`}>
        <p className="mb-8">
          Thanks for your submission and contribution to the cookbook community
          on BAF. We manually review every submission before publishing it. We
          will get in touch if we have any questions.
        </p>
        <Button href="/account/submissions" variant="dark">
          Go to your account
        </Button>
      </Body>
    </Content>
  )
}

export default CookbookSubmittedSheet
