'use client'

import cn from 'classnames'
import {
  Children,
  cloneElement,
  ComponentProps,
  useCallback,
  useRef,
  useState
} from 'react'
import { Minus, Plus } from 'src/components/atoms/icons'
import { useResizeObserver } from 'usehooks-ts'

const CLOSED_HEIGHT = 75

export function MaxHeight({
  children,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & { children: JSX.Element }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [innerHeight, setInnerHeight] = useState<number | null>(null)
  const [maxHeight, setMaxHeight] = useState<number | 'none'>(CLOSED_HEIGHT)

  useResizeObserver({
    ref: innerRef,
    onResize: ({ height }) => {
      setInnerHeight(height || null)
      maxHeight !== CLOSED_HEIGHT && setMaxHeight(height || 'none')
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
        'overflow-y-hidden transition-all duration-150 will-change-contents sm:!max-h-none flex gap-4 items-start',
        !open &&
          !disabled &&
          'mobile-only:[mask-image:linear-gradient(to_top,transparent,white)]',
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
