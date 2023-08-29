'use client'

import { Edit } from 'react-feather'
import * as Overflow from 'src/components/atoms/overflow'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { Profile } from 'src/models/profile'

export const ProfileOverflow = ({
  profile,
  ...props
}: { profile: Profile } & Omit<Overflow.RootProps, 'children'>) => {
  const currentUser = useCurrentUser()
  const editable =
    profile.userId === currentUser?.id || currentUser?.role === 'admin'

  if (editable) return null
  return (
    <Overflow.Root {...props}>
      <Overflow.Item>
        <Edit strokeWidth={1} />
        Suggest an edit
      </Overflow.Item>
    </Overflow.Root>
  )
}
