import { Metadata } from 'next'
import Image from 'next/image'
import { ComponentProps } from 'react'
import jamin from 'src/assets/images/jamin.png'
import sam from 'src/assets/images/sam.png'
import { ContactLink } from 'src/components/atoms/contact-link'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'

export const metadata: Metadata = {
  alternates: {
    canonical: '/about'
  }
}

export default function AboutPage() {
  return (
    <>
      <Container belowNav className="pb-10">
        <PageTitle>About</PageTitle>
        <div className="relative">
          <div className="max-w-prose">
            <p className="text-18 md:text-24 mb-8">
              Books About Food is a unique, design-forward space created to
              showcase books about food and the people involved in making them.
            </p>
            <P>
              Thousands of books are released every year, but we’re only
              obsessed with the ones that involve food, eating and drinking.
              When the project started on{' '}
              <Link href="https://www.instagram.com/books.about.food/">
                Instagram
              </Link>{' '}
              in 2016, our aim was to surface what we considered beautifully
              designed cookbooks, old and new, to an audience that might never
              come across them. You can read more about the origin story in{' '}
              <Link href="https://www.instagram.com/p/CBzuaZ_HX2Q/?img_index=1">
                this post
              </Link>
              . Our mission continues today with added responsibility and
              excitement.
            </P>
            <P>
              We’re so happy and pleased to have been welcomed into such a
              global community of inspiring creatives. This space is for you.
            </P>
            <P>
              We’re here to support you. We’re not here to rate or review
              books—you can go elsewhere for that. We’re here to reflect on the
              quality of design in this popular genre. And we’re here to elevate
              and give this community of chefs, cooks, authors, designers,
              photographers, stylists and others a dedicated corner of the
              internet that represents them and their work in a sector we call
              “the big niche”.
            </P>
            <h3 className="mb-6 font-medium">Who’s behind this project?</h3>
            <div className="w-full xl:w-[450px] 2xl:w-[550px] mb-6 flex min-h-96 aspect-auto xl:aspect-[1.1] bg-sand items-center justify-center gap-2 relative xl:absolute xl:right-0 xl:top-0 pb-14">
              <Image src={jamin} alt="Jamin Galea" height={200} />
              <Image src={sam} alt="Sam Garson" height={195} className="pt-8" />
              <p className="mt-auto absolute inset-x-0 bottom-0 p-5 md:p-8">
                Jam (left), Sam (right)
              </p>
            </div>
            <P>
              We’re <Link href="https://samgarson.com">Sam</Link>
              {' & '}
              <Link href="https://jamingalea.com">Jam</Link>. Our shared love of
              food and eating led us to create this project.
            </P>
            <P>
              We met in 2020 whilst working in the digital team at{' '}
              <Link href="https://sohohouse.com">Soho House</Link>. Jamin
              started his career in London as a brand designer but now designs
              websites and apps, and Sam is an engineer working in the start-up
              scene in London.
            </P>
          </div>
        </div>
      </Container>
      <Container className="bg-sand py-8 md:py-16 -mb-20">
        <div className="max-w-prose">
          <h2 className="text-24 md:text-48 mb-8">Get in touch</h2>
          <P>
            If you have any questions, suggestions or just want to say hi please{' '}
            <ContactLink>get in touch</ContactLink>, we’d love to hear from you.
          </P>
          <h3 className="mb-6 font-medium">Authors and creatives</h3>
          <P>
            If you’ve released a cookbook or are working on one,{' '}
            <ContactLink subject="Hello! I'm an author and/or creative">
              get in touch
            </ContactLink>{' '}
            or drop us a DM on <a>Instagram</a>, let us know about it.
          </P>
          <h3 className="mb-6 font-medium">
            Publishers and people from the industry
          </h3>
          <P>
            We’d love to promote your cookbooks on this website and become part
            of your seasonal press release cycle. We’re also keen to talk to you
            about the big plans we have for you on this website.{' '}
            <ContactLink subject="Hello! I'm a publisher and/or I'm in the industry">
              Get in touch
            </ContactLink>{' '}
            and let’s work together!
          </P>
          <h3 className="mb-6 font-medium">Support our project</h3>
          <P>
            Hey brands and publishers—sponsor our homepage! We’re keen to
            partner with you if you’re after exposure to an engaged, largely
            female audience (25-45) from the UK, US and Australia.{' '}
            <ContactLink subject="Hello! Let's talk sponsorship">
              Get in touch
            </ContactLink>
            —we’d love to chat.
          </P>
          <P>
            This is a passion project we do alongside our day job. If you like
            what we’re doing, please consider{' '}
            <Link href="https://www.buymeacoffee.com/booksaboutfood">
              buying us a coffee
            </Link>
            .
          </P>
        </div>
      </Container>
    </>
  )
}

const Link = ({ children, ...props }: ComponentProps<'a'>) => (
  <a className="underline" target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
)

const P = ({ children, ...props }: ComponentProps<'p'>) => (
  <p className="mb-6" {...props}>
    {children}
  </p>
)
