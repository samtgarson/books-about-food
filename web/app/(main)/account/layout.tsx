import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { AccountNavItem } from 'src/components/accounts/nav-item'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { getUser } from 'src/services/auth/get-user'

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  return (
    <Container belowNav>
      <PageTitle>Account</PageTitle>
      <div className="flex flex-wrap gap-x-32 gap-y-12">
        <div className="w-80">
          <AccountNavItem label="Favourites" href="favourites" />
          <AccountNavItem label="Submitted Cookooks" href="books" />
          <AccountNavItem label="Account Details" href="" />
        </div>
        <div className="flex-grow min-w-[350px]">{children}</div>
      </div>
    </Container>
  )
}

export default Layout
