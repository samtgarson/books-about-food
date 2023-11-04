import { redirect } from 'next/navigation'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { updateContributors } from 'src/services/books/update-contributors'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { TeamSelect } from './team-select'

const schema = z.object({
  contributors: z
    .string()
    .transform(SuperJSON.parse)
    .pipe(updateContributors.input.shape.contributors)
})

export const EditTeamForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form
      action={async (values) => {
        'use server'

        const { contributors } = schema.parse(values)

        await updateContributors.call({
          slug: book.slug,
          contributors
        })
        redirect(`/edit/${book.slug}?action=saved`)
      }}
    >
      <PageSubtitle>Team</PageSubtitle>
      <p>Please add at least one person who worked on this project.</p>
      <TeamSelect book={book} data-superjson />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
