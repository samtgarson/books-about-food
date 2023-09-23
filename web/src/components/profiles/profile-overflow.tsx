'use client'

import { Edit } from 'react-feather'
import * as Overflow from 'src/components/atoms/overflow'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { Profile } from 'src/models/profile'
import { useSheet } from '../sheets/global-sheet'

export const ProfileOverflow = ({
  profile,
  ...props
}: { profile: Profile } & Omit<Overflow.RootProps, 'children'>) => {
  const { openSheet } = useSheet()
  const currentUser = useCurrentUser()
  const editable =
    profile.userId === currentUser?.id || currentUser?.role === 'admin'

  if (editable) return null
  return (
    <Overflow.Root {...props}>
      <Overflow.Item
        onClick={() => openSheet('suggestEdit', { resource: profile })}
      >
        <Edit strokeWidth={1} />
        Suggest an edit
      </Overflow.Item>
    </Overflow.Root>
  )
}
