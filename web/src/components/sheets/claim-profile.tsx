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
    try {
      const newClaim = await create(profile.id)
      setValue(newClaim)
    } finally {
      setClaiming(false)
      router.refresh()
    }
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
    <Content authenticated={{ action: 'claimProfile' }}>
      <Body loading={loading}>
        <Header title="Claim your profile" />
        <div className="flex flex-col items-start gap-6">
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
                className="text-20 bg-grey flex items-center gap-3 px-2.5 py-1.5 font-bold"
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
                <ContactLink subject="Claim without Instgram">
                  Email us
                </ContactLink>{' '}
                and we&apos;ll sort it out.
              </p>
              <button
                className="text-14 flex gap-2 bg-transparent font-medium disabled:opacity-50"
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
              </button>
            </>
          )}
        </div>
      </Body>
    </Content>
  )
}
