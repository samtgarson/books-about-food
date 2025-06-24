'use client'

import cn from 'classnames'
import {
  Children,
  cloneElement,
  ComponentProps,
  RefObject,
  useCallback,
  useRef,
  useState,
  type JSX
} from 'react'
import { Minus, Plus } from 'src/components/atoms/icons'
import { useResizeObserver } from 'usehooks-ts'

const CLOSED_HEIGHT = 75

export function MaxHeight({
  children,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & { children: JSX.Element }) {
  const innerRef = useRef<HTMLElement>(undefined)
  const [innerHeight, setInnerHeight] = useState<number | null>(null)
  const [maxHeight, setMaxHeight] = useState<number | 'none'>(CLOSED_HEIGHT)

  useResizeObserver({
    ref: innerRef as RefObject<HTMLDivElement>,
    onResize: ({ height }) => {
      setInnerHeight(height || null)
      if (maxHeight !== CLOSED_HEIGHT) setMaxHeight(height || 'none')
    }
  })

  const toggle = useCallback(() => {
    setMaxHeight((prev) => {
      if (prev !== CLOSED_HEIGHT) return CLOSED_HEIGHT

      return innerRef.current?.scrollHeight || 'none'
    })
  }, [])

  const disabled = innerHeight && innerHeight < CLOSED_HEIGHT + 10
  const open = maxHeight !== CLOSED_HEIGHT
  const Icon = open ? Minus : Plus

  const contentWithRef = cloneElement(Children.only(children), {
    ref: innerRef
  })
  return (
    <div
      className={cn(
        'sm:max-h-none! flex items-start gap-4 overflow-y-hidden transition-all duration-150 will-change-contents',
        !open &&
          !disabled &&
          'max-sm:mask-[linear-gradient(to_top,transparent,white)]',
        className
      )}
      {...props}
      style={{ maxHeight }}
    >
      {contentWithRef}
      {!disabled && (
        <button onClick={toggle} className="sm:hidden">
          <Icon size={24} strokeWidth={1} />
        </button>
      )}
    </div>
  )
}
