import { PageTitle } from 'src/components/atoms/page-title'
import { AuthorsList } from './list'

export default async () => {
  return (
    <>
      <PageTitle>Authors</PageTitle>
      <AuthorsList />
    </>
  )
}
