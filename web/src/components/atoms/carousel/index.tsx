import cn from 'classnames'
import {
  cloneElement,
  ComponentProps,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'
import { containerClasses, ContainerProps } from '../container'
import { CarouselContext } from './context'
import { CarouselAlginment, getCurrentIndex } from './utils'
import { mouseAttrs } from '../mouse'

export type CarouselRootProps = {
  children: ReactNode
  alignment?: CarouselAlginment
  totalItems: number
} & ComponentProps<'div'>

export { Centerer } from './centerer'

export const Root = ({
  alignment = 'center',
  totalItems,
  children,
  className,
  ...props
}: CarouselRootProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canGoLeft, setCanGoLeft] = useState(false)
  const [canGoRight, setCanGoRight] = useState(true)

  const scrollTo = useCallback(
    (index: number) => {
      if (!scrollerRef.current) return
      const item = scrollerRef.current.children[index] as HTMLElement
      item.scrollIntoView({
        behavior: 'smooth',
        inline: alignment === 'left' ? 'start' : 'center',
        block: 'nearest'
      })
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
      <div className={cn('relative', className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export interface CarouselScrollerProps
  extends Omit<ComponentProps<'ul'>, 'children'> {
  children: ReactNode
  padded?: boolean
  containerProps?: ContainerProps | false
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
          containerProps === false
            ? null
            : [
              containerClasses(containerProps),
              containerClasses({ ...containerProps, scroll: true })
            ]
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

export const Buttons: FC = () => {
  const { currentIndex, totalItems, scrollTo, canGoLeft, canGoRight } =
    useContext(CarouselContext)

  const prevDisabled = currentIndex === 0 || !canGoLeft
  const nextDisabled = currentIndex === totalItems - 1 || !canGoRight

  return (
    <>
      <button
        className={cn(
          'w-1/4 inset-y-0 left-0 absolute bg-transparent [@media(any-hover:none)]:hidden',
          prevDisabled && 'pointer-events-none'
        )}
        onClick={() => scrollTo(currentIndex - 1)}
        disabled={prevDisabled}
        {...mouseAttrs({ mode: 'prev', enabled: !prevDisabled })}
      ></button>
      <button
        className={cn(
          'w-1/4 inset-y-0 right-0 absolute bg-transparent [@media(any-hover:none)]:hidden',
          nextDisabled && 'pointer-events-none'
        )}
        onClick={() => scrollTo(currentIndex + 1)}
        disabled={nextDisabled}
        {...mouseAttrs({ mode: 'next', enabled: !nextDisabled })}
      ></button>
    </>
  )
}
