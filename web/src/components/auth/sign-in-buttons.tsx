'use client'

import { FC, useState, type JSX } from 'react'
import { useUserAgent } from 'src/hooks/use-user-agent'
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
  const isInstagram = useUserAgent()?.includes('Instagram')
  const [googleLoading, setGoogleLoading] = useState(false)
  return (
    <Form
      action={emailSignIn}
      schema={z.object({ email: z.string(), redirect: z.string().optional() })}
      successMessage={successMessage}
      variant="bordered"
    >
      <input type="hidden" name="redirect" value={callbackUrl} />
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
      {!isInstagram && (
        <>
          <p className="text-center">or</p>
          <Button
            onClick={() => {
              setGoogleLoading(true)
              googleSignIn(callbackUrl)
            }}
            className="relative flex items-center justify-center gap-3 border border-neutral-grey"
            type="button"
            loading={googleLoading}
          >
            <Google className="absolute left-4" size={20} />
            Continue with Google
          </Button>
        </>
      )}
    </Form>
  )
}
