'use client'

import cn from 'classnames'
import { authClient } from 'src/lib/auth/client'
import { Google } from '../logos'

const providers = { google: { Icon: Google, label: 'Google' } }

export function ConnectAccountButton({
  provider,
  className
}: {
  provider: keyof typeof providers
  className?: string
}) {
  const { Icon, label } = providers[provider]
  return (
    <button
      type="button"
      className={cn('flex items-center gap-4', className)}
      onClick={() => {
        authClient.linkSocial({
          provider,
          callbackURL: '/account'
        })
      }}
    >
      <Icon size={18} /> Connect {label}
    </button>
  )
}
