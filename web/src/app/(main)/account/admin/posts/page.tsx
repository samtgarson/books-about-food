import { notFound } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { Form } from 'src/components/form'
import { FormEditor } from 'src/components/form/editor'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { getSessionUser } from 'src/utils/user'

export default async function Posts() {
  const user = await getSessionUser()
  if (user?.role !== 'admin') notFound()

  return (
    <>
      <AccountHeader title="New Post" />
      <Form>
        <Input label="Title" name="title" />
        <FormEditor className="min-h-40" name="content" label="Content" />
        <Input type="date" name="publishAt" label="Publish At" />
        <Submit>Save and Schedule</Submit>
      </Form>
    </>
  )
}
