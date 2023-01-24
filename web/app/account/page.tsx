import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { getUser } from 'src/services/auth/get-user'
import { fetchFavourites } from 'src/services/favourites/fetch-favourites'

const Page = async () => {
  const user = await getUser.call()
  if (!user) notFound()
  const favourites = await fetchFavourites.call(undefined, user)

  return (
    <Container>
      <h1>Account</h1>
      <div>
        {favourites?.length
          ? favourites.map((favourite) => (
              <div key={favourite.id}>{favourite.profile.name}</div>
            ))
          : 'No favourites'}
      </div>
    </Container>
  )
}

export default Page
