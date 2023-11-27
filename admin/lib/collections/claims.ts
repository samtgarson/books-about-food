import prisma from '@books-about-food/database'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

async function approveClaim(idVal: string | number) {
  const id = idVal.toString()
  const claim = await prisma.claim.findUnique({
    where: { id },
    include: { user: true }
  })
  if (!claim || !claim.user) throw new Error('Claim not found')

  if (claim.profileId) {
    await prisma.profile.update({
      where: { id: claim.profileId },
      data: { userId: claim.userId }
    })
  }

  await prisma.claim.update({
    where: { id },
    data: { approvedAt: new Date() }
  })
}

export const customiseClaims = (
  collection: CollectionCustomizer<Schema, 'claims'>
) => {
  collection.addAction('✅ Approve', {
    scope: 'Bulk',
    execute: async (context, result) => {
      const ids = await context.getRecordIds()
      try {
        await Promise.all(ids.map(approveClaim))

        const s = ids.length === 1 ? '' : 's'
        return result.success(
          `${ids.length} claim${s} approved! The user${s} have been notified 🚀`
        )
      } catch (e) {
        console.log(e)
        return result.error(`Error approving claims: ${(e as Error).message}`)
      }
    }
  })

  collection.addAction('✅ Approve', {
    scope: 'Single',
    execute: async (context, result) => {
      const id = await context.getRecordId()
      try {
        await approveClaim(id)

        return result.success('Claim approved! The user has been notified 🚀')
      } catch (e) {
        console.log(e)
        return result.error(`Error approving claim: ${(e as Error).message}`)
      }
    }
  })
}
