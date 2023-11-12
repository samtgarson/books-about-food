import {
  BookOpen,
  Icon,
  Loader,
  Smile,
  TrendingUp,
  Users,
  Zap
} from 'react-feather'
import { Container } from '../atoms/container'

export function USP() {
  return (
    <Container className="mt-24 mb-12 md:mt-40 md:mb-20">
      <p className="text-24 md:text-48 mb-8 md:mb-16 max-w-4xl">
        Welcome to the cookbook industry’s new digital home
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sellingPoints.map((sellingPoint) => (
          <SellingPoint key={sellingPoint.title} {...sellingPoint} />
        ))}
      </ul>
    </Container>
  )
}

const sellingPoints: SellingPointProps[] = [
  {
    icon: Loader,
    title: 'One place for all things cookbook',
    description:
      'A unified space solely dedicated to books about food, drinks and eating.'
  },
  {
    icon: TrendingUp,
    title: 'See what’s new and next',
    description:
      'The only design-forward curated resource online clearly listing new and upcoming releases across all publishers all in one place.'
  },
  {
    icon: Smile,
    title: 'Find your next team',
    description:
      'The who’s who of the cookbook world listed and credited alongside their work; powered by the cookbook community itself.'
  },
  {
    icon: Zap,
    title: 'Auto-generated cookbook pages and portfolios',
    description:
      'The covers showcased on your own dedicated page—thanks to the power of crowdsourcing. Easily managed by claiming your profile.'
  },
  {
    icon: Users,
    title: 'Frequent collaborator analysis',
    description:
      '100s of profiles triaged and connected; showing you which teams work well and often together.'
  },
  {
    icon: BookOpen,
    title: 'Modern tools for publishers and authors',
    description:
      'Dedicated publisher pages with built-in marketing tools for interacting with a highly engaged voluntary audience.'
  }
]

type SellingPointProps = {
  icon: Icon
  title: string
  description: string
}

function SellingPoint({ icon: Icon, title, description }: SellingPointProps) {
  return (
    <li className="flex flex-col items-start gap-2">
      <div className="bg-white p-2 border border-black mb-6">
        <Icon size={42} strokeWidth={1} />
      </div>
      <h3 className="text-16 font-medium">{title}</h3>
      <p className="max-w-prose">{description}</p>
    </li>
  )
}
