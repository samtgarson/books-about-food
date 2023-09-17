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
      <Fader className="min-h-screen fixed left-0 top-0 flex flex-col justify-stretch">
        <Container className="max-w-3xl flex flex-col gap-4 flex-grow py-16">
          <h1 className="text-32 lg:text-48">
            The cookbook industry&apos;s new digital home.
          </h1>
          <p className="text-32 lg:text-48 opacity-25 mb-16 lg:mb-auto">
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
      <ul className="flex flex-col gap-16 w-96 max-w-[85vw] z-10 ml-auto lg:mr-[5vw] xl:mr-[15vw] pt-[85vh] xl:pt-[15vh] mb-16 pointer-events-none">
        {features.map(({ book }) => (
          <BookItem.Container key={book.id} className="bg-grey" mobileGrid>
            <BookItem.Cover book={book} className="!-mb-px" mobileGrid />
            <div className="-mt-6 sm:mt-0 w-full">
              <div className="w-full border border-black py-4 px-6 -mb-px">
                <span className="font-medium">{book.title}</span>
                <br />
                {book.authorNames}
              </div>
              {!!book.team.length && (
                <div className="w-full border border-black py-4 px-6 -mb-px">
                  The Team
                  <span className="flex flex-wrap gap-2 mt-2">
                    {book.team.map((profile) => (
                      <Avatar key={profile.id} profile={profile} size="xs" />
                    ))}
                  </span>
                </div>
              )}
              {!!book.publisher && (
                <div className="w-full border border-black py-4 px-6">
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
