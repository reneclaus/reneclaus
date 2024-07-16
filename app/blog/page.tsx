import { genPageMetadata } from 'app/seo'
import Page from './page/[page]/page'

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  return Page({ params: { page: '1' } })
}
