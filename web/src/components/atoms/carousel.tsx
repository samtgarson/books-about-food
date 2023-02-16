/* eslint-disable @typescript-eslint/no-explicit-any */

import cn from 'classnames'
import {
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

type CarouselAlginment = 'left' | 'center'
type CarouselContext<Item> = {
  items: Item[]
  currentIndex: number
  totalItems: number
  setCurrentIndex: (index: number) => void
  scrollTo(index: number): void
  scrollerRef: RefObject<HTMLUListElement>
  alignment: CarouselAlginment
}

const CarouselContext = createContext<CarouselContext<any>>(
  {} as CarouselContext<any>
)

export type CarouselRootProps<Item> = {
  children: ReactNode
  alignment?: CarouselAlginment
  items: Item[]
}

const getCurrentIndex = (
  el: HTMLElement | null,
  alignment: CarouselAlginment
) => {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = alignment === 'left' ? rect.left : rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const elAtPoint = document.elementFromPoint(x, y)?.closest('li')
  if (!elAtPoint || !elAtPoint.parentElement) return
  return Array.from(elAtPoint.parentElement.children).indexOf(elAtPoint)
}

export const Root = <Item,>({
  alignment = 'center',
  items,
  children
}: CarouselRootProps<Item>) => {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number) => {
      if (!scrollerRef.current) return
      const item = scrollerRef.current.children[index]
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: alignment === 'center' ? 'center' : 'start'
      })
    },
    [alignment]
  )

  return (
    <CarouselContext.Provider
      value={{
        items,
        currentIndex,
        setCurrentIndex,
        totalItems: items.length,
        scrollTo,
        scrollerRef,
        alignment
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export interface CarouselScrollerProps<Item>
  extends Omit<ComponentProps<'ul'>, 'children'> {
  children: (item: Item, index: number) => ReactNode
}

export const Scroller = <Item,>({
  children,
  className,
  ...props
}: CarouselScrollerProps<Item>) => {
  const { scrollerRef, setCurrentIndex, alignment, items } =
    useContext(CarouselContext)
  const timer = useRef<number>()
  const onScrollEnd = useCallback(() => {
    if (!scrollerRef.current) return
    const currentIndex = getCurrentIndex(
      scrollerRef.current?.parentElement,
      alignment
    )
    if (typeof currentIndex !== 'undefined') setCurrentIndex(currentIndex)
  }, [alignment, setCurrentIndex, scrollerRef])
  return (
    <ul
      ref={scrollerRef}
      className={cn(
        'relative flex overflow-x-auto snap-x snap-mandatory whitespace-nowrap py-16 items-center',
        className
      )}
      onScroll={() => {
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(onScrollEnd, 100)
      }}
      {...props}
    >
      {items.map(children)}
    </ul>
  )
}

export type CarouselItemProps = ComponentProps<'li'> & { index: number }

export const Item: FC<CarouselItemProps> = ({
  children,
  onClick,
  className,
  index,
  ...props
}) => {
  const { scrollTo } = useContext(CarouselContext)

  return (
    <li
      {...props}
      className={cn('snap-center flex-none w-max', className)}
      onClick={(e) => {
        scrollTo(index)
        onClick?.(e)
      }}
    >
      {children}
    </li>
  )
}

export const Buttons: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { currentIndex, totalItems, scrollTo } = useContext(CarouselContext)

  return (
    <div className={cn('flex', className)} {...props}>
      <button
        className="w-14 h-14 border border-black bg-white flex items-center justify-center -mr-px group"
        onClick={() => scrollTo(currentIndex - 1)}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="group-disabled:opacity-50 transition-opacity" />
      </button>
      <button
        className="w-14 h-14 border border-black bg-white flex items-center justify-center group"
        onClick={() => scrollTo(currentIndex + 1)}
        disabled={currentIndex === totalItems - 1}
      >
        <ChevronRight className="group-disabled:opacity-50 transition-opacity" />
      </button>
    </div>
  )
}
