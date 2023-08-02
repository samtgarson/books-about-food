import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { ChevronRight } from 'react-feather'
import { AvatarList } from '../profiles/avatar-list'
import { StepCompletionMeta } from './state'

export interface StepProps {
  title: string
  completeTitle?: string
  required?: boolean
  href: string
  complete?: StepCompletionMeta
  disabled?: boolean
}

export const Step: FC<StepProps> = ({
  title,
  completeTitle = title,
  required,
  href,
  complete,
  disabled
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'p-5 flex items-center gap-5',
        complete ? 'bg-sand' : 'bg-white',
        disabled && 'pointer-events-none'
      )}
    >
      <p className="mr-auto">{complete ? completeTitle : title}</p>
      {complete?.text && (
        <p className="bg-white px-2 py-1 rounded-full min-w-[1rem] text-center text-12">
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
