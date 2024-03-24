'use client'

import { FC } from 'react'
import { getHostname } from 'src/utils/url-helpers'
import { Detail } from '../../atoms/detail'
import { useEditPublisher } from './context'
import { Field } from './field'

export type Link = { name: string; url: string }

const Anchor = ({ children, url }: { url: string; children: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
    {children}
  </a>
)

export const LinkList: FC = () => {
  const { publisher, editMode } = useEditPublisher()
  const showDivider = editMode || (publisher?.website && publisher?.instagram)

  if (!editMode && !publisher.website && !publisher.instagram) return null
  return (
    <Detail className="flex flex-wrap items-center gap-2" maxWidth>
      <Field
        attr="website"
        render={(value) => <Anchor url={value}>{getHostname(value)}</Anchor>}
        placeholder="Add website"
      />
      {showDivider && <p aria-hidden>•</p>}
      <Field
        attr="instagram"
        render={(value) => (
          <Anchor url={`https://instagram.com/${value}`}>{`@${value}`}</Anchor>
        )}
        placeholder="Add Instagram handle"
      />
    </Detail>
  )
}
