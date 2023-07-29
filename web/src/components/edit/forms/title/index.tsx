import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'
import { Select } from 'src/components/form/select'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { stringify } from 'src/utils/superjson'

export const EditTitleForm = async ({ book }: { book: FullBook }) => {
  const options = async (search: string) => {
    'use server'

    const { profiles } = await fetchProfiles.call({ search })
    return stringify(profiles)
  }

  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>
        Add Title and Author(s)
      </PageBackLink>
      <Input label="Title" defaultValue={book.title} name="title" required />
      <Input label="Subtitle" defaultValue={book.subtitle} name="subtitle" />
      <Select
        loadOptions={options}
        label="Author(s)"
        name="authorNames"
        valueKey="name"
        render="name"
        defaultValue={book.authors}
        required
        multi
        allowCreate
        data-superjson
      />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
