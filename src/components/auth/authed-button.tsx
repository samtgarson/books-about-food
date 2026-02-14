'use client'

import { usePathname } from 'next/navigation'
import { cloneElement, FC, ReactElement, useState } from 'react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { useIsMounted } from 'usehooks-ts'
import { Button } from '../atoms/button'
import { useSheet } from '../sheets/global-sheet'
import { SignInSheetProps } from '../sheets/sign-in'
import { useTracking } from '../tracking/context'

export type AuthedButtonProps = {
  children: ReactElement<any> // eslint-disable-line @typescript-eslint/no-explicit-any
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
  const mounted = useIsMounted()
  const [clicked, setClicked] = useState(false)
  const currentUser = useCurrentUser()
  const { openSheet } = useSheet()
  const pathname = usePathname()
  const { track } = useTracking()

  if (currentUser) return hidden === 'authed' ? null : <>{children}</>
  if (!currentUser && hidden === 'unauthed') return null
  if (!redirect && redirect !== false) redirect = pathname

  const isLoadable = children.type == Button

  const contents = cloneElement(children, {
    href: '#',
    loading: isLoadable ? clicked : undefined,
    async onClick(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      setClicked(true)
      await track('Pressed a button', { Button: 'Sign In', Extra: { source } })
      const { onClose } = await openSheet('signIn', { redirect, ...props })
      onClose(() => mounted() && setClicked(false))
    },
    'aria-label': 'Sign In'
  })

  return contents
}
