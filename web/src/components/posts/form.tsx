import { Post } from '@books-about-food/core/models/post'
import { upsertPost } from '@books-about-food/core/services/posts/upsert-post'
import { dateString } from '@books-about-food/shared/utils/date'
import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'
import { Form } from 'src/components/form'
import { FormEditor } from 'src/components/form/editor'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { parseAppError } from 'src/components/form/utils'
import { parseAndCall } from 'src/utils/service'

export function PostForm({ post }: { post?: Post }) {
  const id = post?.id ?? randomUUID()

  return (
    <Form
      action={async function (data) {
        'use server'

        const result = await parseAndCall(upsertPost, data)
        if (result.success) {
          return redirect(`/admin/posts`)
        }

        return parseAppError(result.errors)
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Input label="Title" name="title" defaultValue={post?.title} />
      <FormEditor
        className="min-h-40"
        name="content"
        label="Content"
        imagePrefix={`posts/${id}`}
        value={post?.content}
      />
      <Input
        type="date"
        name="publishAt"
        label="Publish At"
        defaultValue={post?.publishAtString}
        min={dateString(new Date())}
      />
      <Submit>Save and Schedule</Submit>
    </Form>
  )
}
