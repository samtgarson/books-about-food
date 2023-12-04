import { profileIncludes } from '@books-about-food/core/services/utils'
import prisma from '@books-about-food/database'
import { inngest } from '@books-about-food/jobs'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { CollectionCustomizer } from '@forestadmin/agent'
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
    })
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
}
