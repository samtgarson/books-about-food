import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { PageProps } from 'src/components/types'
import { genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'
import { fetchVotes } from './actions'
import { TopTenGrid } from './grid'
import logo from './logo.svg'
import desktop from './top-ten-desktop.svg'
import mobile from './top-ten-mobile.svg'
import { Wrap } from 'src/components/utils/wrap'

export const metadata = genMetadata('/top-ten/2024', null, {
  title: "2024's Top Ten",
  description:
    'Support your favourite chefs and vote for the best books about food from 2024.',
  robots: {
    index: false,
    follow: false
  }
})

export default async function TopTen2024(props: PageProps) {
  const searchParams = await props.searchParams
  const autoSubmit = searchParams.submit === 'true'

  return (
    <Container belowNav>
      <AntiContainer className="relative pt-14 sm:pt-20 mb-10 sm:mb-20">
        <Image
          src={mobile}
          alt="Top Ten 2024"
          fill
          className="sm:hidden object-cover"
          aria-hidden
          priority
        />
        <Image
          src={desktop}
          alt="Top Ten 2024"
          fill
          className="hidden sm:block object-cover"
          aria-hidden
          priority
        />
        <div className="flex flex-col gap-6 sm:gap-10 items-center justify-center px-6 relative">
          <Image
            src={logo}
            alt="BAF Top Ten 2024"
            width={282.4}
            height={224}
            className="mobile-only:w-[160px]"
          />
          <p className="max-w-[420px] text-center">
            Support your favourite authors and vote for their books for this
            year&apos;s Top 10 list! Tap to select 3.
          </p>
        </div>
      </AntiContainer>
      <Content autoSubmit={autoSubmit} />
    </Container>
  )
}

async function Content({ autoSubmit }: { autoSubmit?: boolean }) {
  const [{ data }, votes] = await Promise.all([
    call(fetchBooks, {
      perPage: 'all',
      sort: 'random',
      tags: 'top-ten-2024'
    }),
    fetchVotes()
  ])
  if (!data?.books.length) return redirect('/')

  return (
    <Wrap c={TopTenGrid}
      books={data.books}
      existingVotes={votes}
      autoSubmit={autoSubmit}
    />
  )
}
