import { BookList } from 'src/components/books/list'
import { getUser } from 'src/services/auth/get-user'

export * from 'app/default-static-config'

const Page = async () => {
  const user = await getUser.call()

  if (!user) return null
  return (
    <BookList showCreate filters={{ status: 'draft', submitterId: user.id }} />
  )
}

export default Page
