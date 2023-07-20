import { redirect } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { TextArea } from 'src/components/form/textarea'
import { getUser } from 'src/services/auth/get-user'
import { createPitch } from 'src/services/pitches/create-pitch'

export default function Page() {
  const action = async (data: FormData) => {
    'use server'

    const values = Object.fromEntries(data.entries())
    const user = await getUser.call()
    if (!user) redirect('auth/sign-in')

    const pitch = await createPitch.parseAndCall(values, user)
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
