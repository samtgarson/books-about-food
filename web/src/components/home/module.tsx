import { FC, ReactNode } from 'react'
import { Button } from '../atoms/button'
import Link from 'next/link'
import cn from 'classnames'

export type HomepageModuleProps = {
  action: { href: string; label: string }
  children?: ReactNode
  title: string
  className?: string
}

export const HomepageModule: FC<HomepageModuleProps> = ({
  children,
  action,
  title,
  className
}) => (
  <div
    className={cn(
      'lg:border-y border-black w-full lg:w-1/2 p-8 lg:p-12 xl:p-16 peer peer-[&]:lg:border-l peer-[&]:border-y',
      className
    )}
  >
    <h2 className="text-24 lg:text-32 xl:text-48 pb-0 flex justify-between items-center">
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
  </div>
)
