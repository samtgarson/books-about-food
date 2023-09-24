'use client'

import { signIn } from 'next-auth/react'
import { FC } from 'react'
import { Button } from '../atoms/button'
import { Google } from './logos'
import { Input } from '../form/input'
import { Submit } from '../form/submit'
import { Form } from '../form'
import z from 'zod'

export type SignInButtonsProps = {
  email?: boolean
  google?: boolean
  emailButtonLabel?: string
  callbackUrl?: string
  successMessage?: string
}

export const SignInButtons: FC<SignInButtonsProps> = ({
  callbackUrl,
  email = true,
  google = true,
  emailButtonLabel = 'Continue with Email',
  successMessage = 'Check your email for a sign in link.'
}) => {
  return (
    <Form
      action={async ({ email }) => {
        await signIn('email', {
          email,
          redirect: false,
          callbackUrl
        })
      }}
      schema={z.object({ email: z.string() })}
      successMessage={successMessage}
    >
      {email && (
        <>
          <Input
            name="email"
            label="Email Address"
            placeholder="author@cookbooks.com"
          />
          <Submit variant="dark">{emailButtonLabel}</Submit>
        </>
      )}
      {email && google && <p className="text-center">or</p>}
      {google && (
        <Button
          onClick={() => signIn('google', { callbackUrl })}
          className="relative flex items-center justify-center gap-3"
          type="button"
        >
          <Google className="absolute left-4" size={20} />
          Continue with Google
        </Button>
      )}
    </Form>
  )
}
