'use client'

import { UserRole } from '@books-about-food/database'
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
  const [role, setRole] = useState<UserRole | null>(null)
  const { push } = useRouter()

  useEffect(() => {
    async function getRole() {
      try {
        const res = await fetch('/auth/session', { method: 'POST' })
        const { role } = await res.json()
        if (role && role !== 'waitlist') return push('/')
        setRole(role)
      } finally {
        setLoading(false)
      }
    }

    getRole()
  }, [push])

  if (loading || (role && role !== 'waitlist')) return <Loader size={40} />
  if (role === 'waitlist')
    return (
      <p className="lg:text-24">
        Thanks for registering! We&apos;ll be in touch soon.
        <br />
        <br />
        <button onClick={() => signOut()} className="text-14 underline">
          Sign out
        </button>
      </p>
    )

  return (
    <Form
      action={async ({ email }) => {
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
