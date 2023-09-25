'use client'

import { FC } from 'react'
import { Detail } from '../atoms/detail'
import { useEditProfile } from '../profiles/edit/context'
import { Field } from '../profiles/edit/field'

export type Link = { name: string; url: string }

const Anchor = ({ children, url }: { url: string; children: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
    {children}
  </a>
)

export const LinkList: FC = () => {
  const { profile, editMode } = useEditProfile()
  const showDivider = editMode || (profile?.website && profile?.instagram)

  if (!editMode && !profile.website && !profile.instagram) return null
  return (
    <Detail className="flex flex-wrap items-center gap-2" maxWidth>
      <Field
        attr="website"
        render={(value) => (
          <Anchor url={value}>{new URL(value).hostname}</Anchor>
        )}
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
