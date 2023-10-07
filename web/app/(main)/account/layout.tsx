import { ReactNode } from 'react'
import { AccountNavItem, SignOutButton } from 'src/components/accounts/nav-item'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <Container belowNav>
      <PageTitle>Account</PageTitle>
      <div className="flex flex-wrap gap-x-32 gap-y-12">
        <div className="w-80">
          <AccountNavItem label="Account Details" href="" />
          <AccountNavItem label="Your Favourites" href="favourites" />
          <AccountNavItem label="Your Submissions" href="books" />
          <SignOutButton />
        </div>
        <div className="min-w-[350px] flex-grow">{children}</div>
      </div>
    </Container>
  )
}

export default Layout
