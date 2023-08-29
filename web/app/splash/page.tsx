import { Container } from 'src/components/atoms/container'
import { Form, FormAction } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { fetchFeatures } from 'src/services/features/fetch-features'
import * as BookItem from 'src/components/books/item'
import { Avatar } from 'src/components/atoms/avatar'
import { Fader } from './fader'
import { z } from 'zod'
import prisma from 'database'

const schema = z.object({
  email: z.string().email()
})

export default async function Splash() {
  const features = await fetchFeatures.call()

  const register: FormAction = async (data) => {
    'use server'
    const result = schema.parse(data)
    await prisma.user.create({
      data: { email: result.email, role: 'waitlist' }
    })
  }

  return (
    <>
      <Fader>
        <Container className="max-w-3xl flex flex-col gap-4 min-h-screen fixed left-0 top-0">
          <h1 className="text-32 lg:text-48 mt-16">
            The cookbook industry&apos;s new digital home.
          </h1>
          <p className="text-32 lg:text-48 opacity-25 mb-16 lg:mb-auto">
            Coming soon.
          </p>
          <p className="lg:text-24">
            Register now to claim your profile and get early access.
          </p>
          <Form
            className="max-w-lg mb-16"
            action={register}
            successMessage="✅ You're on the waitlist! We'll be in touch soon."
          >
            <Input
              label="Email"
              placeholder="author@cookbooks.com"
              name="email"
              type="email"
            />
            <Submit variant="tertiary" className="self-start">
              Register
            </Submit>
          </Form>
        </Container>
      </Fader>
      <ul className="flex flex-col gap-16 w-96 max-w-[85vw] z-10 ml-auto lg:mr-[5vw] xl:mr-[15vw] pt-[85vh] lg:pt-[15vh] mb-16 pointer-events-none">
        {features.map(({ book }) => (
          <BookItem.Container key={book.id} className="bg-grey" mobileGrid>
            <BookItem.Cover book={book} className="!-mb-px" mobileGrid />
            <div className="-mt-6 sm:mt-0 w-full">
              <p className="w-full border border-black py-4 px-6 -mb-px">
                <span className="font-medium">{book.title}</span>
                <br />
                {book.authorNames}
              </p>
              {!!book.team.length && (
                <p className="w-full border border-black py-4 px-6 -mb-px">
                  The Team
                  <span className="flex flex-wrap gap-2 mt-2">
                    {book.team.map((profile) => (
                      <Avatar key={profile.id} profile={profile} size="xs" />
                    ))}
                  </span>
                </p>
              )}
              {!!book.publisher && (
                <p className="w-full border border-black py-4 px-6">
                  Publisher
                  <br />
                  <span className="font-medium">{book.publisher.name}</span>
                </p>
              )}
            </div>
          </BookItem.Container>
        ))}
      </ul>
    </>
  )
}
