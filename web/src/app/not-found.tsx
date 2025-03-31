import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { LogoShape } from 'src/components/icons/logo-shape'

export default function NotFound() {
  return (
    <Container belowNav>
      <LogoShape text className="h-auto w-16" />

      <PageTitle className="!pb-8">That page can&apos;t be found</PageTitle>
      <p>
        Apologies for any inconvenience, please check the link you clicked and
        try again.
      </p>
    </Container>
  )
}
