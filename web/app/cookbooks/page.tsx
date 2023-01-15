import { PageTitle } from 'src/components/atoms/page-title'
import { CookbooksList } from './list'

export default async () => {
  return (
    <>
      <PageTitle>Cookbooks</PageTitle>
      <CookbooksList />
    </>
  )
}
