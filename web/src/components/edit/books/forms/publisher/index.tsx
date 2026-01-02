import { ContactLink } from 'src/components/atoms/contact-link'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Input } from 'src/components/form/input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { Wrap } from 'src/components/utils/wrap'
import { FullBook } from 'src/core/models/full-book'
import { Publisher } from 'src/core/models/publisher'
import { fetchPublishers } from 'src/core/services/publishers/fetch-publishers'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'
import { createAction } from '../action'
import { EditForm } from '../form'

const PublisherSelect = Select<Publisher, false, 'id'>

export const EditPublisherForm = async ({ book }: { book: FullBook }) => {
  const options = async (search: string) => {
    'use server'

    const { data } = await call(fetchPublishers, { search })
    if (!data) return stringify([])

    return stringify(data.publishers)
  }

  return (
    <EditForm action={createAction(book.slug)}>
      <PageSubtitle>Publishing Information</PageSubtitle>
      <Wrap
        c={PublisherSelect}
        multi={false}
        loadOptions={options}
        label="Publisher"
        name="publisherId"
        placeholder="Select a publisher"
        valueKey="id"
        render="name"
        defaultValue={book.publisher}
        required
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
      <Submit>Save and Continue</Submit>
      <p className="mt-8 text-14">
        Note: If the publisher you would like to add isn’t listed, please{' '}
        <ContactLink subject="I need a new publisher">get in touch</ContactLink>
        .
      </p>
    </EditForm>
  )
}
