import { FullBook } from '@books-about-food/core/models/full-book'
import { updateContributors } from '@books-about-food/core/services/books/update-contributors'
import { revalidatePath } from 'next/cache'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Submit } from 'src/components/form/submit'
import { call } from 'src/utils/service'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { EditForm } from '../form'
import { TeamSelect } from './team-select'
import { Wrap } from 'src/components/utils/wrap'

const schema = z.object({
  contributors: z
    .string()
    .transform(SuperJSON.parse)
    .pipe(updateContributors.input.shape.contributors)
})

export const EditTeamForm = async ({ book }: { book: FullBook }) => {
  return (
    <EditForm
      action={async (values) => {
        'use server'

        const { contributors } = schema.parse(values)

        const { success } = await call(updateContributors, {
          slug: book.slug,
          contributors
        })
        if (success) revalidatePath(`/edit/${book.slug}`)
        return success
      }}
    >
      <PageSubtitle>Team</PageSubtitle>
      <p>Please add at least one person who worked on this project.</p>
      <Wrap c={TeamSelect} book={book} />
      <Submit>Save and Continue</Submit>
    </EditForm>
  )
}
