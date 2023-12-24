import { FullBook } from '@books-about-food/core/models/full-book'
import { updateLinks } from '@books-about-food/core/services/books/update-links'
import { revalidatePath } from 'next/cache'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Submit } from 'src/components/form/submit'
import { call } from 'src/utils/service'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { EditForm } from '../form'
import { LinksSelect } from './links-select'

const schema = z.object({
  links: z
    .string()
    .transform(SuperJSON.parse)
    .pipe(updateLinks.input.shape.links)
})

export const EditLinksForm = async ({ book }: { book: FullBook }) => {
  return (
    <EditForm
      action={async (values) => {
        'use server'

        let links: z.infer<typeof updateLinks.input.shape.links>
        if (values.links == '') {
          links = []
        } else {
          links = schema.parse(values).links
        }

        const { success } = await call(updateLinks, {
          slug: book.slug,
          links
        })

        if (success) revalidatePath(`/edit/${book.slug}`)
        return success
      }}
    >
      <PageSubtitle>Links</PageSubtitle>
      <LinksSelect book={book} data-superjson />
      <Submit variant="dark">Save and Continue</Submit>
    </EditForm>
  )
}
