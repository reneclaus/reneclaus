import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="mt-1.2 flex h-6 items-center justify-between text-5xl font-semibold sm:block">
            <Logo
              height="1.6ex"
              className="-me-0.5 inline-block align-baseline text-6xl sm:ml-3 sm:text-5xl"
            />
            <span className="hidden sm:inline">{siteMetadata.headerTitle.substring(1)}</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400
              sm:block"
            >
              {link.title}
            </Link>
          ))}
        {/* <SearchButton /> */}
      </div>
      <MobileNav />
    </header>
  )
}

export default Header
