type FooterItem = {
  label: string
} & (
  | { href: string; path?: never; tag?: never }
  | { href?: never; path: string; tag?: never }
  | { href?: never; path?: never; tag: string }
)

type FooterColumn = {
  title: string
  items: FooterItem[]
}

export const footerData: FooterColumn[] = [
  {
    title: 'Pages',
    items: [
      { label: 'About', path: '/about' },
      { label: 'Cookbooks', path: '/cookbooks' },
      { label: 'Authors', path: '/authors' },
      { label: 'People Portfolios', path: '/people' },
      { label: 'Publishers', path: '/publishers' },
      { label: 'FAQs', path: '/frequently-asked-questions' }
    ]
  },
  {
    title: 'Popular Cookbooks',
    items: [
      { label: 'Italian Cookbooks', tag: 'italian' },
      { label: 'Middle Eastern Cookbooks', tag: 'middle-eastern' },
      { label: 'Sweets & Baking Cookbooks', tag: 'sweets-baking' },
      { label: 'Indian Cookbooks', tag: 'indian' },
      { label: 'Plant-based Cookbooks', tag: 'plant-based' }
    ]
  },
  {
    title: 'Cookbook Collections',
    // Great for Beginners
    // From Acclaimed Restaurants
    // For Meat Lovers
    // Food Encyclopaedias
    // Jamin's Cookbook Shelf
    items: [
      {
        label: 'Great for Beginners',
        path: '/collections/great-for-beginners'
      },
      {
        label: 'From Acclaimed Restaurants',
        path: '/collections/from-acclaimed-restaurants'
      },
      { label: 'For Meat Lovers', path: '/collections/for-meat-lovers' },
      {
        label: 'Food Encyclopaedias',
        path: '/collections/food-encyclopaedias'
      },
      {
        label: "Jamin's Cookbook Shelf",
        path: '/collections/jamins-cookbook-shelf'
      }
    ]
  },
  {
    title: 'Support Us',
    items: [
      { label: 'Create an Account', path: '/account' },
      { label: 'Submit a Cookbook', path: '/account/submissions' },
      {
        label: 'Buy me a coffee',
        href: 'https://www.buymeacoffee.com/booksaboutfood'
      },
      {
        label: 'Follow on Instagram',
        href: 'https://www.instagram.com/booksabout.food'
      }
    ]
  }
]
