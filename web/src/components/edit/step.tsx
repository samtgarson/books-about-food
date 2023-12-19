import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { ChevronRight } from 'src/components/atoms/icons'
import { AvatarList } from '../profiles/avatar-list'
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
      {complete?.text && (
        <p className="text-12 min-w-[1rem] rounded-full bg-white px-2 py-1 text-center">
          {complete.text}
        </p>
      )}
      {complete?.profiles && (
        <AvatarList profiles={complete.profiles} size="3xs" />
      )}
      {disabled ? null : complete ? (
        <p className="underline">Edit</p>
      ) : (
        <>
          {required && <p className="text-14 opacity-50">Required</p>}
          <ChevronRight strokeWidth={1} />
        </>
      )}
    </Link>
  )
}
