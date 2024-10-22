import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { call } from 'src/utils/service'
import { TopTenGrid } from './grid'
import logo from './logo.svg'
import desktop from './top-ten-desktop.svg'
import mobile from './top-ten-mobile.svg'

export const metadata: Metadata = {
  title: "2024's Top Ten on Books About Food",
  description:
    'Support your favourite chefs and vote for the best books about food from 2024.',
  alternates: {
    canonical: '/top-ten/2024'
  },
  robots: {
    index: false,
    follow: false
  }
}

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export default async function TopTen2024() {
  const { data } = await call(fetchBooks, { releaseYear: 2024, perPage: 'all' })
  if (!data?.books?.length) return redirect('/')

  return (
    <Container belowNav>
      <AntiContainer className="relative pt-16 sm:pt-20 mb-10 sm:mb-20">
        <Image
          src={mobile}
          alt="Top Ten 2024"
          fill
          className="sm:hidden object-cover"
          aria-hidden
        />
        <Image
          src={desktop}
          alt="Top Ten 2024"
          fill
          className="hidden sm:block object-cover"
          aria-hidden
        />
        <div className="flex flex-col gap-6 sm:gap-10 items-center justify-center px-6 relative">
          <Image
            src={logo}
            alt="BAF Top Ten 2024"
            width={282.4}
            height={224}
            className="mobile-only:w-[180px]"
          />
          <p className="max-w-[420px] text-center">
            Support your favourite authors and vote for their books for this
            year&apos;s Top 10 list! Tap to select 3.
          </p>
        </div>
      </AntiContainer>
      <TopTenGrid data-superjson books={data.books} />
    </Container>
  )
}
