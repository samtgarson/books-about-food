'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Loader } from 'react-feather'
import * as Sheet from 'src/components/atoms/sheet'
import { Button } from '../atoms/button'
import { contactProps } from '../atoms/contact-link'

export type ClaimPublisherButtonProps = {
  publisherName: string
  className?: string
}

export const ClaimPublisherButton: FC<ClaimPublisherButtonProps> = ({
  className,
  publisherName
}) => {
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
      <Sheet.Content size="lg">
        <Sheet.Body>
          <Sheet.Header title="Claim this publisher profile" />
          <div className="flex flex-col gap-8">
            <p>
              If you work at {publisherName}, you can claim this profile and
              gain access to manage and promote it. Get in touch below and
              we&apos;ll help you get set up.
            </p>
            <div>
              <h3 className="bg-secondary-blue p-3 text-center font-medium">
                Benefits for Publishers
              </h3>
              <p className="bg-tertiary-blue px-4 py-6">
                <ul className="flex list-disc flex-col gap-2 pl-4">
                  <li>
                    Forget the PDFs, announce seasonal new releases in the most
                    modern way currently available online
                  </li>
                  <li>
                    Simple tools to create custom carousels of cookbooks on your
                    dedicated publisher homepage
                  </li>
                  <li>
                    Affordable marketing tools to promote cookbooks and
                    spotlight authors to the main homepage
                  </li>
                  <li>Link to key articles on other websites </li>
                  <li>
                    Be part of a creative community solely dedicated to the
                    world’s best selling non-fiction books.
                  </li>
                  <li>
                    Contribute to the cookbook industry’s new digital home{' '}
                  </li>
                  <li>Get early access to all new features </li>
                </ul>
              </p>
              <Button
                as="a"
                className="w-full"
                {...contactProps(`Publisher Claim: ${publisherName}`)}
                variant="dark"
              >
                Get in touch
              </Button>
            </div>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
