import cn from 'classnames'
import {
  cloneElement,
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { containerClasses, ContainerProps } from './container'

type CarouselAlginment = 'left' | 'center'
type CarouselContext = {
  currentIndex: number
  totalItems: number
  setCurrentIndex: (index: number) => void
  scrollTo(index: number): void
  scrollerRef: RefObject<HTMLUListElement>
  alignment: CarouselAlginment
  canGoLeft: boolean
  canGoRight: boolean
  setCanGoLeft: (canGoLeft: boolean) => void
  setCanGoRight: (canGoRight: boolean) => void
}

const CarouselContext = createContext({} as CarouselContext)

export type CarouselRootProps = {
  children: ReactNode
  alignment?: CarouselAlginment
  totalItems: number
}

const getCurrentIndex = (
  el: HTMLElement | null,
  alignment: CarouselAlginment
) => {
  if (!el) return
  const parent = el.parentElement
  if (!parent) return
  const rect = parent.getBoundingClientRect()

  let x: number
  if (alignment === 'left') {
    const styleMap = getComputedStyle(el)
    const padding = parseInt(styleMap.getPropertyValue('padding-left'))
    x = rect.left + padding
  } else {
    x = rect.left + rect.width / 2
  }

  const y = rect.top + rect.height / 2
  const elAtPoint = document.elementFromPoint(x, y)?.closest('li')

  if (!elAtPoint || !elAtPoint.parentElement) return
  return Array.from(elAtPoint.parentElement.children).indexOf(elAtPoint)
}

export const Root = ({
  alignment = 'center',
  totalItems,
  children
}: CarouselRootProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canGoLeft, setCanGoLeft] = useState(false)
  const [canGoRight, setCanGoRight] = useState(true)

  const scrollTo = useCallback(
    (index: number) => {
      if (!scrollerRef.current) return
      const item = scrollerRef.current.children[index] as HTMLElement
      const itemLeft = item.offsetLeft
      const wrapperWidth = scrollerRef.current.parentElement
        ?.clientWidth as number
      const left =
        alignment === 'left'
          ? itemLeft
          : itemLeft + wrapperWidth / 2 - item.offsetWidth / 2
      scrollerRef.current.scrollTo({ left, behavior: 'smooth' })
    },
    [alignment]
  )

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        totalItems,
        scrollTo,
        scrollerRef,
        alignment,
        canGoLeft,
        canGoRight,
        setCanGoLeft,
        setCanGoRight
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export interface CarouselScrollerProps
  extends Omit<ComponentProps<'ul'>, 'children'> {
  children: ReactNode
  padded?: boolean
  containerProps?: ContainerProps
}

export const Scroller = ({
  children,
  className,
  padded,
  containerProps,
  ...props
}: CarouselScrollerProps) => {
  const {
    scrollerRef,
    setCurrentIndex,
    alignment,
    setCanGoRight,
    setCanGoLeft
  } = useContext(CarouselContext)
  const timer = useRef<number>()
  const onScrollEnd = useCallback(() => {
    if (!scrollerRef.current) return
    const scroller = scrollerRef.current
    const currentIndex = getCurrentIndex(scroller, alignment)
    if (typeof currentIndex !== 'undefined') setCurrentIndex(currentIndex)

    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    setCanGoLeft(scroller.scrollLeft > 0)
    setCanGoRight(scroller.scrollLeft < maxScroll)
  }, [alignment, setCurrentIndex, scrollerRef, setCanGoLeft, setCanGoRight])
  return (
    <ul
      ref={scrollerRef}
      className={cn(
        'relative flex overflow-y-hidden overflow-x-auto snap-x snap-mandatory whitespace-nowrap items-center scrollbar-hidden justify-start pb-16',
        className,
        padded &&
          cn(
            containerClasses(containerProps),
            containerClasses({ ...containerProps, scroll: true })
          )
      )}
      onScroll={() => {
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(onScrollEnd, 100)
      }}
      {...props}
    >
      {children}
    </ul>
  )
}

export type CarouselItemProps = {
  index: number
  children: JSX.Element
  onClick?: (e: MouseEvent) => void
  className?: string
}

export const Item: FC<CarouselItemProps> = ({
  children,
  onClick,
  index,
  className
}) => {
  const { scrollTo, alignment } = useContext(CarouselContext)

  return cloneElement(children, {
    className: cn(
      'flex-none w-max',
      children.props.className,
      alignment === 'center' && 'snap-center',
      alignment === 'left' && 'snap-start',
      className
    ),
    onClick(e: MouseEvent) {
      scrollTo(index)
      onClick?.(e)
    }
  })
}

export const Buttons: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { currentIndex, totalItems, scrollTo, canGoLeft, canGoRight } =
    useContext(CarouselContext)

  return (
    <div className={cn('hidden md:flex', className)} {...props}>
      <button
        className="w-14 h-14 border border-black bg-white flex items-center justify-center -mr-px group"
        onClick={() => scrollTo(currentIndex - 1)}
        disabled={currentIndex === 0 || !canGoLeft}
      >
        <ChevronLeft className="group-disabled:opacity-50 transition-opacity" />
      </button>
      <button
        className="w-14 h-14 border border-black bg-white flex items-center justify-center group"
        onClick={() => scrollTo(currentIndex + 1)}
        disabled={currentIndex === totalItems - 1 || !canGoRight}
      >
        <ChevronRight className="group-disabled:opacity-50 transition-opacity" />
      </button>
    </div>
  )
}
