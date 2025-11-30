'use client'

import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'src/components/atoms/icons'
import { Loader } from 'src/components/atoms/loader'
import { ProfileList } from 'src/components/atoms/profile-list'
import { Content, Wrapper } from 'src/components/profiles/item'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useServer } from 'src/hooks/use-server'
import { useEditProfile } from '../context'
import { FrequentCollaboratorsDummy } from './dummy'

export type FrequentCollaboratorsProps = {
  className?: string
  profiles: Profile[]
}

export function FrequentCollaborators({
  className,
  profiles
}: FrequentCollaboratorsProps) {
  const currentUser = useCurrentUser()
  const isServer = useServer()

  const { profile, editMode, onSave } = useEditProfile()
  const ids = useMemo(() => profile.hiddenCollaborators, [profile])

  const toggle = useCallback(
    async (id: string, hidden: boolean) => {
      const newIds = hidden ? [...ids, id] : ids.filter((i) => i !== id)
      await onSave({ hiddenCollaborators: newIds })
    },
    [ids, onSave]
  )

  const allHidden = profiles.every((p) => ids.includes(p.id))
  if (!profiles.length || (allHidden && !editMode)) return null
  if (!currentUser) return <FrequentCollaboratorsDummy className={className} />
  if (isServer) return null

  return (
    <ProfileList
      profiles={profiles}
      title="Frequent Collaborators"
      className={className}
    >
      {profiles.map((profile) => {
        const hidden = ids.includes(profile.id)

        if (!editMode && hidden) return null
        return (
          <Wrapper
            key={profile.id}
            profile={profile}
            className={cn(
              'transition',
              editMode ? (hidden ? 'opacity-30 saturate-0' : 'opacity-80') : ''
            )}
          >
            <Content profile={profile} display="list" disabled={editMode} />
            {editMode && (
              <EditContent profile={profile} toggle={toggle} hidden={hidden} />
            )}
          </Wrapper>
        )
      })}
    </ProfileList>
  )
}

function EditContent({
  profile,
  toggle,
  hidden
}: {
  profile: Profile
  toggle: (id: string, hidden: boolean) => Promise<void>
  hidden: boolean
}) {
  const [loading, setLoading] = useState(false)

  return (
    <button
      className="absolute inset-0 top-0 bottom-0 z-20 flex items-center justify-end px-4 sm:justify-center"
      title={
        hidden
          ? `Show ${profile.name} on your public profile`
          : `Hide ${profile.name} on your public profile`
      }
      onClick={async () => {
        setLoading(true)
        await toggle(profile.id, !hidden)
        setLoading(false)
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center bg-white">
        {loading ? (
          <Loader />
        ) : hidden ? (
          <EyeOff strokeWidth={1} />
        ) : (
          <Eye strokeWidth={1} />
        )}
      </div>
    </button>
  )
}
