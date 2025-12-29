'use server'

import { actions } from 'src/auth'
import { identify } from 'src/lib/tracking/identify'

export async function updateSession() {
  const updated = await actions.unstable_update({})
  if (updated?.user) await identify(updated.user)
  return updated
}

// async function fetchUser(): Promise<Session['user']> {
//   const userId = (await auth())?.user.id
//   if (!userId) throw new Error('No user found')
//
//   const db = await prisma.user.findUniqueOrThrow({
//     where: { id: userId },
//     include: { memberships: { select: { teamId: true } } }
//   })
//
//   return {
//     id: db.id,
//     email: db.email,
//     name: db.name,
//     role: db.role,
//     image: db.image,
//     publishers: db.memberships.map((m) => m.publisherId)
//   }
// }
