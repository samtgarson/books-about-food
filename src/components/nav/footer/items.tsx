import cn from 'classnames'
import Link from 'next/link'

const navItemClassNames = 'text-14'

export function FooterItem({
  children,
  path,
  className
}: {
  children: string
  path: string
  className?: string
}) {
  return (
    <Link href={path} className={cn(className, navItemClassNames)}>
      {children}
    </Link>
  )
}

export function FooterItemExternal({
  children,
  href
}: {
  children: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={navItemClassNames}
    >
      {children}
    </a>
  )
}
