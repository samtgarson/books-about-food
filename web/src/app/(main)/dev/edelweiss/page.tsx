import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { EdelweissImportForm } from 'src/components/books/edelweiss-import'

export default function Page() {
  return (
    <Container belowNav>
      <PageTitle>Edelweiss Import</PageTitle>
      <EdelweissImportForm />
    </Container>
  )
}
