'use client'

import { cloneElement, FC, ReactElement } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'

export type AuthedButtonProps = {
  children: ReactElement
  redirect?: string | null | false
}

export const AuthedButton: FC<AuthedButtonProps> = ({
  redirect = '/account',
  children
}) => {
  const currentUser = useCurrentUser()
  const { openSheet } = useSheet()

  if (currentUser) return <>{children}</>

  const contents = cloneElement(children, {
    href: '#',
    onClick: (e: MouseEvent) => {
      e.preventDefault()
      openSheet('signIn', { redirect })
    }
  })

  return contents
}
