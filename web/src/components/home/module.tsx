import { FC, ReactNode } from 'react'
import { Button } from '../atoms/button'
import Link from 'next/link'

export type HomepageModuleProps = {
  action: { href: string; label: string }
  children?: ReactNode
  title: string
}

export const HomepageModule: FC<HomepageModuleProps> = ({
  children,
  action,
  title
}) => (
  <div className="lg:border-y border-black w-full lg:w-1/2 p-8 lg:p-16 peer peer-[&]:lg:border-l peer-[&]:border-y">
    <h2 className="text-24 lg:text-48 pb-0 flex justify-between items-center">
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
