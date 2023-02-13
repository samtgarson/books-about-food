'use client'

import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { Button } from '../atoms/button'
import google from 'src/assets/auth-logos/google.svg'
import Image from 'next/image'
import { Logo } from '../nav/logo'
import Link from 'next/link'

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
      <Image src={google} width={30} height={30} alt="Google" />
      Continue with Google
    </Button>
  </>
)
