'use client'

import { trackEvent } from 'fathom-client'
import { Session } from 'next-auth/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from 'src/components/atoms/button'
import { Loader } from 'src/components/atoms/loader'
import { emailSignIn, signOut } from 'src/components/auth/actions'
import { AuthedButton } from 'src/components/auth/authed-button'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import z from 'zod'

export function WelcomeMessage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<Session['user'] | null>(null)
  const { push } = useRouter()

  useEffect(() => {
    async function getRole() {
      try {
        const res = await fetch('/auth/session', { method: 'POST' })
        const json = await res.json()
        const user = json?.user
        if (user?.role && user.role !== 'waitlist') return push('/')
        setUser(user)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }

    getRole()
  }, [push])

  if (loading || (user?.role && user.role !== 'waitlist'))
    return <Loader size={40} />
  if (user?.role === 'waitlist')
    return (
      <>
        <p className="lg:text-24">
          Thanks for registering! We&apos;ll be in touch soon.
        </p>
        <p className="text-14">
          Logged in as {user.email}.{' '}
          <button onClick={() => signOut()} className="underline">
            Sign out
          </button>
        </p>
      </>
    )

  return (
    <Form
      action={async ({ email }) => {
        trackEvent('join waitlist')
        await emailSignIn({ email })
      }}
      schema={z.object({ email: z.string() })}
      successMessage="Thanks, we'll be in touch! Check your email to complete your
          registration."
    >
      <p className="lg:text-24">
        Register now to claim your profile and get early access.
      </p>
      <Input
        name="email"
        label="Email Address"
        placeholder="author@cookbooks.com"
      />
      <div className="flex gap-4">
        <Submit variant="tertiary">Register</Submit>
        <AuthedButton redirect="/">
          <Button className="ml-auto" variant="secondary">
            Beta Sign In
          </Button>
        </AuthedButton>
      </div>
    </Form>
  )
}
