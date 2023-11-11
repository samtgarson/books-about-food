import { fetchFeatures } from 'core/services/features/fetch-features'
import { Avatar } from 'src/components/atoms/avatar'
import { Button } from 'src/components/atoms/button'
import { Container } from 'src/components/atoms/container'
import { AuthedButton } from 'src/components/auth/authed-button'
import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import * as BookItem from 'src/components/books/item'
import { ListContainer } from 'src/components/lists/list-context'
import { call, getUser } from 'src/utils/service'
import { Fader } from './fader'
import { WelcomeMessage } from './welcome-message'

export default async function Splash() {
  const { data: features = [] } = await call(fetchFeatures)
  const user = await getUser()

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
            <WelcomeMessage />
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
                emailButtonSibling={
                  <AuthedButton>
                    <Button variant="tertiary">Beta Sign In</Button>
                  </AuthedButton>
                }
              />
            </>
          )}
        </Container>
      </Fader>
      <ul className="pointer-events-none z-10 mb-16 ml-auto flex w-96 max-w-[85vw] flex-col gap-16 pt-[max(85vh,550px)] lg:mr-[5vw] xl:mr-[15vw] xl:pt-[15vh]">
        <ListContainer display="grid">
          {features.map(({ book }) => (
            <BookItem.Container key={book.id} className="bg-grey">
              <BookItem.Cover
                attrs={book.cover?.imageAttrs(200)}
                className="!-mb-px"
              />
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
        </ListContainer>
      </ul>
    </>
  )
}
