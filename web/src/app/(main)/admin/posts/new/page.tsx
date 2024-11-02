import { upsertPost } from '@books-about-food/core/services/posts/upsert-post'
import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'
import { AccountHeader } from 'src/components/accounts/header'
import { Form } from 'src/components/form'
import { FormEditor } from 'src/components/form/editor'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { parseAppError } from 'src/components/form/utils'
import { parseAndCall } from 'src/utils/service'

export default async function Posts() {
  const id = randomUUID()

  return (
    <>
      <AccountHeader title="New Post" />
      <Form
        action={async function (data) {
          'use server'

          const result = await parseAndCall(upsertPost, data)
          if (result.success) {
            return redirect(`/account/admin/posts/${result.data.id}`)
          }

          return parseAppError(result.errors)
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Input label="Title" name="title" />
        <FormEditor
          className="min-h-40"
          name="content"
          label="Content"
          imagePrefix={`posts/${id}`}
        />
        <Input type="date" name="publishAt" label="Publish At" />
        <Submit>Save and Schedule</Submit>
      </Form>
    </>
  )
}
