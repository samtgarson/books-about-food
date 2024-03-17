import { Suspense } from 'react'
import { AccountNavItem } from 'src/components/accounts/nav-item'
import { TeamsNav } from 'src/components/accounts/teams-nav'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { SignOutButton } from 'src/components/auth/sign-out-button'
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
          <AccountNavItem label="Account Details" href="" />
          <AccountNavItem label="Your Favourites" href="favourites" />
          <AccountNavItem label="Your Submissions" href="submissions" />
          {user.role === 'admin' && (
            <AccountNavItem label="Admin" href="admin" />
          )}
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
