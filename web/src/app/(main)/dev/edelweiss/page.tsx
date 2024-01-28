import { edelweissImport } from '@books-about-food/core/services/import/edelweiss/edelweiss-import'
import { redirect } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { parseAppError } from 'src/components/form/utils'
import { parseAndCall } from 'src/utils/service'

export default function Page() {
  return (
    <Container belowNav>
      <PageTitle>Edelweiss Import</PageTitle>
      <Form
        action={async function (data) {
          'use server'
          const res = await parseAndCall(edelweissImport, data)
          if (!res.success) return parseAppError(res.errors)

          redirect(`/edit/${res.data.slug}`)
        }}
      >
        <Input type="url" label="URL" name="url" required />
        <Submit>Import</Submit>
      </Form>
    </Container>
  )
}
