import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import { ReactNode } from 'react'
import tailwindConfig from '../tailwind.config'
import Header from './header'

type BaseLayoutProps = {
  width?: number
  style?: string
  children: ReactNode
  recipientName?: string | null
  preview: string
}

export default function BaseLayout({
  children,
  style = '',
  recipientName,
  preview
}: BaseLayoutProps) {
  return (
    <Html>
      {/* @ts-expect-error mismatched tailwind versions */}
      <Tailwind config={tailwindConfig}>
        <Head>
          <style>
            {`
          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            background-color: rgb(240,238,235);
          }
          a {
            color: inherit
          }
          .no-wrap {
            white-space: nowrap;
          }
          ${style}
      `}
          </style>
          <Font
            fontFamily="Graphik"
            webFont={{
              url: 'https://www.booksabout.food/_next/static/media/e31ac99f363526e6-s.p.otf',
              format: 'opentype'
            }}
            fallbackFontFamily="sans-serif"
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Graphik"
            webFont={{
              url: 'https://www.booksabout.food/_next/static/media/d27f169d2802100a-s.p.otf',
              format: 'opentype'
            }}
            fallbackFontFamily="sans-serif"
            fontWeight={500}
            fontStyle="normal"
          />
        </Head>

        <Preview>{preview}</Preview>
        <Body className="bg-grey">
          <Container className="bg-grey px-5">
            <Section>
              <Header />
              <Hr className="border-b border-khaki pb-2" />
              {recipientName ? (
                <Text>
                  Dear
                  {recipientName},
                </Text>
              ) : (
                <Text>Hi there,</Text>
              )}
              {children}
              <Text>
                Cheers,
                <br />
                Jamin & Sam at Books About Food
              </Text>
              <Hr className="border-b border-khaki pb-2" />
              <Text className="text-12 text-neutral-grey">
                Copyright © Books About Food {new Date().getFullYear()}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
