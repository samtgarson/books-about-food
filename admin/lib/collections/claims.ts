import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { Schema } from '../../.schema/types'

export const customiseClaims = (
  collection: CollectionCustomizer<Schema, 'claims'>
) => {
  collection.addAction('Approve', {
    scope: 'Bulk',
    execute: async (context, result) => {
      const ids = await context.getRecordIds()
      await Promise.all(
        ids.map(async (idVal) => {
          const id = idVal.toString()
          const claim = await prisma.claim.findUnique({
            where: { id },
            include: { user: true }
          })
          if (!claim || !claim.user) return result.error('Claim not found')

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
        })
      )

      const s = ids.length === 1 ? '' : 's'
      return result.success(
        `${ids.length} claim${s} approved! The user${s} have been notified 🚀`
      )
    }
  })
}
