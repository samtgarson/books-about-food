import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookList } from 'src/components/books/list'
import { getUser } from 'src/utils/service'

export const metadata: Metadata = {
  title: 'Submissions'
}

export * from 'app/default-static-config'

const Page = async () => {
  const user = await getUser()

  if (!user) return notFound()
  return (
    <BookList
      showCreate
      filters={{
        submitterId: user?.id,
        status: ['draft', 'inReview', 'published']
      }}
    />
  )
}

export default Page
