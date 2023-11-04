import { redirect } from 'next/navigation'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { updateLinks } from 'src/services/books/update-links'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { LinksSelect } from './links-select'

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

        await updateLinks.call({
          slug: book.slug,
          links
        })
        redirect(`/edit/${book.slug}?action=saved`)
      }}
    >
      <PageSubtitle>Links</PageSubtitle>
      <LinksSelect book={book} data-superjson />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
