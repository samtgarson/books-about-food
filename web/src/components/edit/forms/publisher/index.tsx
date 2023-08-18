import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { stringify } from 'src/utils/superjson'
import { createAction } from '../action'
import { ContactLink } from 'src/components/atoms/contact-link'

export const EditPublisherForm = async ({ book }: { book: FullBook }) => {
  const options = async (search: string) => {
    'use server'

    const { publishers } = await fetchPublishers.call({ search })
    return stringify(publishers)
  }

  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>Add Publisher</PageBackLink>
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
      <Submit variant="dark">Save and Continue</Submit>
      <p className="text-14 mt-8">
        Note: If the publisher you would like to add isn’t listed, please{' '}
        <ContactLink>get in touch</ContactLink>.
      </p>
    </Form>
  )
}
