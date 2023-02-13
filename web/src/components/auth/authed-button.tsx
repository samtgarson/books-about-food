'use client'

import { usePathname } from 'next/navigation'
import { cloneElement, FC } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { SignInButtons } from './sign-in-buttons'

export type AuthedButtonProps = {
  children: JSX.Element
  redirect?: string | null | false
}

export const AuthedButton: FC<AuthedButtonProps> = ({
  redirect = '/account',
  children
}) => {
  const currentUser = useCurrentUser()
  const currentPath = usePathname()

  if (currentUser) return <>{children}</>

  const contents = cloneElement(
    children,
    children.props.href && {
      href: '#'
    }
  )
  const callbackUrl = redirect || currentPath || undefined

  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>{contents}</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body className="bg-grey">
          <SignInButtons callbackUrl={callbackUrl} />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
