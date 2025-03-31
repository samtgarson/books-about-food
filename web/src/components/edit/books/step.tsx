import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { ChevronRight } from 'src/components/atoms/icons'
import { AvatarList } from 'src/components/profiles/avatar-list'
import { StepCompletionMeta } from './state'

export interface StepProps {
  title: string
  required?: boolean
  href: string
  complete?: StepCompletionMeta
  disabled?: boolean
}

export const Step: FC<StepProps> = ({
  title,
  required,
  href,
  complete,
  disabled
}) => {
  if (disabled && !complete) return null
  const { profiles, overflow } = getProfiles(complete?.profiles)
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-5 p-5',
        complete ? 'bg-sand' : 'bg-white',
        disabled && 'pointer-events-none'
      )}
    >
      <p className="mr-auto">{title}</p>
      <div className="flex">
        {profiles && (
          <AvatarList
            profiles={profiles}
            size="3xs"
            className={cn(overflow && '-mr-1')}
          />
        )}
        {(complete?.text || overflow) && (
          <p className="z-10 h-6 min-w-6 rounded-full bg-white px-2 py-1 text-center text-12 leading-[1.2rem]">
            {complete?.text || overflow}
          </p>
        )}
      </div>
      {disabled ? null : complete ? (
        <p className="underline">Edit</p>
      ) : (
        <>
          {required && <p className="text-14 opacity-50">Required</p>}
          <ChevronRight strokeWidth={1} className="shrink-0" />
        </>
      )}
    </Link>
  )
}

function getProfiles(profiles: Profile[] | undefined) {
  if (!profiles?.length) return {}

  const toDisplay = profiles?.slice(0, 4)
  const overflow = profiles.length - toDisplay.length

  return {
    profiles: toDisplay,
    overflow: overflow > 0 && `+${overflow}`
  }
}
