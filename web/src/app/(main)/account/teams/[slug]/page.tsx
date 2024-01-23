import { Team } from '@books-about-food/core/models/team'
import { can } from '@books-about-food/core/policies'
import { deleteInvite } from '@books-about-food/core/services/teams/delete-invite'
import { fetchTeam } from '@books-about-food/core/services/teams/fetch-team'
import { updateMembership } from '@books-about-food/core/services/teams/update-membership'
import { User } from '@books-about-food/core/types'
import { PublisherGrid } from 'app/(main)/publishers/grid'
import cn from 'classnames'
import { formatRelative } from 'date-fns'
import { capitalize } from 'inflection'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { Tag } from 'src/components/atoms/tag'
import { TeamInviteButton } from 'src/components/teams/invite-button'
import {
  InvitesOverflow,
  MembershipsOverflow
} from 'src/components/teams/overflows'
import { PageProps } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'
import { pick } from 'src/utils/object-helpers'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'

export default async function TeamPage({
  params: { slug }
}: PageProps<{ slug: string }>) {
  const { data: team } = await call(fetchTeam, { slug })
  const user = await getSessionUser()
  if (!team || !user) notFound()

  return (
    <div className="flex flex-col gap-12 max-w-xl">
      <Toaster
        action="invite-accepted"
        type="success"
        message="Invite accepted"
        refreshSession
      />
      <AccountHeader title={team.name} />
      {team.publishers.length > 0 && (
        <PublisherGrid publishers={team.publishers} square={false} />
      )}
      <Memberships team={team} currentUser={user} />
      <Invites team={team} currentUser={user} />
    </div>
  )
}

function Memberships({ team, currentUser }: { team: Team; currentUser: User }) {
  return (
    <div className="flex flex-col">
      <h3 className="font-medium">Memberships</h3>
      <ul>
        {team.memberships.map(({ user, id, role }) => (
          <li
            key={id}
            className={cn(
              'flex gap-4 py-4 items-center border-b border-neutral-grey',
              user.is(currentUser) && 'pr-10'
            )}
          >
            <BaseAvatar
              imgProps={user.image?.imageAttrs()}
              backup={user.displayName}
              size="2xs"
            />
            <p>{user.is(currentUser) ? 'You' : user.displayName}</p>
            <p className="mr-auto opacity-50">{user.email}</p>
            <Tag color={role === 'admin' ? 'white' : 'grey'}>{role}</Tag>
            {can(currentUser, team).update && !user.is(currentUser) && (
              <MembershipsOverflow
                id={id}
                role={role}
                onToggleRole={async function (id) {
                  'use server'
                  if (!id) return

                  await call(updateMembership, {
                    membershipId: id,
                    role: role === 'admin' ? 'member' : 'admin'
                  })
                  revalidatePath(`/account/teams/${team.slug}`)
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Invites({ team, currentUser }: { team: Team; currentUser: User }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-medium">Invites</h3>
        <TeamInviteButton team={pick(team, ['id', 'slug', 'name'])} />
      </div>
      {team.invitations.length === 0 && (
        <p className="opacity-50 mt-2">No invites</p>
      )}
      <ul>
        {team.invitations.map((invite) => (
          <li
            key={invite.id}
            className="flex gap-4 py-4 items-center border-b border-neutral-grey"
          >
            <p className="mr-auto">{invite.email}</p>
            <p className="opacity-50">
              {capitalize(formatRelative(invite.createdAt, new Date()))}
            </p>
            {can(currentUser, team).update && (
              <InvitesOverflow
                id={invite.id}
                onRevoke={async function (id) {
                  'use server'
                  if (!id) return

                  await call(deleteInvite, { inviteId: id })
                  revalidatePath(`/account/teams/${team.slug}`)
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
