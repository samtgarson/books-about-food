import { ContactLink } from 'src/components/atoms/contact-link'
import { Input } from 'src/components/form/input'
import { FullBook } from 'src/models/full-book'
import { AuthorSelect } from './author-select'
import { TagSelect } from './tag-select'

export type TitleFormContentProps = Partial<
  Pick<FullBook, 'title' | 'subtitle' | 'authors' | 'tags'>
>
export function TitleFormContent({ book }: { book?: TitleFormContentProps }) {
  return (
    <>
      <Input label="Subtitle" defaultValue={book?.subtitle} name="subtitle" />
      <AuthorSelect authors={book?.authors ?? []} data-superjson />
      <TagSelect value={book?.tags ?? []} />
      <p className="text-14 mb-4">
        Note: If the tag you would like to add isn’t listed, please{' '}
        <ContactLink subject="I need a new tag">get in touch</ContactLink>.
      </p>
    </>
  )
}
