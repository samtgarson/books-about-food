import { Claim } from 'database'
import { FC, useCallback, useState } from 'react'
import { ArrowRight, Check, Copy, Loader } from 'react-feather'
import { useFetcher } from 'src/contexts/fetcher'
import { Profile } from 'src/models/profile'
import { Button } from '../atoms/button'
import { Body, Content, Header } from '../atoms/sheet'
import { ProfileItem } from '../profiles/item'
import { useSheet } from './global-sheet'

export type ClaimProfileSheetProps = {
  profile: Profile
}

export const ClaimProfileSheet: FC<ClaimProfileSheetProps> = ({ profile }) => {
  const { closeSheet } = useSheet()
  const {
    isLoading,
    data: claim,
    mutate,
    destroy
  } = useFetcher('claim', { profileId: profile.id }, { authorized: true })
  const [claiming, setClaiming] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [copied, setCopied] = useState(false)

  const createClaim = useCallback(async () => {
    setClaiming(true)
    try {
      await mutate({ profileId: profile.id })
    } finally {
      setClaiming(false)
    }
  }, [mutate, profile.id])

  const copySecret = useCallback(async (claim: Claim) => {
    await navigator.clipboard.writeText(claim.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }, [])

  return (
    <Content authenticated>
      <Body loading={isLoading}>
        <Header title="Claim your profile" />
        <div className="flex flex-col gap-6 items-start">
          {!claim ? (
            <>
              <ProfileItem profile={profile} display="list" className="mb-6" />
              <p>
                If you&apos;re {profile.name}, you can claim this profile to
                manage and promote it.
              </p>
              <p>
                There&apos;s a couple of steps to go through so we know
                it&apos;s you. Click the button below and we&apos;ll let you
                know what&apos;s next.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                disabled={claiming}
                onClick={createClaim}
              >
                {claiming ? (
                  <>
                    Creating Claim...{' '}
                    <Loader className="animate-spin" strokeWidth={1} />
                  </>
                ) : (
                  <>
                    Claim Profile <ArrowRight strokeWidth={1} size={20} />
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <p>
                Nice one! In order for us to verify your identity, please send
                us an Instagram DM on{' '}
                <a
                  href="https://instagram.com/books.about.food"
                  className="font-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  @books.about.food
                </a>{' '}
                with this secret passphrase:
              </p>
              <button
                className="text-20 font-bold py-1.5 px-2.5 bg-grey flex gap-3 items-center"
                title="Copy the passphrase to your clipboard"
                onClick={() => copySecret(claim)}
              >
                {claim.secret}
                {copied ? (
                  <Check strokeWidth={1} size={20} />
                ) : (
                  <Copy strokeWidth={1} size={20} />
                )}
              </button>
              <p>
                Once we get that, we&apos;ll hook up your profile and you can
                start managing it.
              </p>
              <p className="text-14">
                Don&apos;t have Instagram?{' '}
                <a
                  href="mailto:aboutcookbooks@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium"
                >
                  Email us
                </a>{' '}
                and we&apos;ll sort it out.
              </p>
              <button
                className="font-medium text-14 bg-transparent disabled:opacity-50"
                disabled={destroying}
                onClick={async () => {
                  setDestroying(true)
                  await destroy({ claimId: claim.id })
                  closeSheet()
                }}
              >
                {destroying ? (
                  <>
                    Loading...{' '}
                    <Loader className="animate-spin" strokeWidth={1} />
                  </>
                ) : (
                  <>Cancel claim</>
                )}
              </button>
            </>
          )}
        </div>
      </Body>
    </Content>
  )
}
