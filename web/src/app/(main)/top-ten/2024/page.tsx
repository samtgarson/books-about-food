import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import Image from 'next/image'
import { Suspense } from 'react'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Loader } from 'src/components/atoms/loader'
import { call } from 'src/utils/service'
import { TopTenGrid } from './grid'
import desktop from './top-ten-desktop.svg'
import mobile from './top-ten-mobile.svg'

export default function TopTen2024() {
  return (
    <Container belowNav>
      <AntiContainer className="h-72 sm:h-[430px] relative" aria-hidden>
        <Image
          src={mobile}
          alt="Top Ten 2024"
          fill
          className="sm:hidden object-cover"
        />
        <Image
          src={desktop}
          alt="Top Ten 2024"
          fill
          className="hidden sm:block object-cover"
        />
      </AntiContainer>
      <Suspense fallback={<Loader />}>
        <BookList />
      </Suspense>
    </Container>
  )
}

async function BookList() {
  const { data } = await call(fetchBooks, { releaseYear: 2024, perPage: 'all' })
  if (!data?.books?.length) return null

  return <TopTenGrid data-superjson books={data.books} />
}
