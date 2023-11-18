import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import { ReactNode, useEffect, useId, useMemo, useRef } from 'react'
import { Loader } from 'react-feather'
import { useSheetContext } from './context'

export const Body = ({
  className,
  loading,
  children = null,
  title,
  controls,
  containerClassName
}: {
  className?: string
  loading?: boolean
  children?: ReactNode
  title?: string
  controls?: ReactNode
  containerClassName?: string
}) => {
  const { grey, setScrollState } = useSheetContext()
  const id = useId()
  const scrollRoot = useRef<HTMLDivElement>(null)
  const topDetector = useRef<HTMLDivElement>(null)
  const topId = useMemo(() => `${id}-top`, [id])
  const bottomDetector = useRef<HTMLDivElement>(null)
  const bottomId = useMemo(() => `${id}-bottom`, [id])

  useEffect(() => {
    if (!topDetector.current || !bottomDetector.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const top = !!entries.find((e) => e.target.id === topId)?.isIntersecting
        const bottom = !!entries.find((e) => e.target.id === bottomId)
          ?.isIntersecting
        setScrollState({ top, bottom })
      },
      {
        root: scrollRoot.current,
        threshold: [0.5],
        rootMargin: '20px 0px 20px'
      }
    )

    observer.observe(topDetector.current)
    observer.observe(bottomDetector.current)

    return () => observer.disconnect()
  }, [topId, bottomId, setScrollState])

  return (
    <>
      {title && <Header title={title}>{controls}</Header>}
      <div
        ref={scrollRoot}
        className={cn(
          'pointer-events-auto max-h-[calc(80vh-180px)] overflow-auto p-5 sm:p-8 isolate',
          grey ? 'bg-grey' : 'bg-white',
          containerClassName
        )}
      >
        <div ref={topDetector} id={topId} className="h-px" />
        {loading ? <Loader /> : <div className={className}>{children}</div>}
        <div ref={bottomDetector} id={bottomId} className="h-px" />
      </div>
    </>
  )
}

const Header = ({
  children,
  title
}: {
  className?: string
  children?: ReactNode
  title: string
}) => {
  const { grey, scrollState } = useSheetContext()
  return (
    <div
      className={cn(
        'flex justify-between px-5 pt-5 pb-3 sm:px-8 sm:pt-8 sm:pb-4 z-30 -mb-5 sm:-mb-8 border-b transition-colors',
        grey ? 'bg-grey' : 'bg-white',
        !scrollState.top ? 'border-neutral-grey' : 'border-transparent'
      )}
    >
      <Dialog.Title className="text-18 sm:text-24 font-medium">
        {title}
      </Dialog.Title>
      {children}
    </div>
  )
}

export const Footer = ({ children }: { children: ReactNode }) => {
  const { grey, scrollState } = useSheetContext()
  return (
    <div
      className={cn(
        'bg-white p-5 sm:p-8 -mt-5 sm:-mt-8 z-30 border-t transition-colors',
        grey ? 'bg-grey' : 'bg-white',
        !scrollState.bottom ? 'border-neutral-grey' : 'border-transparent'
      )}
    >
      {children}
    </div>
  )
}