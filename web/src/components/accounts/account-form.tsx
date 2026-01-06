'use client'

import { Account } from '@books-about-food/database'
import { User } from 'src/core/types'
import { emailSignIn } from '../auth/actions'
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
  accounts
}: {
  user: User
  accounts: Account[]
}) {
  const googleAccount = accounts?.find(
    (account) => account.provider === 'google'
  )

  const sendVerification = (email: string) => {
    emailSignIn({ email, redirect: '/account' })
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
              <DestroyAccountButton className="ml-auto" provider="google" />
            </>
          ) : (
            <ConnectAccountButton provider="google" />
          )}
        </div>
      </Form>
    </div>
  )
}
