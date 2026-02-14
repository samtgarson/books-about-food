'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Loader } from 'src/components/atoms/icons'
import * as Sheet from 'src/components/atoms/sheet'
import { Button } from '../atoms/button'
import { contactProps } from '../atoms/contact-link'
import { Tag } from '../atoms/tag'
import { EditPublisherButton } from './edit/button'
import { useEditPublisher } from './edit/context'

export type ClaimPublisherButtonProps = {
  className?: string
}

export const ClaimPublisherButton: FC<ClaimPublisherButtonProps> = ({
  className
}) => {
  const { enabled, publisher } = useEditPublisher()

  if (enabled) return <EditPublisherButton className={className} />
  if (publisher.claimed) return null
  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button
          className={cn(
            'flex items-center gap-2 transition-opacity',
            className
          )}
          title="Claim this profile"
        >
          <Loader strokeWidth={1} />
          Claim Profile
        </Button>
      </Sheet.Trigger>
      <Sheet.Content title="Claim this publisher profile">
        <Sheet.Body className="flex flex-col gap-8">
          <p>
            Please register your interest below and we will be in touch to help
            you get set up.
          </p>
          <div>
            <h3 className="flex justify-between bg-secondary-blue p-3 font-medium">
              <span>Benefits for Publishers</span>
              <Tag color="white">Coming Soon</Tag>
            </h3>
            <p className="bg-tertiary-blue px-4 py-6">
              <ul className="flex list-disc flex-col gap-1 pl-4">
                <li>
                  Forget PDFs, promote new releases in the most modern way
                  currently available online
                </li>
                <li>
                  Simple tools to create custom carousels of cookbooks on your
                  dedicated publisher homepage
                </li>
                <li>
                  Get access to marketing tools to promote your cookbooks on the
                  homepage
                </li>
                <li>White glove service to set up your publisher profile</li>
                <li>Add links to industry news on your page</li>
                <li>
                  Support a creative community solely dedicated to cookbooks
                </li>
                <li>Get early access to all new features</li>
              </ul>
            </p>
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Button
            className="w-full"
            {...contactProps(`Publisher Claim: ${publisher.name}`)}
            variant="dark"
          >
            Get in touch
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  )
}
