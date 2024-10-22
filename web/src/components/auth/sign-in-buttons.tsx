'use client'

import { FC, useState } from 'react'
import z from 'zod'
import { Button } from '../atoms/button'
import { Form } from '../form'
import { Input } from '../form/input'
import { Submit } from '../form/submit'
import { emailSignIn, googleSignIn } from './actions'
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
  callbackUrl = '/',
  emailButtonLabel = 'Continue with Email',
  successMessage = 'We’ve just sent you a secure magic link to your inbox. When you click this link we’ll log you into your account automatically.'
}) => {
  const [googleLoading, setGoogleLoading] = useState(false)
  return (
    <Form
      action={emailSignIn}
      schema={z.object({ email: z.string() })}
      successMessage={successMessage}
      variant="bordered"
    >
      <Input
        name="email"
        label="Email Address"
        placeholder="author@cookbooks.com"
        type="email"
        required
      />
      <div className="flex gap-4">
        <Submit className="grow">{emailButtonLabel}</Submit>
      </div>
      <p className="text-center">or</p>
      <Button
        onClick={() => {
          setGoogleLoading(true)
          googleSignIn(callbackUrl)
        }}
        className="relative flex items-center justify-center gap-3"
        type="button"
        loading={googleLoading}
      >
        <Google className="absolute left-4" size={20} />
        Continue with Google
      </Button>
    </Form>
  )
}
