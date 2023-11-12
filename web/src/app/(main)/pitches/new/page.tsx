import { createPitch } from 'core/services/pitches/create-pitch'
import { redirect } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form, FormAction } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { TextArea } from 'src/components/form/textarea'
import { parseAndCall } from 'src/utils/service'

export default function Page() {
  const action: FormAction = async (values) => {
    'use server'

    const { data: pitch } = await parseAndCall(createPitch, values)
    if (pitch) redirect(`/pitches/${pitch.id}`)
  }

  return (
    <Container belowNav centered>
      <Form action={action}>
        <PageBackLink href="/account">New Pitch</PageBackLink>
        <TextArea label="Description" name="description" required />
        <Submit variant="dark">Create pitch</Submit>
      </Form>
    </Container>
  )
}
