'use client'

import { Profile } from '@books-about-food/core/models/profile'
import { PencilMini } from 'src/components/atoms/icons'
import * as Overflow from 'src/components/atoms/overflow'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'

export const ProfileOverflow = ({
  profile,
  ...props
}: { profile: Profile } & Omit<Overflow.RootProps, 'children'>) => {
  const { openSheet } = useSheet()
  const currentUser = useCurrentUser()
  const editable =
    profile.userId === currentUser?.id || currentUser?.role === 'admin'

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
