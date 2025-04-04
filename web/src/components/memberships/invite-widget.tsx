import { acceptInvite } from '@books-about-food/core/services/memberships/accept-invite'
import { deleteInvite } from '@books-about-food/core/services/memberships/delete-invite'
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

  const invites = await prisma.publisherInvitation.findMany({
    where: { acceptedAt: null, email: user.email },
    include: { publisher: true, invitedBy: true }
  })

  if (!invites.length) return null

  return (
    <div className="flex max-w-xl flex-col gap-4">
      {invites.map((invite) => (
        <form
          className="flex items-center gap-4 bg-white p-4"
          key={invite.id}
          action={async function () {
            'use server'

            await call(acceptInvite, { inviteId: invite.id })
            revalidatePath('/account')
            redirect(
              `/account/publishers/${invite.publisher.slug}?action=invite-accepted`
            )
          }}
        >
          <p className="mr-auto">
            You&apos;ve been invited to join{' '}
            <strong>{invite.publisher.name}</strong> by{' '}
            {invite.invitedBy.name || invite.invitedBy.email}.
          </p>
          <Button
            variant="outline"
            formAction={async function () {
              'use server'

              await call(deleteInvite, { inviteId: invite.id })
              revalidatePath('/account')
            }}
          >
            Decline
          </Button>
          <Submit>Accept</Submit>
        </form>
      ))}
    </div>
  )
}
