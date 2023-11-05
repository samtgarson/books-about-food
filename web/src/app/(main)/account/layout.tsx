import { AccountNavItem, SignOutButton } from 'src/components/accounts/nav-item'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { getUser } from 'src/services/auth/get-user'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { data: user } = await getUser.call()
  if (!user) return

  return (
    <Container belowNav>
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
        </div>
        <div className="min-w-[350px] flex-grow">{children}</div>
      </div>
    </Container>
  )
}

export default Layout
