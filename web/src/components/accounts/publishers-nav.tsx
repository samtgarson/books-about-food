import prisma from '@books-about-food/database'
import { getSessionUser } from 'src/utils/user'
import { SidebarItem } from '../nav/sidebar/item'

export async function PublishersNav() {
  const user = await getSessionUser()
  if (!user) return null

  const publishers = await prisma.publisher.findMany({
    where: { memberships: { some: { userId: user.id } } }
  })

  if (!publishers.length) return null
  return (
    <>
      <h3 className="px-4 py-2.5 font-medium mt-8">Publishers</h3>
      {publishers.map((publisher) => (
        <SidebarItem
          href={`/account/publishers/${publisher.slug}`}
          key={publisher.id}
          label={publisher.name}
        />
      ))}
    </>
  )
}
