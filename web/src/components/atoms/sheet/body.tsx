import * as Dialog from '@radix-ui/react-dialog'
import cn from 'classnames'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'
import { Loader } from 'src/components/atoms/icons'
import { useSheetContext } from './context'

type SheetBodyProps = {
  className?: string
  loading?: boolean
  children?: ReactNode
  title?: string
  controls?: ReactNode
  containerClassName?: string
}

export type SheetBodyControl = {
  scrollToTop: () => void
}

export const Body = forwardRef<SheetBodyControl, SheetBodyProps>(function Body(
  { className, loading, children = null, title, controls, containerClassName },
  ref
) {
  const { grey, setScrollState } = useSheetContext()
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
      {title && <Header title={title}>{controls}</Header>}
      <div
        ref={scrollRoot}
        className={cn(
          'pointer-events-auto overflow-auto p-5 sm:p-8 isolate',
          grey ? 'bg-grey' : 'bg-white',
          containerClassName
        )}
      >
        <div ref={topDetector} id={topId} className="h-0.5" />
        {loading ? <Loader /> : <div className={className}>{children}</div>}
        <div ref={bottomDetector} id={bottomId} className="h-0.5" />
      </div>
    </>
  )
})

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
