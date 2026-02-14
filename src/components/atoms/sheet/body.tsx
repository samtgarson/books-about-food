import cn from 'classnames'
import { Dialog } from 'radix-ui'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'
import { useSheetContext } from './context'

export type SheetType = 'dialog' | 'drawer'
type SheetBodyProps = {
  className?: string
  children?: ReactNode
  containerClassName?: string
  type?: SheetType
}

export type SheetBodyControl = {
  scrollToTop: () => void
}

export const Body = forwardRef<SheetBodyControl, SheetBodyProps>(function Body(
  { className, children = null, containerClassName },
  ref
) {
  const { setScrollState } = useSheetContext()
  const id = useId()
  const scrollRoot = useRef<HTMLDivElement>(null)
  const topDetector = useRef<HTMLDivElement>(null)
  const topId = useMemo(() => `${id}-top`, [id])
  const bottomDetector = useRef<HTMLDivElement>(null)
  const bottomId = useMemo(() => `${id}-bottom`, [id])

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollRoot.current?.scrollTo({ top: 0 })
    }
  }))

  useEffect(() => {
    if (!topDetector.current || !bottomDetector.current) return

    const observer = new IntersectionObserver(
      () => {
        if (!scrollRoot.current) return
        const top = scrollRoot.current?.scrollTop <= 2
        const bottom =
          scrollRoot.current?.scrollTop + 2 >=
          scrollRoot.current?.scrollHeight - scrollRoot.current?.clientHeight
        setScrollState({ top, bottom })
      },
      { root: scrollRoot.current }
    )

    observer.observe(topDetector.current)
    observer.observe(bottomDetector.current)

    return () => observer.disconnect()
  }, [topId, bottomId, setScrollState])

  return (
    <>
      <div
        ref={scrollRoot}
        className={cn(
          'pointer-events-auto isolate flex flex-1 flex-col overflow-auto overflow-x-hidden',
          containerClassName
        )}
      >
        <div ref={topDetector} id={topId} className="h-0.5" />
        <div className={cn('flex flex-1 flex-col', className)}>{children}</div>
        <div ref={bottomDetector} id={bottomId} className="h-0.5" />
      </div>
    </>
  )
})

export const Title = ({
  children,
  className
}: {
  children: string
  className?: string
}) => {
  return (
    <Dialog.Title className={cn('text-18 font-medium sm:text-24', className)}>
      {children}
    </Dialog.Title>
  )
}

export const Footer = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  const { scrollState } = useSheetContext()
  return (
    <div
      className={cn(
        className,
        'z-30 -mx-5 -mt-3 border-t px-5 pt-3 transition-colors sm:-mx-8 sm:-mt-4 sm:px-8 sm:pt-4',
        !scrollState.bottom ? 'border-neutral-grey' : 'border-transparent'
      )}
    >
      {children}
    </div>
  )
}
