import prisma from '@books-about-food/database'
import { getSessionUser } from 'src/utils/user'
import { SidebarItem } from '../nav/sidebar/item'

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
        <SidebarItem
          href={`/account/teams/${team.slug}`}
          key={team.id}
          label={team.name}
        />
      ))}
    </>
  )
}
