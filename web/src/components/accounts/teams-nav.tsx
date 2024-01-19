import prisma from '@books-about-food/database'
import { getSessionUser } from 'src/utils/user'
import { AccountNavItem } from './nav-item'

export async function TeamsNav() {
  const user = await getSessionUser()
  if (!user) return null

  const teams = await prisma.team.findMany({
    where: { memberships: { some: { userId: user.id } } }
  })

  if (!teams.length) return null
  return (
    <>
      <h3 className="px-4 py-2.5 font-medium mt-8">Teams</h3>
      {teams.map((team) => (
        <AccountNavItem
          href={`teams/${team.slug}`}
          key={team.id}
          label={team.name}
        />
      ))}
    </>
  )
}
