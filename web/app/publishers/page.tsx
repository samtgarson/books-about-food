import { PageTitle } from 'src/components/atoms/page-title'
import { PublishersList } from './list'

export default async () => {
  return (
    <>
      <PageTitle>Publishers</PageTitle>
      <PublishersList />
    </>
  )
}
