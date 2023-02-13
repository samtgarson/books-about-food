import {
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import cn from 'classnames'
import { useInView } from 'framer-motion'

type CarouselContext = {
  visible: Record<number, boolean>
  setItem: (index: number, visible: boolean) => void
}
const CarouselContext = createContext<CarouselContext>({} as CarouselContext)

export type CarouselRootProps = {
  className?: string
  children: ReactNode
  id: string
}

export const Root: FC<CarouselRootProps> = ({ className, children, id }) => {
  const [visible, setVisible] = useState({})
  const setItem = useCallback((index: number, visible: boolean) => {
    setVisible((prev) => ({ ...prev, [index]: visible }))
  }, [])

  return (
    <CarouselContext.Provider value={{ visible, setItem }}>
      <ul
        className={cn(
          'relative flex overflow-x-scroll snap-x snap-mandatory snap-always whitespace-nowrap py-16 items-center',
          className
        )}
        id={id}
      >
        {children}
      </ul>
    </CarouselContext.Provider>
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
  const item = useRef<HTMLLIElement>(null)
  const inView = useInView(item, { amount: 0.8 })
  const { setItem } = useContext(CarouselContext)

  useEffect(() => {
    setItem(index, inView)
  }, [inView, index, setItem])

  return (
    <li
      ref={item}
      {...props}
      className={cn('snap-center flex-none w-max', className)}
      onClick={(e) => {
        const target = e.target as HTMLLIElement
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
        onClick?.(e)
      }}
    >
      {children}
    </li>
  )
}
