'use client'
import type { MembershipRole } from '@books-about-food/database'
import {
  ChevronsDown,
  ChevronsUp,
  Mail,
  Trash2
} from 'src/components/atoms/icons'
import * as Overflow from 'src/components/atoms/overflow'

export function MembershipsOverflow({
  id,
  role,
  onToggleRole,
  onRemoveUser
}: {
  id: string
  role: MembershipRole
  onToggleRole: (id?: string) => Promise<void>
  onRemoveUser: (id?: string) => Promise<void>
}) {
  return (
    <Overflow.Root>
      <Overflow.Item
        id={id}
        onClick={onToggleRole}
        icon={role === 'admin' ? ChevronsDown : ChevronsUp}
      >
        {role === 'member' ? 'Make admin' : 'Make member'}
      </Overflow.Item>
      <Overflow.Item
        variant="danger"
        id={id}
        onClick={onRemoveUser}
        icon={Trash2}
      >
        Remove from team
      </Overflow.Item>
    </Overflow.Root>
  )
}

export function InvitesOverflow({
  id,
  onRevoke,
  onResend
}: {
  id: string
  onRevoke: (id?: string) => Promise<void>
  onResend: (id?: string) => Promise<void>
}) {
  return (
    <Overflow.Root>
      <Overflow.Item id={id} onClick={onResend} icon={Mail}>
        Resend
      </Overflow.Item>
      <Overflow.Item variant="danger" id={id} onClick={onRevoke} icon={Trash2}>
        Revoke
      </Overflow.Item>
    </Overflow.Root>
  )
}
