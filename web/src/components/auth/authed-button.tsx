'use client'

import { usePathname } from 'next/navigation'
import { cloneElement, FC, ReactElement } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useSheet } from '../sheets/global-sheet'
import { useTracking } from '../tracking/context'

export type AuthedButtonProps = {
  children: ReactElement
  redirect?: string | null | false
  hidden?: 'authed' | 'unauthed'
  source: string
}

export const AuthedButton: FC<AuthedButtonProps> = ({
  redirect,
  hidden,
  children,
  source
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
      openSheet('signIn', { redirect })
    },
    'aria-label': 'Sign In'
  })

  return contents
}
