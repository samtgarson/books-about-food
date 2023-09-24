import { Container } from 'src/components/atoms/container'
import { fetchFeatures } from 'src/services/features/fetch-features'
import * as BookItem from 'src/components/books/item'
import { Avatar } from 'src/components/atoms/avatar'
import { Fader } from './fader'
import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import { getUser } from 'src/services/auth/get-user'

export default async function Splash() {
  const features = await fetchFeatures.call()
  const user = await getUser.call()

  return (
    <>
      <Fader className="fixed left-0 top-0 flex min-h-screen flex-col justify-stretch">
        <Container className="flex max-w-3xl flex-grow flex-col gap-4 py-16">
          <h1 className="text-32 lg:text-48">
            The cookbook industry&apos;s new digital home.
          </h1>
          <p className="text-32 lg:text-48 mb-16 opacity-25 lg:mb-auto">
            Coming soon.
          </p>
          {user ? (
            <p className="lg:text-24">
              Thanks for registering! We&apos;ll be in touch soon.
            </p>
          ) : (
            <>
              <p className="lg:text-24">
                Register now to claim your profile and get early access.
              </p>
              <SignInButtons
                google={false}
                successMessage="Thanks, we'll be in touch! Check your email to complete your
          registration."
                emailButtonLabel="Register"
                callbackUrl="/"
              />
            </>
          )}
        </Container>
      </Fader>
      <ul className="pointer-events-none z-10 mb-16 ml-auto flex w-96 max-w-[85vw] flex-col gap-16 pt-[max(85vh,550px)] lg:mr-[5vw] xl:mr-[15vw] xl:pt-[15vh]">
        {features.map(({ book }) => (
          <BookItem.Container key={book.id} className="bg-grey" mobileGrid>
            <BookItem.Cover book={book} className="!-mb-px" mobileGrid />
            <div className="-mt-6 w-full sm:mt-0">
              <div className="-mb-px w-full border border-black px-6 py-4">
                <span className="font-medium">{book.title}</span>
                <br />
                {book.authorNames}
              </div>
              {!!book.team.length && (
                <div className="-mb-px w-full border border-black px-6 py-4">
                  The Team
                  <span className="mt-2 flex flex-wrap gap-2">
                    {book.team.map((profile) => (
                      <Avatar key={profile.id} profile={profile} size="xs" />
                    ))}
                  </span>
                </div>
              )}
              {!!book.publisher && (
                <div className="w-full border border-black px-6 py-4">
                  Publisher
                  <br />
                  <span className="font-medium">{book.publisher.name}</span>
                </div>
              )}
            </div>
          </BookItem.Container>
        ))}
      </ul>
    </>
  )
}
