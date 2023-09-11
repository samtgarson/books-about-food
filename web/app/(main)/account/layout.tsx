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
          <AccountNavItem label="Favourites" href="favourites" />
          <AccountNavItem label="Submitted Cookooks" href="books" />
          <SignOutButton />
        </div>
        <div className="flex-grow min-w-[350px]">{children}</div>
      </div>
    </Container>
  )
}

export default Layout
