import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'

export default function Error() {
  return (
    <Container belowNav>
      <PageTitle>That page can&apos;t be found</PageTitle>
      <p>
        Apologies for any inconvenience, please check the link you clicked and
        try again.
      </p>
    </Container>
  )
}
