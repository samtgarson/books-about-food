import { Suspense } from 'react'
import { TeamsNav } from 'src/components/accounts/teams-nav'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { SignOutButton } from 'src/components/auth/sign-out-button'
import { SidebarItem } from 'src/components/nav/sidebar/item'
import { RefreshSession } from 'src/components/utils/refresh-session'
import { getSessionUser } from 'src/utils/user'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSessionUser()
  if (!user) return

  return (
    <Container belowNav>
      <RefreshSession />
      <PageTitle>Account</PageTitle>
      <div className="flex flex-wrap gap-x-32 gap-y-12">
        <div className="w-80">
          <SidebarItem label="Account Details" href="/account" exact />
          <SidebarItem label="Your Favourites" href="/account/favourites" />
          <SidebarItem label="Your Submissions" href="/account/submissions" />
          <SignOutButton />
          <Suspense>
            <TeamsNav />
          </Suspense>
        </div>
        <div className="min-w-[330px] flex-grow flex flex-col gap-16 max-w-4xl">
          {children}
        </div>
      </div>
    </Container>
  )
}

export default Layout
