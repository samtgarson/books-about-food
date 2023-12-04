'use client'

import { cloneElement, FC, ReactElement } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'

export type AuthedButtonProps = {
  children: ReactElement
  redirect?: string | null | false
  hidden?: 'authed' | 'unauthed'
}

export const AuthedButton: FC<AuthedButtonProps> = ({
  redirect = '/account',
  hidden,
  children
}) => {
  const currentUser = useCurrentUser()
  const { openSheet } = useSheet()

  if (currentUser) return hidden === 'authed' ? null : <>{children}</>
  if (!currentUser && hidden === 'unauthed') return null

  const contents = cloneElement(children, {
    href: '#',
    onClick: (e: MouseEvent) => {
      e.preventDefault()
      openSheet('signIn', { redirect })
    }
  })

  return contents
}
