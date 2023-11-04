import { ContactLink } from 'src/components/atoms/contact-link'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'
import { AuthorSelect } from './author-select'
import { TagSelect } from './tag-select'

export const EditTitleForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageSubtitle>General Information</PageSubtitle>
      <Input label="Title" defaultValue={book.title} name="title" required />
      <Input label="Subtitle" defaultValue={book.subtitle} name="subtitle" />
      <AuthorSelect authors={book.authors} data-superjson />
      <TagSelect value={book.tags} />
      <Submit variant="dark">Save and Continue</Submit>
      <p className="text-14 mt-8">
        Note: If the tag you would like to add isn’t listed, please{' '}
        <ContactLink subject="I need a new tag">get in touch</ContactLink>.
      </p>
    </Form>
  )
}
