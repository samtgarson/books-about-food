import { motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { Book } from 'src/core/models/book'
import { Avatar } from '../atoms/avatar'
import { Face } from './face'

export type FacesProps = {
  books: Book[]
}

export const Faces: FC<FacesProps> = ({ books }) => {
  const [display, setDisplay] = useState(false)
  const faces = useMemo(() => Face.forBooks(books), [books])

  useEffect(() => {
    setDisplay(true)
  }, [])

  if (!display) return null
  return (
    <motion.div
      className="pointer-events-none absolute top-0 right-8 bottom-8 -left-1/4 z-30 flex items-center justify-center sm:right-[15vw] sm:bottom-0 sm:left-[42vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ ease: 'easeIn' }}
    >
      {faces.map((face, i) => (
        <FloatingFace face={face} i={i} key={face.profile.id} />
      ))}
    </motion.div>
  )
}

const FloatingFace: FC<{ face: Face; i: number }> = ({
  face: { point, profile, ...face },
  i
}) => (
  <motion.div
    key={profile.id}
    className="pointer-events-none absolute z-10 hover:z-40 md:pointer-events-auto"
    style={{ left: `${point.x + 10}%`, top: `${point.y + 10}%` }}
    initial={{ y: 0 }}
    animate={{ y: -10 }}
    transition={{
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
      repeatType: 'mirror',
      delay: i * 0.4
    }}
  >
    <Avatar
      profile={profile}
      size={face.avatarSize}
      className="origin-left scale-50 sm:scale-100"
    />
    <motion.p
      style={face.nameStyle}
      className="absolute hidden px-4 py-2 text-32 sm:inline-block"
      initial={{ y: 0 }}
      animate={{ y: 5 }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut',
        repeatType: 'mirror',
        delay: i * 0.4
      }}
    >
      {profile.name.split(' ')[0]}
    </motion.p>
  </motion.div>
)
