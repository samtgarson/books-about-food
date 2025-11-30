import cn from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Button } from '../atoms/button'

export type HomepageModuleProps = {
  action: { href: string; label: string }
  children?: ReactNode
  title: string
  className?: string
}

export function HomepageModule({
  children,
  action,
  title,
  className
}: HomepageModuleProps) {
  return (
    <section
      className={cn(
        'peer w-full border-black p-8 peer-[&]:border-y lg:w-1/2 lg:border-y lg:p-12 lg:pb-0! lg:peer-[&]:border-l xl:p-16',
        className
      )}
      aria-label={title}
    >
      <h2 className="flex items-center justify-between pb-8 text-24 sm:pb-0 lg:text-32 xl:text-48">
        <span>{title}</span>
        <Link href={action.href} className="hidden lg:block">
          <Button variant="outline">{action.label}</Button>
        </Link>
      </h2>
      {children}
      <Link href={action.href} className="lg:hidden">
        <Button variant="outline" className="w-full">
          {action.label}
        </Button>
      </Link>
    </section>
  )
}
