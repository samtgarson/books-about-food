'use client'

import cn from 'classnames'
import { signIn } from 'next-auth/react'
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
        signIn(provider, { redirect: false })
      }}
    >
      <Icon size={18} /> Connect {label}
    </button>
  )
}
