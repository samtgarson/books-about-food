'use client'

import cn from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ChevronDown } from 'src/components/atoms/icons'
import { Button } from '../atoms/button'
import { Loader } from '../atoms/loader'
import { ParamLink, ParamLinkParams } from '../atoms/param-link'
import { Pill } from '../atoms/pill'
import * as Sheet from '../atoms/sheet'

type FilterSheetProps = {
  children: ReactNode
  count?: number
  label: string
  loading?: boolean
  params: Omit<ParamLinkParams, 'children'>
  defaultParams: Omit<ParamLinkParams, 'children'>
  className?: string
  onClose?: () => void
}

function FilterSheetContent({
  children,
  count,
  label: labelText,
  loading,
  params,
  defaultParams,
  className
}: FilterSheetProps) {
  const { close } = Sheet.useSheetContext()
  const label = (
    <>
      {labelText}{' '}
      {typeof count !== 'undefined' && count > 0 && (
        <span className="all-caps font-bold leading-none! -my-1 rounded-full bg-black px-1.5 py-1 text-white">
          {count}
        </span>
      )}
    </>
  )
  return (
    <>
      <Sheet.Trigger disabled={loading}>
        <Pill
          className={cn('gap-1.5 transition-opacity', loading && 'opacity-50')}
          disabled={loading}
        >
          {label}
          {loading ? (
            <Loader className="-my-2 -mr-1" />
          ) : (
            <ChevronDown size={24} strokeWidth={1} className="-my-2 -mr-1" />
          )}
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content
        type="drawer"
        title={labelText}
        controls={
          <ParamLink {...defaultParams}>
            <Link
              scroll={false}
              href=""
              className="all-caps bg-transparent"
              onClick={close}
            >
              Reset
            </Link>
          </ParamLink>
        }
      >
        <Sheet.Body className={className} containerClassName="flex-1">
          {children}
        </Sheet.Body>
        <Sheet.Footer>
          <ParamLink {...params}>
            <Button
              onClick={close}
              className="w-full"
              variant="dark"
              scroll={false}
            >
              Save
            </Button>
          </ParamLink>
        </Sheet.Footer>
      </Sheet.Content>
    </>
  )
}

export function FilterSheet({ onClose, ...props }: FilterSheetProps) {
  return (
    <Sheet.Root onClose={onClose}>
      <FilterSheetContent {...props} />
    </Sheet.Root>
  )
}
