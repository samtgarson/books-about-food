import localFont from '@next/font/local'

export const graphik = localFont({
  src: [
    {
      path: '../assets/fonts/Graphik-Regular-Trial.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/fonts/Graphik-Medium-Trial.otf',
      weight: '500',
      style: 'normal'
    }
  ],
  variable: '--font-graphik'
})
