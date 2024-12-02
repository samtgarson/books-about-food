'use client'
import { usePathname, useSearchParams } from 'next/navigation'
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
  // Boolean to determine if we're reloading the current page
  internalLoading: boolean
}

const NavContext = createContext({} as NavContext)

export const NavProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const path = usePathname()
  const search = useSearchParams()
  const [theme, setTheme] = useState<NavTheme>(
    path === '/' && !process.env.SHOW_TAKEOVER ? 'dark' : 'light'
  )
  const [open, setOpen] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)
  const transition = useRef<TransitionControl>(null)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    setOpen(false)
    setTheme(path === '/' && !process.env.SHOW_TAKEOVER ? 'dark' : 'light')
  }, [path])

  useEffect(() => {
    setInternalLoading(false)
  }, [search])

  return (
    <NavContext.Provider
      value={{
        footerVisible,
        setFooterVisible,
        theme,
        setTheme,
        open,
        setOpen,
        internalLoading,
        showTransition() {
          transition.current?.show()
        }
      }}
    >
      <Transition ref={transition} setInternalLoading={setInternalLoading} />
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
