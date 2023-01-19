'use client'

import * as Collapsible from '@radix-ui/react-collapsible'
import { FC, useState } from 'react'
import { Profile } from 'src/models/profile'
import { Avatar } from '../atoms/avatar'
import { GridContainer } from '../lists/grid-container'
import { ProfileItem } from './item'
import { AnimatePresence, motion } from 'framer-motion'
import cn from 'classnames'

export type ProfileListSectionProps = {
  profiles: Profile[]
  title: string
}

export const ProfileListSection: FC<ProfileListSectionProps> = ({
  profiles,
  title
}) => {
  const [forceOpen, setForceOpen] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root
      className="border-b border-black sm:border-b-0 sm:mx-0 -mx-5"
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        setForceOpen(true)
      }}
    >
      <motion.div
        className={cn(
          'w-full mt-4 sm:mt-20 mb-4 sm:mb-8 flex flex-wrap justify-between items-start px-5 sm:p-0 transition-all relative sm:!h-auto'
        )}
        layout
      >
        <motion.h2 layout="position">{title}</motion.h2>
        <motion.span layout="position" className="sm:hidden">
          <Collapsible.Trigger>Open</Collapsible.Trigger>
        </motion.span>
        <AnimatePresence>
          <motion.div
            layout="position"
            className={cn('w-full flex flex-wrap gap-2 sm:hidden')}
            animate={{
              opacity: open ? 0 : 1,
              height: open ? 0 : 'auto',
              marginTop: open ? 0 : 10
            }}
          >
            {profiles.map((profile) => (
              <Avatar key={profile.id} profile={profile} size="xs" />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <Collapsible.Content
        className="data-[state=open]:animate-collapsible-open data-[state=closed]:animate-collapsible-closed sm:!h-auto overflow-hidden px-5 sm:px-0 sm:overflow-visible -mb-px"
        forceMount={forceOpen || undefined}
      >
        <GridContainer className="collapsible-fade sm:!opacity-100 -mt-px sm:mt-0">
          {profiles.map((profile) => (
            <ProfileItem key={profile.id} profile={profile} display="list" />
          ))}
        </GridContainer>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
