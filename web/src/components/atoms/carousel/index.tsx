import cn from 'classnames'
import {
  cloneElement,
  ComponentProps,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { containerClasses, ContainerProps } from '../container'
import { mouseAttrs } from '../mouse'
import { CarouselContext } from './context'
import { canScroll, CarouselAlginment, getCurrentIndex } from './utils'

export type CarouselRootProps = {
  children: ReactNode
  alignment?: CarouselAlginment
  totalItems: number
  startOn?: number
} & ComponentProps<'div'>

export { Centerer } from './centerer'

export const Root = ({
  alignment = 'center',
  totalItems,
  children,
  className,
  startOn = 0,
  ...props
}: CarouselRootProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canGoLeft, setCanGoLeft] = useState(false)
  const [canGoRight, setCanGoRight] = useState(true)
  const id = useId()

  const scrollTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (!scrollerRef.current) return
      const item = scrollerRef.current.children[index] as HTMLElement
      item.scrollIntoView({
        behavior,
        inline: alignment === 'left' ? 'start' : 'center',
        block: 'nearest'
      })
    },
    [alignment]
  )

  useEffect(() => {
    if (startOn === 0 || !scrollerRef.current) return
    const child = scrollerRef.current.children.item(startOn - 1)
    if (!(child instanceof HTMLElement)) return

    scrollerRef.current.scrollLeft = child.offsetLeft
    setCurrentIndex(startOn)
    const { left, right } = canScroll(scrollerRef.current)
    setCanGoLeft(left)
    setCanGoRight(right)
  }, [startOn, scrollTo])

  return (
    <CarouselContext.Provider
      value={{
        id,
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
  extends Omit<ComponentProps<'ul'>, 'children' | 'id'> {
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
    setCanGoLeft,
    id
  } = useContext(CarouselContext)
  const onScrollEnd = useDebouncedCallback(() => {
    if (!scrollerRef.current) return
    const scroller = scrollerRef.current
    const currentIndex = getCurrentIndex(scroller, alignment)
    if (typeof currentIndex !== 'undefined') setCurrentIndex(currentIndex)

    const { left, right } = canScroll(scroller)
    setCanGoLeft(left)
    setCanGoRight(right)
  }, 100)

  return (
    <ul
      id={id}
      ref={scrollerRef}
      className={cn(
        'scrollbar-hidden relative flex snap-x snap-mandatory items-center justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap pb-16',
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
      onScroll={onScrollEnd}
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
  className
}) => {
  const { alignment } = useContext(CarouselContext)

  return cloneElement(children, {
    className: cn(
      'flex-none w-max',
      children.props.className,
      alignment === 'center' && 'snap-center',
      alignment === 'left' && 'snap-start',
      className
    ),
    onClick(e: MouseEvent) {
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
          'absolute inset-y-0 left-0 w-1/6 bg-transparent [@media(any-hover:none)]:hidden',
          prevDisabled && 'pointer-events-none'
        )}
        onClick={() => scrollTo(currentIndex - 1)}
        disabled={prevDisabled}
        {...mouseAttrs({ mode: 'prev', enabled: !prevDisabled })}
      ></button>
      <button
        className={cn(
          'absolute inset-y-0 right-0 w-1/6 bg-transparent [@media(any-hover:none)]:hidden',
          nextDisabled && 'pointer-events-none'
        )}
        onClick={() => scrollTo(currentIndex + 1)}
        disabled={nextDisabled}
        {...mouseAttrs({ mode: 'next', enabled: !nextDisabled })}
      ></button>
    </>
  )
}
