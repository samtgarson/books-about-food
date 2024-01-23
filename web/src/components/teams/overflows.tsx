'use client'
import { MembershipRole } from '@books-about-food/database'
import { ChevronsDown, ChevronsUp, Trash2 } from 'react-feather'
import * as Overflow from 'src/components/atoms/overflow'

export function MembershipsOverflow({
  id,
  role,
  onToggleRole
}: {
  id: string
  role: MembershipRole
  onToggleRole: (id?: string) => Promise<void>
}) {
  return (
    <Overflow.Root>
      <Overflow.Item
        id={id}
        onClick={onToggleRole}
        icon={role === 'admin' ? ChevronsUp : ChevronsDown}
      >
        {role === 'member' ? 'Make member' : 'Make admin'}
      </Overflow.Item>
    </Overflow.Root>
  )
}

export function InvitesOverflow({
  id,
  onRevoke
}: {
  id: string
  onRevoke: (id?: string) => Promise<void>
}) {
  return (
    <Overflow.Root>
      <Overflow.Item variant="danger" id={id} onClick={onRevoke} icon={Trash2}>
        Revoke
      </Overflow.Item>
    </Overflow.Root>
  )
}
