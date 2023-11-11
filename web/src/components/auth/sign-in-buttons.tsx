'use client'

import { signIn } from 'next-auth/react'
import { FC } from 'react'
import z from 'zod'
import { Button } from '../atoms/button'
import { Form } from '../form'
import { Input } from '../form/input'
import { Submit } from '../form/submit'
import { Google } from './logos'

export type SignInButtonsProps = {
  email?: boolean
  google?: boolean
  emailButtonLabel?: string
  callbackUrl?: string
  successMessage?: string
  emailButtonSibling?: JSX.Element
}

export const SignInButtons: FC<SignInButtonsProps> = ({
  callbackUrl,
  emailButtonLabel = 'Continue with Email',
  successMessage = 'We’ve just sent you a secure magic link to your inbox. When you click this link we’ll log you into your account automatically.'
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
      <Input
        name="email"
        label="Email Address"
        placeholder="author@cookbooks.com"
      />
      <div className="flex gap-4">
        <Submit variant="dark" className="grow">
          {emailButtonLabel}
        </Submit>
      </div>
      <p className="text-center">or</p>
      <Button
        onClick={() => signIn('google', { callbackUrl })}
        className="relative flex items-center justify-center gap-3"
        type="button"
      >
        <Google className="absolute left-4" size={20} />
        Continue with Google
      </Button>
    </Form>
  )
}
