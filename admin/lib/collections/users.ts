import prisma from '@books-about-food/database'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseUsers = (
  collection: CollectionCustomizer<Schema, 'users'>
) => {
  collection.addAction('✅ Approve access', {
    scope: 'Single',
    execute: async (context, result) => {
      const { id } = await context.getRecord(['id'])
      await prisma.user.update({
        where: { id },
        data: { role: 'user' }
      })
      return result.success('🎉 User approved')
    }
  })

  collection.addAction('✅ Approve access', {
    scope: 'Bulk',
    execute: async (context, result) => {
      const ids = await context.getRecordIds()
      try {
        await prisma.user.updateMany({
          where: { id: { in: ids.map((id) => id.toString()) } },
          data: { role: 'user' }
        })
        return result.success('🎉 Users approved')
      } catch (e) {
        console.log(e)
        return result.error(`Error publishing books: ${(e as Error).message}`)
      }
    }
  })
}
