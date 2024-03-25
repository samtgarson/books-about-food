import { Book } from '@books-about-food/core/models/book'
import { Profile } from '@books-about-food/core/models/profile'
import Image from 'next/image'
import { useState } from 'react'
import { Avatar } from 'src/components/atoms/avatar'
import { Body, Content } from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { TextArea } from 'src/components/form/textarea'
import z from 'zod'
import { SheetComponent } from '../types'
import { action } from './action'

export type SuggestEditSheetProps = {
  resource: Book | Profile
}

const schema = z.object({
  suggestion: z.string()
})

const SuggestEditSheet: SheetComponent<SuggestEditSheetProps> = ({
  resource
}) => {
  const [success, setSuccess] = useState(false)
  return (
    <Content authenticated={{ action: 'claimProfile' }}>
      <Body className="flex flex-col gap-8" title="Suggest an edit">
        <div>
          <p>Let us know below what should be changed.</p>
        </div>
        <ResourceDisplay resource={resource} />
        {success ? (
          <div>Thanks! We&apos;ll get to this as soon as we can.</div>
        ) : (
          <Form
            variant="bordered"
            action={async ({ suggestion }) => {
              await action(resource._type, resource.slug, suggestion)
              setSuccess(true)
            }}
            schema={schema}
          >
            <TextArea
              label="Describe your suggestion"
              name="suggestion"
              placeholder="The title is spelled wrong..."
              required
            />
            <Submit>Submit</Submit>
          </Form>
        )}
      </Body>
    </Content>
  )
}

function ResourceDisplay({ resource }: SuggestEditSheetProps) {
  switch (resource._type) {
    case 'book':
      return (
        <div className="bg-grey flex items-center gap-6 px-5 py-4">
          {resource.cover ? (
            <Image {...resource.cover.imageAttrs(72)} />
          ) : (
            <div className="bg-sand h-[72px] w-14" />
          )}
          <div>
            <p className="text-16 mb-1 font-medium">{resource.title}</p>
            <p className="text-14">{resource.authorNames}</p>
          </div>
        </div>
      )
    case 'profile':
      return (
        <div className="bg-grey flex items-center gap-6 px-5 py-4">
          <Avatar profile={resource} />
          <div>
            <p className="text-16 mb-1 font-medium">{resource.name}</p>
            <p className="text-14">{resource.jobTitle}</p>
          </div>
        </div>
      )
  }
}

export default SuggestEditSheet
