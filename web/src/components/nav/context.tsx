'use client'
import { usePathname } from 'next/navigation'
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Transition, TransitionControl } from './transition'

export type NavTheme = 'dark' | 'light'
type NavContext = {
  theme: NavTheme
  setTheme: (theme: NavTheme) => void
  open: boolean
  setOpen: (open: boolean) => void
  showTransition: () => void
  footerVisible: boolean
  setFooterVisible: (visible: boolean) => void
}

const NavContext = createContext({} as NavContext)

export const NavProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const path = usePathname()
  const [theme, setTheme] = useState<NavTheme>(path === '/' ? 'dark' : 'light')
  const [open, setOpen] = useState(false)
  const transition = useRef<TransitionControl>(null)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    setOpen(false)
    setTheme(path === '/' ? 'dark' : 'light')
  }, [path])

  return (
    <NavContext.Provider
      value={{
        footerVisible,
        setFooterVisible,
        theme,
        setTheme,
        open,
        setOpen,
        showTransition() {
          transition.current?.show()
        }
      }}
    >
      <Transition ref={transition} />
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
