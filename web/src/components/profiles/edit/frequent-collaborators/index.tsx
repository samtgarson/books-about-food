'use client'

import cn from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'react-feather'
import { ProfileList } from 'src/components/atoms/profile-list'
import { GridContainer } from 'src/components/lists/grid-container'
import { Content, Wrapper } from 'src/components/profiles/item'
import { Profile } from 'src/models/profile'
import { useEditProfile } from '../context'
import { Loader } from 'src/components/atoms/loader'

export type FrequentCollaboratorsProps = {
  className?: string
  profiles: Profile[]
}

export const FrequentCollaborators: FC<FrequentCollaboratorsProps> = ({
  className,
  profiles
}) => {
  const { profile, editMode, onSave } = useEditProfile()
  const [loading, setLoading] = useState<Map<string, boolean>>(new Map())
  const ids = useMemo(() => profile.hiddenCollaborators, [profile])

  const toggle = useCallback(
    async (id: string, hidden: boolean) => {
      setLoading((prev) => new Map(prev.set(id, true)))
      const newIds = hidden ? [...ids, id] : ids.filter((i) => i !== id)
      await onSave({ hiddenCollaborators: newIds })
      setLoading((prev) => new Map(prev.set(id, false)))
    },
    [ids, onSave]
  )

  const allHidden = profiles.every((p) => ids.includes(p.id))
  if (!profiles.length || allHidden) return null
  return (
    <ProfileList
      profiles={profiles}
      title="Frequent Collaborators"
      className={className}
    >
      <GridContainer className={cn('-mt-px sm:mt-0')}>
        {profiles.map((profile) => {
          const hidden = ids.includes(profile.id)
          const profileLoading = loading.get(profile.id)

          if (!editMode && hidden) return null
          return (
            <Wrapper
              key={profile.id}
              profile={profile}
              className={cn(hidden && 'border-opacity-30')}
            >
              <Content
                profile={profile}
                display="list"
                className={cn(
                  'transition',
                  hidden ? 'opacity-30 saturate-0' : 'opacity-80'
                )}
              />
              {editMode && (
                <button
                  className="absolute inset-0 px-4 top-0 bottom-0 flex items-center justify-end sm:justify-center z-20"
                  title={
                    hidden ? 'Show this collaborator' : 'Hide this collaborator'
                  }
                  onClick={() => toggle(profile.id, !hidden)}
                >
                  <div className="w-10 h-10 bg-white flex items-center justify-center">
                    {profileLoading ? (
                      <Loader />
                    ) : hidden ? (
                      <EyeOff strokeWidth={1} />
                    ) : (
                      <Eye strokeWidth={1} />
                    )}
                  </div>
                </button>
              )}
            </Wrapper>
          )
        })}
      </GridContainer>
    </ProfileList>
  )
}