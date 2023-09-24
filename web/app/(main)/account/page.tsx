import { ContactLink } from 'src/components/atoms/contact-link'
import { Google } from 'src/components/auth/logos'
import { Form, FormAction } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { getUser } from 'src/services/auth/get-user'
import { updateUser } from 'src/services/users/update-user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account'
}

const action: FormAction = async (input) => {
  'use server'
  await updateUser.parseAndCall(input)
}

const Page = async () => {
  const user = await getUser.call()

  if (!user) return null
  return (
    <Form action={action}>
      <h3 className="text-20">Account Details</h3>
      <Input label="Name" name="name" defaultValue={user.name ?? ''} />
      <Input
        label="Email"
        name="email"
        defaultValue={user.email ?? ''}
        disabled
      />
      <div className="text-14 flex items-center gap-4">
        <Google size={18} /> Signed in with Google
      </div>
      <Submit variant="dark">Save</Submit>

      <h3 className="text-20 mt-16">Delete your account</h3>
      <p>
        If you would like to delete your account, please{' '}
        <ContactLink subject="I'd like to delete my BAF account">
          get in touch
        </ContactLink>
        .
      </p>
    </Form>
  )
}

export default Page
