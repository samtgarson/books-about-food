'use client'
import { Profile } from '@books-about-food/core/models/profile'
import { Claim } from '@books-about-food/database'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Copy } from 'src/components/atoms/icons'
import { usePromise } from 'src/hooks/use-promise'
import { Button } from '../atoms/button'
import { ContactLink } from '../atoms/contact-link'
import { Loader } from '../atoms/loader'
import { Body, Content } from '../atoms/sheet'
import { create, destroy, fetch } from '../profiles/claim-button/action'
import { ProfileItem } from '../profiles/item'
import { successToast } from '../utils/toaster'
import { useSheet } from './global-sheet'
import { SheetComponent } from './types'

export type ClaimProfileSheetProps = {
  profile: Profile
}

const ClaimProfileSheet: SheetComponent<ClaimProfileSheetProps> = ({
  profile
}) => {
  const router = useRouter()
  const { closeSheet } = useSheet()
  const {
    loading,
    value: claim,
    setValue
  } = usePromise(() => fetch(profile.id), null, [profile.id])
  const [claiming, setClaiming] = useState(false)
  const [destroying, setDestroying] = useState(false)

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
    successToast('Code copied to your clipboard')
  }, [])

  return (
    <Content
      authenticated={{ action: 'claimProfile' }}
      loading={loading}
      title="Claim your profile"
    >
      <Body>
        <div className="flex flex-col items-start gap-8">
          {!claim ? (
            <>
              <p>
                By claiming your profile you’ll be able to: secure your name,
                edit your details, submit cookbooks and hide information you’re
                not keen to have shown on your profile.
              </p>
              <p>
                To verify that you’re {profile.name}, there’s a couple of steps
                to go through. Click below to continue.
              </p>
              <ProfileItem
                profile={profile}
                display="list"
                className="w-full border-grey bg-grey"
              />
              <Button
                variant="dark"
                className="w-full"
                disabled={claiming}
                onClick={createClaim}
              >
                {claiming ? (
                  <>
                    <Loader />
                    Creating Claim...
                  </>
                ) : (
                  <>Continue to claim your profile</>
                )}
              </Button>
            </>
          ) : (
            <>
              <p>
                Nice one! In order for us to verify your identity, please send
                us an Instagram direct message on{' '}
                <a
                  href="https://instagram.com/booksabout.food"
                  className="font-medium underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  @booksabout.food
                </a>{' '}
                with the three randomly generated words you see below:
              </p>
              <button
                className="relative flex w-full items-center justify-center bg-grey px-4 py-5 font-mono text-20 uppercase"
                title="Copy the passphrase to your clipboard"
                onClick={() => copySecret(claim)}
              >
                {claim.secret}
                <Copy strokeWidth={1} size={20} className="absolute right-4" />
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
                with the randomly generated words and we&apos;ll sort it out
                that way.
              </p>
              <div className="flex w-full flex-col gap-2">
                <Button className="w-full" onClick={closeSheet} variant="dark">
                  Close
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
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

export default ClaimProfileSheet
