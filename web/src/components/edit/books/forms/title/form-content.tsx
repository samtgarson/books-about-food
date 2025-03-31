import { FullBook } from '@books-about-food/core/models/full-book'
import { ContactLink } from 'src/components/atoms/contact-link'
import { Input } from 'src/components/form/input'
import { ProfileSelect } from 'src/components/form/profile-select'
import { Wrap } from 'src/components/utils/wrap'
import { TagSelect } from './tag-select'

export type TitleFormContentProps = Partial<
  Pick<FullBook, 'title' | 'subtitle' | 'authors' | 'tags'>
>
export function TitleFormContent({ book }: { book?: TitleFormContentProps }) {
  return (
    <>
      <Input label="Subtitle" defaultValue={book?.subtitle} name="subtitle" />
      <Wrap
        c={ProfileSelect}
        multi={true}
        value={book?.authors ?? []}
        label="Author(s)"
        name="authorIds"
      />
      <TagSelect value={book?.tags ?? []} />
      <p className="mb-4 text-14">
        Note: If the tag you would like to add isn’t listed, please{' '}
        <ContactLink subject="I need a new tag">get in touch</ContactLink>.
      </p>
    </>
  )
}
