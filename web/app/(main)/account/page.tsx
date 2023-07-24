import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { SignOutButton } from 'src/components/auth/sign-out-button'
import { BookList } from 'src/components/books/list'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getUser } from 'src/services/auth/get-user'

const Page = async () => {
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  return (
    <Container belowNav>
      <PageTitle>Account</PageTitle>
      <Suspense fallback="Loading favourites">
        {/* @ts-expect-error RSC */}
        <FavouritesList user={user} />
      </Suspense>
      {/* @ts-expect-error RSC */}
      <BookList
        showCreate
        showFilters={false}
        filters={{ status: 'draft', submitterId: user.id }}
      />
      <SignOutButton />
    </Container>
  )
}

export default Page
