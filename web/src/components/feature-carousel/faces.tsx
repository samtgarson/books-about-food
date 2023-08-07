import cn from 'classnames'
import { motion } from 'framer-motion'
import { FC, useMemo } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { Avatar } from '../atoms/avatar'
import { CircleLogo } from '../atoms/circle-logo'
import { Face } from './face'

export type FacesProps = {
  features: Feature[]
}

export const Faces: FC<FacesProps> = ({ features }) => {
  const faces = useMemo(() => Face.forFeatures(features), [features])

  return (
    <motion.div
      className="hidden lg:flex right-[15vw] left-[40vw] border-red absolute inset-y-0 justify-center items-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ ease: 'easeIn' }}
    >
      <CircleLogo className={cn('hidden lg:block animate-slow-spin')} />
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
    className="absolute"
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
    <Avatar profile={profile} size={face.avatarSize} />
    <motion.p
      style={face.nameStyle}
      className="inline-block absolute text-32 px-4 py-2"
      initial={{ y: 0 }}
      animate={{ y: 3 }}
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
