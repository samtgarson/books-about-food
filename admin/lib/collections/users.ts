import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { CollectionCustomizer } from '@forestadmin/agent'
import { resourceAction } from 'lib/utils/actions'
import { Schema } from '../../.schema/types'

async function approveUser(id: string | number) {
  const user = await prisma.user.findUnique({
    where: { id: id.toString() }
  })
  if (!user) throw new Error('User not found')

  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'user' }
  })
  await inngest.send({
    name: 'jobs.email',
    data: { key: 'userApproved', props: undefined },
    user
  })
}

export const customiseUsers = (
  collection: CollectionCustomizer<Schema, 'users'>
) => {
  resourceAction({
    collection,
    name: '✅ Approve access',
    successMessage: 'Approved! The user(s) has been notified 🚀',
    fn: approveUser
  })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}
