'use client'

import { signIn } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cloneElement, FC } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { Button } from '../atoms/button'

export type SignInButtonProps = {
  children: JSX.Element
  redirect?: string | null | false
}

export const SignInButton: FC<SignInButtonProps> = ({
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
        <Sheet.Body>
          <Button onClick={() => signIn('google', { callbackUrl })}>
            Continue with Google
          </Button>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
