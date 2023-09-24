import { FC, useState } from 'react'
import { Book } from 'src/models/book'
import { Profile } from 'src/models/profile'
import { Body, Content, Header } from 'src/components/atoms/sheet'
import Image from 'next/image'
import { Form } from 'src/components/form'
import { TextArea } from 'src/components/form/textarea'
import { Submit } from 'src/components/form/submit'
import z from 'zod'
import { action } from './action'
import { Avatar } from 'src/components/atoms/avatar'

export type SuggestEditSheetProps = {
  resource: Book | Profile
}

const schema = z.object({
  suggestion: z.string()
})

export const SuggestEditSheet: FC<SuggestEditSheetProps> = ({ resource }) => {
  const [success, setSuccess] = useState(false)
  return (
    <Content authenticated={{ action: 'claimProfile' }}>
      <Body className="flex flex-col gap-8">
        <div>
          <Header title="Suggest an Edit" />
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
            />
            <Submit variant="dark">Submit</Submit>
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
        <div className="bg-grey px-5 py-4 flex items-center gap-6">
          {resource.cover ? (
            <Image {...resource.cover.imageAttrs(72)} />
          ) : (
            <div className="bg-sand w-14 h-[72px]" />
          )}
          <div>
            <p className="font-medium text-16 mb-1">{resource.title}</p>
            <p className="text-14">{resource.authorNames}</p>
          </div>
        </div>
      )
    case 'profile':
      return (
        <div className="bg-grey px-5 py-4 flex items-center gap-6">
          <Avatar profile={resource} />
          <div>
            <p className="font-medium text-16 mb-1">{resource.name}</p>
            <p className="text-14">{resource.jobTitle}</p>
          </div>
        </div>
      )
  }
}