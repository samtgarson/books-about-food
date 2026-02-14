'use client'

import { PencilMini } from 'src/components/atoms/icons'
import * as Overflow from 'src/components/atoms/overflow'
import { Profile } from 'src/core/models/profile'
import { can } from 'src/core/policies'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'

export const ProfileOverflow = ({
  profile,
  ...props
}: { profile: Profile } & Omit<Overflow.RootProps, 'children'>) => {
  const { openSheet } = useSheet()
  const currentUser = useCurrentUser()
  const editable = currentUser && can(currentUser, profile).update

  if (editable && currentUser.role !== 'admin') return null
  return (
    <Overflow.Root {...props}>
      {!editable && (
        <Overflow.Item
          onClick={() => {
            openSheet('suggestEdit', { resource: profile })
          }}
          icon={PencilMini}
        >
          Suggest an edit
        </Overflow.Item>
      )}
      <Overflow.Item
        variant="admin"
        href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/profiles/index/record/books/${profile.id}/details`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Forest
      </Overflow.Item>
    </Overflow.Root>
  )
}
