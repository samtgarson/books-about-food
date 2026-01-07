import cn from 'classnames'
import { formatRelative } from 'date-fns'
import { capitalize } from 'inflection'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { Button } from 'src/components/atoms/button'
import { ArrowUpRight } from 'src/components/atoms/icons'
import { Tag } from 'src/components/atoms/tag'
import { PublisherInviteButton } from 'src/components/memberships/invite-button'
import {
  InvitesOverflow,
  MembershipsOverflow
} from 'src/components/memberships/overflows'
import { slugPage } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'
import { Invitation } from 'src/core/models/invitation'
import { Membership } from 'src/core/models/membership'
import { Publisher } from 'src/core/models/publisher'
import { can } from 'src/core/policies'
import { deleteInvite } from 'src/core/services/memberships/delete-invite'
import { destroyMembership } from 'src/core/services/memberships/destroy-membership'
import { fetchInvitations } from 'src/core/services/memberships/fetch-invitations'
import { fetchMemberships } from 'src/core/services/memberships/fetch-memberships'
import { resendInvite } from 'src/core/services/memberships/resend-invite'
import { updateMembership } from 'src/core/services/memberships/update-membership'
import { fetchPublisher } from 'src/core/services/publishers/fetch-publisher'
import { User } from 'src/core/types'
import { pick } from 'src/utils/object-helpers'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

export default slugPage<'/account/publishers/[slug]'>(
  async function AccountPublisherPage(slug) {
    const [
      { data: publisher },
      { data: memberships = [] },
      { data: invitations = [] }
    ] = await Promise.all([
      call(fetchPublisher, { slug }),
      call(fetchMemberships, { slug }),
      call(fetchInvitations, { slug })
    ])
    const user = await getSessionUser()
    const currentUserMembership = memberships.find(
      (m) => m.user.id === user?.id
    )
    if (!publisher || !user || !currentUserMembership) notFound()

    return (
      <div className="flex max-w-xl flex-col gap-12">
        <Toaster
          action="invite-accepted"
          type="success"
          message="Invite accepted"
        />
        <Toaster
          action="invite-resent"
          type="success"
          message="Invite resent"
        />
        <AccountHeader title={publisher.name}>
          <Button
            href={`/publishers/${publisher.slug}`}
            size="small"
            variant="tertiary"
          >
            View page <ArrowUpRight strokeWidth={1} />
          </Button>
        </AccountHeader>
        <Memberships
          publisher={publisher}
          memberships={memberships}
          currentUser={user}
        />
        {currentUserMembership?.role === 'admin' && (
          <Invites
            publisher={publisher}
            invitations={invitations}
            currentUser={user}
          />
        )}
      </div>
    )
  }
)

function Memberships({
  publisher,
  memberships,
  currentUser
}: {
  publisher: Publisher
  memberships: Membership[]
  currentUser: User
}) {
  return (
    <div className="flex flex-col">
      <h3 className="font-medium">Members</h3>
      <ul>
        {memberships.map(({ user, id, role }) => (
          <li
            key={id}
            className={cn(
              'flex items-center gap-4 border-b border-neutral-grey py-4',
              user.is(currentUser) &&
                can(currentUser, publisher).update &&
                'pr-10'
            )}
          >
            <BaseAvatar
              imgProps={user.image?.imageAttrs?.()}
              backup={user.displayName}
              size="2xs"
            />
            <div className="flex flex-col gap-x-4 sm:flex-row">
              <p>{user.is(currentUser) ? 'You' : user.displayName}</p>
              {user.name && (
                <p className="shrink truncate opacity-50">{user.email}</p>
              )}
            </div>
            <Tag
              color={role === 'admin' ? 'white' : 'grey'}
              className="ml-auto"
            >
              {role}
            </Tag>
            {can(currentUser, publisher).update && !user.is(currentUser) && (
              <MembershipsOverflow
                id={id}
                role={role}
                onToggleRole={async function (membershipId) {
                  'use server'
                  if (!membershipId) return

                  const newRole = role === 'admin' ? 'member' : 'admin'
                  await call(updateMembership, { membershipId, role: newRole })
                  revalidatePath(`/account/publishers/${publisher.slug}`)
                }}
                onRemoveUser={async function (id) {
                  'use server'
                  if (!id) return

                  await call(destroyMembership, { id })
                  revalidatePath(`/account/publishers/${publisher.slug}`)
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Invites({
  publisher,
  invitations,
  currentUser
}: {
  publisher: Publisher
  invitations: Invitation[]
  currentUser: User
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-medium">Invites</h3>
        <PublisherInviteButton
          publisher={pick(publisher, ['id', 'name', 'slug'])}
        />
      </div>
      {invitations.length === 0 && (
        <p className="mt-2 opacity-50">No invites</p>
      )}
      <ul>
        {invitations.map((invite) => (
          <li
            key={invite.id}
            className="flex items-center gap-4 border-b border-neutral-grey py-4"
          >
            <p className="mr-auto">{invite.email}</p>
            <p className="opacity-50">
              {capitalize(formatRelative(invite.createdAt, new Date()))}
            </p>
            {can(currentUser, publisher).update && (
              <InvitesOverflow
                id={invite.id}
                onRevoke={async function (id) {
                  'use server'
                  if (!id) return

                  await call(deleteInvite, { inviteId: id })
                  revalidatePath(`/account/publishers/${publisher.slug}`)
                }}
                onResend={async function (id) {
                  'use server'
                  if (!id) return

                  await call(resendInvite, { id })
                  redirect(
                    `/account/publishers/${publisher.slug}?action=invite-resent`
                  )
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
