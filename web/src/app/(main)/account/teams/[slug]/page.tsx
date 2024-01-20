import { Team } from '@books-about-food/core/models/team'
import { deleteInvite } from '@books-about-food/core/services/teams/delete-invite'
import { fetchTeam } from '@books-about-food/core/services/teams/fetch-team'
import { PublisherGrid } from 'app/(main)/publishers/grid'
import { formatRelative } from 'date-fns'
import { capitalize } from 'inflection'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { Plus } from 'react-feather'
import { AccountHeader } from 'src/components/accounts/header'
import { BaseAvatar } from 'src/components/atoms/avatar'
import * as Overflow from 'src/components/atoms/overflow'
import { Tag } from 'src/components/atoms/tag'
import { PageProps } from 'src/components/types'
import { Toaster } from 'src/components/utils/toaster'
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
      />
      <AccountHeader title={team.name} />
      <PublisherGrid publishers={team.publishers} square={false} />
      <Memberships team={team} />
      <Invites team={team} userId={user.id} />
    </div>
  )
}

function Memberships({ team }: { team: Team }) {
  if (team.memberships.length === 0) return null

  return (
    <div className="flex flex-col">
      <h3 className="font-medium">Memberships</h3>
      <ul>
        {team.memberships.map(({ user, id, role }) => (
          <li
            key={id}
            className="flex gap-4 py-4 items-center border-b border-neutral-grey"
          >
            <BaseAvatar
              imgProps={user.image?.imageAttrs()}
              backup={user.displayName}
              size="2xs"
            />
            <p className="mr-auto">{user.displayName}</p>
            <Tag color={role === 'admin' ? 'white' : 'grey'}>{role}</Tag>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Invites({ team, userId }: { team: Team; userId: string }) {
  const role = team.userRole(userId)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="font-medium">Invites</h3>
        <Plus strokeWidth={1} />
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
            {role === 'admin' && (
              <Overflow.Root>
                <Overflow.Item
                  icon={false}
                  variant="danger"
                  id={invite.id}
                  onClick={async function (id) {
                    'use server'
                    if (!id) return

                    await call(deleteInvite, { inviteId: id })
                    revalidatePath(`/account/teams/${team.slug}`)
                  }}
                >
                  Revoke
                </Overflow.Item>
              </Overflow.Root>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
