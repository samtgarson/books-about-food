'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from 'src/components/atoms/button'
import { Loader } from 'src/components/atoms/loader'
import { AuthedButton } from 'src/components/auth/authed-button'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { usePromise } from 'src/hooks/use-promise'
import z from 'zod'
import { checkSession } from './action'

export function WelcomeMessage() {
  const { value: role, loading } = usePromise(checkSession, null, [])
  const { push } = useRouter()

  useEffect(() => {
    if (role && role !== 'waitlist') push('/')
  }, [role, push])

  if (loading || (role && role !== 'waitlist')) return <Loader size={40} />
  if (role)
    return (
      <p className="lg:text-24">
        Thanks for registering! We&apos;ll be in touch soon.
      </p>
    )

  return (
    <Form
      action={async ({ email }) => {
        await signIn('email', {
          email,
          redirect: false
        })
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
