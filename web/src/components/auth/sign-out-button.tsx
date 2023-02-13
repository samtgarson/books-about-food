'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../atoms/button'

export const SignOutButton = () => {
  const router = useRouter()
  const signOutAndRedirect = async () => {
    const { url } = await signOut({ redirect: false, callbackUrl: '/' })
    router.push(url)
  }

  return <Button onClick={() => signOutAndRedirect()}>Sign out</Button>
}
