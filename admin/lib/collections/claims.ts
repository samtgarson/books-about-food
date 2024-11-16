import { inngest } from '@books-about-food/core/jobs'
import { profileIncludes } from '@books-about-food/core/services/utils'
import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { resourceAction } from 'lib/utils/actions'
import { Schema } from '../../.schema/types'

async function approveClaim(idVal: string | number) {
  const id = idVal.toString()
  const claimResult = await prisma.claim.findUnique({
    where: { id },
    include: {
      user: true,
      profile: { include: profileIncludes }
    }
  })
  if (!claimResult?.user || !claimResult.profile)
    throw new Error('Claim not found')
  if (claimResult.cancelledAt)
    throw new Error('Claim has already been cancelled')
  const { profile, user } = claimResult

  await Promise.all([
    prisma.profile.update({
      where: { id: profile.id },
      data: { userId: user.id }
    }),
    prisma.claim.update({
      where: { id },
      data: { approvedAt: new Date() }
    }),
    inngest.send({
      name: 'jobs.email',
      data: {
        key: 'claimApproved',
        props: {
          profileSlug: profile.slug,
          profileName: profile.name,
          profileAvatarUrl: profile.avatar && imageUrl(profile.avatar.path),
          author: profile._count.authoredBooks > 0
        }
      },
      user
    }),
    revalidatePath('people', profile.slug),
    revalidatePath('authors', profile.slug)
  ])
}

export const customiseClaims = (
  collection: CollectionCustomizer<Schema, 'claims'>
) => {
  resourceAction({
    collection,
    name: '✅ Approve',
    successMessage: 'Approved! The user(s) has been notified 🚀',
    fn: approveClaim
  })

  collection.addField('State', {
    dependencies: ['approved_at', 'cancelled_at'],
    columnType: 'Enum',
    enumValues: ['Pending', 'Approved', 'Cancelled'],
    getValues(records) {
      return records.map((record) => {
        if (record.approved_at) return 'Approved'
        if (record.cancelled_at) return 'Cancelled'
        return 'Pending'
      })
    },
    defaultValue: 'Pending'
  })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}
