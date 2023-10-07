'use client'
import { Claim } from 'database'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { ArrowRight, Check, Copy } from 'react-feather'
import { usePromise } from 'src/hooks/use-promise'
import { Profile } from 'src/models/profile'
import { Button } from '../atoms/button'
import { ContactLink } from '../atoms/contact-link'
import { Loader } from '../atoms/loader'
import { Body, Content, Header } from '../atoms/sheet'
import { create, destroy, fetch } from '../profiles/claim-button/action'
import { ProfileItem } from '../profiles/item'
import { useSheet } from './global-sheet'

export type ClaimProfileSheetProps = {
  profile: Profile
}

export const ClaimProfileSheet: FC<ClaimProfileSheetProps> = ({ profile }) => {
  const router = useRouter()
  const { closeSheet } = useSheet()
  const {
    loading,
    value: claim,
    setValue
  } = usePromise(() => fetch(profile.id), null, [profile.id])
  const [claiming, setClaiming] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [copied, setCopied] = useState(false)

  const createClaim = useCallback(async () => {
    setClaiming(true)
    const newClaim = await create(profile.id)
    if (newClaim) setValue(newClaim)
    setClaiming(false)
    router.refresh()
  }, [profile.id, setValue, router])

  const destroyClaim = useCallback(async () => {
    if (!claim) return
    setDestroying(true)
    await destroy(claim.id)
    router.refresh()
    closeSheet()
  }, [claim, closeSheet, router])

  const copySecret = useCallback(async (claim: Claim) => {
    await navigator.clipboard.writeText(claim.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }, [])

  return (
    <Content
      authenticated={{ action: 'claimProfile' }}
      size={claim ? 'lg' : 'md'}
    >
      <Body loading={loading}>
        <Header title="Claim your profile" />
        <div className="flex flex-col items-start gap-8">
          {!claim ? (
            <>
              <p>
                By claiming your profile you’ll be able to: secure your name,
                edit your details, submit cookbooks and hide information you’re
                not keen to have shown on your profile.
              </p>
              <ProfileItem
                profile={profile}
                display="list"
                className="w-full"
              />
              <p>
                If you’re {profile.name}, there&apos;s a couple of steps to go
                through so we are able to verify it’s really you. Click below to
                continue.
              </p>
              <Button
                variant="secondary"
                disabled={claiming}
                onClick={createClaim}
              >
                {claiming ? (
                  <>
                    <Loader />
                    Creating Claim...
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
                us an Instagram direct message on{' '}
                <a
                  href="https://instagram.com/books.about.food"
                  className="font-medium underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  @books.about.food
                </a>{' '}
                with the three randomly generated words you see below:
              </p>
              <button
                className="text-20 border border-black font-mono justify-center flex relative items-center px-4 py-5 uppercase w-full"
                title="Copy the passphrase to your clipboard"
                onClick={() => copySecret(claim)}
              >
                {claim.secret}
                {copied ? (
                  <Check
                    strokeWidth={1}
                    size={20}
                    className="absolute right-4"
                  />
                ) : (
                  <Copy
                    strokeWidth={1}
                    size={20}
                    className="absolute right-4"
                  />
                )}
              </button>
              <p>
                Once we receive them, we&apos;ll verify hook up your profile and
                you can start managing it.
              </p>
              <p>
                Don&apos;t have Instagram?{' '}
                <ContactLink subject="Claim without Instgram">
                  Email us
                </ContactLink>{' '}
                and we&apos;ll sort it out that way.
              </p>
              <div className="flex flex-col gap-4 w-full">
                <Button
                  className="w-full"
                  onClick={closeSheet}
                  variant="tertiary"
                >
                  Close
                </Button>

                <Button
                  className="w-full"
                  disabled={destroying}
                  onClick={destroyClaim}
                >
                  {destroying ? (
                    <>
                      <Loader />
                      Loading...
                    </>
                  ) : (
                    <>Cancel claim</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Body>
    </Content>
  )
}
