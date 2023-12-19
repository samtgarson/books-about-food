import {
  Book,
  Home,
  Icon,
  Layers,
  User,
  Users
} from 'src/components/atoms/icons'
import { QuickSearchItem } from './item'

export class SearchAction {
  constructor(
    public title: string,
    public href: string,
    public icon: Icon
  ) {}

  get id() {
    return this.title.toLowerCase().replace(/ /g, '-')
  }

  get domId() {
    return `search-action-${this.id}`
  }
}

const actions = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Cookbooks', href: '/cookbooks', icon: Book },
  { title: 'Authors', href: '/authors', icon: User },
  { title: 'People', href: '/people', icon: Users },
  { title: 'Publishers', href: '/publishers', icon: Layers }
].map((action) => new SearchAction(action.title, action.href, action.icon))

export function quickSearchActions(query: string) {
  return actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase())
  )
}

export function QuickSearchAction({
  action: { href, title, icon: Icon, domId },
  focused,
  onHover
}: {
  action: SearchAction
  focused: boolean
  onHover?: () => void
}) {
  return (
    <QuickSearchItem.Root
      href={href}
      key={title}
      focused={focused}
      onHover={() => onHover?.()}
      id={domId}
    >
      <QuickSearchItem.Image>
        <Icon strokeWidth={1} size={32} className="w-5 h-5 sm:w-6 sm:h-6" />
      </QuickSearchItem.Image>
      <p>{title}</p>
    </QuickSearchItem.Root>
  )
}
