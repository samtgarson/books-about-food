import { PageTitle } from 'src/components/atoms/page-title'
import { PeopleList } from './list'

export default async () => {
  return (
    <>
      <PageTitle>People</PageTitle>
      <PeopleList />
    </>
  )
}
