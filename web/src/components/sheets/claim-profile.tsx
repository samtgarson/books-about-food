import { FC, useEffect } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { Profile } from 'src/models/profile'
import { Body, Content } from '../atoms/sheet'
import { useSheet } from './global-sheet'

export type ClaimProfileSheetProps = {
  profile: Profile
}

export const ClaimProfileSheet: FC<ClaimProfileSheetProps> = ({ profile }) => {
  const { openSheet } = useSheet()
  const currentUser = useCurrentUser()

  useEffect(() => {
    if (currentUser) return
    const redirect = `/profiles/${profile.slug}?action=claim`
    openSheet('signIn', { redirect })
  }, [currentUser, openSheet, profile.slug])

  return (
    <Content>
      <Body>Claim {profile.name}</Body>
    </Content>
  )
}
