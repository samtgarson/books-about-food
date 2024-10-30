'use client'

import { usePathname } from 'next/navigation'
import { cloneElement, FC, ReactElement } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'
import { SignInSheetProps } from '../sheets/sign-in'
import { useTracking } from '../tracking/context'

export type AuthedButtonProps = {
  children: ReactElement
  hidden?: 'authed' | 'unauthed'
  source: string
} & SignInSheetProps

export const AuthedButton: FC<AuthedButtonProps> = ({
  redirect,
  hidden,
  children,
  source,
  ...props
}) => {
  const currentUser = useCurrentUser()
  const { openSheet } = useSheet()
  const pathname = usePathname()
  const { track } = useTracking()

  if (currentUser) return hidden === 'authed' ? null : <>{children}</>
  if (!currentUser && hidden === 'unauthed') return null
  if (!redirect && redirect !== false) redirect = pathname

  const contents = cloneElement(children, {
    href: '#',
    async onClick(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      await track('Pressed a button', { Button: 'Sign In', Extra: { source } })
      openSheet('signIn', { redirect, ...props })
    },
    'aria-label': 'Sign In'
  })

  return contents
}
