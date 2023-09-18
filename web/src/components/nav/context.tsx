'use client'
import { usePathname } from 'next/navigation'
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

export type NavTheme = 'dark' | 'light'
type NavContext = {
  theme: NavTheme
  setTheme: (theme: NavTheme) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const NavContext = createContext({} as NavContext)

export const NavProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const path = usePathname()
  const [theme, setTheme] = useState<NavTheme>(path === '/' ? 'dark' : 'light')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    setTheme(path === '/' ? 'dark' : 'light')
  }, [path, setTheme])

  return (
    <NavContext.Provider value={{ theme, setTheme, open, setOpen }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
