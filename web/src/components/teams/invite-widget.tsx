import { acceptInvite } from '@books-about-food/core/services/teams/accept-invite'
import prisma from '@books-about-food/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'
import { Button } from '../atoms/button'
import { Submit } from '../form/submit'

export async function InviteWidget() {
  const user = await getSessionUser()
  if (!user) return null

  const invites = await prisma.teamInvitation.findMany({
    where: { acceptedAt: null, email: user.email },
    include: { team: true, invitedBy: true }
  })

  if (!invites.length) return null

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      {invites.map((invite) => (
        <form
          className="flex gap-4 bg-white p-4 items-center"
          key={invite.id}
          action={async function () {
            'use server'

            await call(acceptInvite, { inviteId: invite.id })
            revalidatePath('/account')
            redirect(
              `/account/teams/${invite.team.slug}?action=invite-accepted`
            )
          }}
        >
          <p className="mr-auto">
            You&apos;ve been invited to join <strong>{invite.team.name}</strong>{' '}
            by {invite.invitedBy.name || invite.invitedBy.email}.
          </p>
          <Button
            variant="outline"
            formAction={async function () {
              'use server'

              await prisma.teamInvitation.delete({
                where: { id: invite.id }
              })
              revalidatePath('/account')
            }}
          >
            Decline
          </Button>
          <Submit variant="dark">Accept</Submit>
        </form>
      ))}
    </div>
  )
}
