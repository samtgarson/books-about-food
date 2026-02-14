import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePopulated } from 'src/core/models/utils/payload-validation'
import { acceptInvite } from 'src/core/services/memberships/accept-invite'
import { deleteInvite } from 'src/core/services/memberships/delete-invite'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { PUBLISHER_DEPTH } from 'src/core/services/utils/payload-depth'
import { call } from 'src/utils/service'
import { getSessionUser } from 'src/utils/user'
import { Button } from '../atoms/button'
import { Submit } from '../form/submit'

export async function InviteWidget() {
  const user = await getSessionUser()
  if (!user) return null

  const payload = await getPayloadClient()
  const { docs: invites } = await payload.find({
    collection: 'publisher-invitations',
    where: {
      and: [
        { acceptedAt: { exists: false } },
        { email: { equals: user.email } }
      ]
    },
    depth: PUBLISHER_DEPTH + 1 // Populate publisher and invitedBy relationships
  })

  if (!invites.length) return null

  return (
    <div className="flex max-w-xl flex-col gap-4">
      {invites.map((invite) => {
        const publisher = requirePopulated(invite.publisher, 'publisher')
        const invitedBy = requirePopulated(invite.invitedBy, 'invitedBy')

        return (
          <form
            className="flex items-center gap-4 bg-white p-4"
            key={invite.id}
            action={async function () {
              'use server'

              await call(acceptInvite, { inviteId: invite.id })
              revalidatePath('/account')
              redirect(
                `/account/publishers/${publisher.slug}?action=invite-accepted`
              )
            }}
          >
            <p className="mr-auto">
              You&apos;ve been invited to join <strong>{publisher.name}</strong>{' '}
              by {invitedBy.name || invitedBy.email}.
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
        )
      })}
    </div>
  )
}
