'use client'

import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { Button } from '../atoms/button'
import { Logo } from '../nav/logo'
import Link from 'next/link'
import { Google } from './logos'

export const SignInButtons: FC<{ callbackUrl?: string }> = ({
  callbackUrl
}) => (
  <>
    <Link href="/" className="block mb-20">
      <Logo />
    </Link>
    <Button
      onClick={() => signIn('google', { callbackUrl })}
      className="flex gap-3 items-center"
    >
      <Google />
      Continue with Google
    </Button>
  </>
)
