import { redirect } from 'next/navigation'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { callWithUser } from 'src/utils/call-with-user'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { LinksSelect } from './links-select'
import { updateLinks } from 'src/services/books/update-links'

const schema = z.object({
  links: z
    .string()
    .transform(SuperJSON.parse)
    .pipe(updateLinks.input.shape.links)
})

export const EditLinksForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form
      action={async (values) => {
        'use server'

        let links: z.infer<typeof updateLinks.input.shape.links>
        if (values.links == '') {
          links = []
        } else {
          links = schema.parse(values).links
        }

        await callWithUser(updateLinks, {
          slug: book.slug,
          links
        })
        redirect(`/edit/${book.slug}`)
      }}
    >
      <PageBackLink href={`/edit/${book.slug}`}>Add Links</PageBackLink>
      <LinksSelect book={book} data-superjson />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
