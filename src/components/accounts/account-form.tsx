'use client'

import { useState } from 'react'
import { Account } from 'src/core/models/types'
import { User } from 'src/core/types'
import { useUpdateSession } from 'src/hooks/use-update-session'
import { authClient } from 'src/lib/auth/client'
import { ConnectAccountButton } from '../auth/connect-account-button'
import { DestroyAccountButton } from '../auth/destroy-account-button'
import { Google } from '../auth/logos'
import { Form } from '../form'
import { Input } from '../form/input'
import { parseAppError } from '../form/utils'
import { successToast } from '../utils/toaster'
import { action } from './form-action'
import { AccountHeader } from './header'

export function AccountForm({
  user,
  accounts: initialAccounts
}: {
  user: User
  accounts: Account[]
}) {
  const { update: updateSession } = useUpdateSession()
  const [accounts, setAccounts] = useState(initialAccounts)
  const googleAccount = accounts?.find(
    (account) => account.providerId === 'google'
  )

  const sendVerification = (email: string) => {
    authClient.sendVerificationEmail({
      email,
      callbackURL: '/account'
    })
    successToast('Verification email sent', {
      description: 'Please check your inbox to verify your email address'
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <AccountHeader title="Account Details" />

      <Form
        action={async (values) => {
          const result = await action(values)
          if (!result.success) {
            return parseAppError(result.errors, {
              email: {
                UniqueConstraintViolation: 'Email already in use',
                InvalidInput: 'Invalid email address'
              },
              name: {
                InvalidInput: 'Name is required'
              }
            })
          }

          await updateSession()

          if (
            result.data.email &&
            result.data.email !== user.email &&
            !result.data?.emailVerified
          )
            sendVerification(result.data.email)
          else successToast('Account updated')
        }}
        autoSubmit
      >
        {!user.emailVerified && (
          <p>
            Please verify your email.{' '}
            <button
              type="button"
              onClick={() => user.email && sendVerification(user.email)}
              className="font-medium"
            >
              Resend verification email
            </button>
          </p>
        )}
        <Input
          required
          label="Name"
          name="name"
          defaultValue={user.name ?? ''}
        />
        <Input
          required
          label="Email"
          name="email"
          defaultValue={user.email ?? ''}
        />
        <div className="flex items-center gap-4 text-14">
          {googleAccount ? (
            <>
              <Google size={18} /> Signed in with Google
              <DestroyAccountButton
                className="ml-auto"
                provider="google"
                onDestroyed={() =>
                  setAccounts((prev) =>
                    prev.filter((a) => a.providerId !== 'google')
                  )
                }
              />
            </>
          ) : (
            <ConnectAccountButton provider="google" />
          )}
        </div>
      </Form>
    </div>
  )
}
