import { RefObject, createContext } from 'react'
import { CarouselAlginment } from './utils'

export type CarouselContext = {
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

export const CarouselContext = createContext({} as CarouselContext)
