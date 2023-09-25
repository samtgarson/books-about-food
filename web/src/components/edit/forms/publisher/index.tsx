import { ContactLink } from 'src/components/atoms/contact-link'
import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { stringify } from 'src/utils/superjson'
import { createAction } from '../action'

export const EditPublisherForm = async ({ book }: { book: FullBook }) => {
  const options = async (search: string) => {
    'use server'

    const { data } = await fetchPublishers.call({ search })
    if (!data) return stringify([])

    return stringify(data.publishers)
  }

  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>
        Publishing Information
      </PageBackLink>
      <Select
        loadOptions={options}
        label="Publisher"
        name="publisherId"
        valueKey="id"
        render="name"
        defaultValue={book.publisher}
        required
        data-superjson
      />
      <Input
        label="Release Date"
        defaultValue={book.releaseDate?.toISOString().split('T')[0]}
        name="releaseDate"
        type="date"
      />
      <Input
        label="No. of Pages"
        defaultValue={book.pages}
        name="pages"
        type="number"
        min={0}
      />
      <Submit variant="dark">Save and Continue</Submit>
      <p className="text-14 mt-8">
        Note: If the publisher you would like to add isn’t listed, please{' '}
        <ContactLink subject="I need a new publisher">get in touch</ContactLink>
        .
      </p>
    </Form>
  )
}
