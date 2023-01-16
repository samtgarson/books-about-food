import { PageTitle } from 'src/components/atoms/page-title'
import { Container } from 'src/components/atoms/container'
import { BookList } from 'src/components/books/list'

export default async () => {
  return (
    <>
      <PageTitle>Cookbooks</PageTitle>
      <Container>
        <BookList />
      </Container>
    </>
  )
}
