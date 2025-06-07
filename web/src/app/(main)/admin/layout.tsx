import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { SidebarItem } from 'src/components/nav/sidebar/item'
import { getSessionUser } from 'src/utils/user'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSessionUser()
  if (user?.role !== 'admin') return notFound()

  return (
    <Container belowNav>
      <PageTitle>Admin</PageTitle>
      <div className="flex flex-wrap gap-x-32 gap-y-12">
        <div className="w-80">
          <SidebarItem label="Import Books" href="/admin" exact />
          <SidebarItem label="Posts" href="/admin/posts" />
        </div>
        <div className="flex min-w-[330px] max-w-4xl grow flex-col gap-16">
          {children}
        </div>
      </div>
    </Container>
  )
}

export default Layout
