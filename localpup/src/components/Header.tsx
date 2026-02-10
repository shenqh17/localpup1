'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'
import { Menu, X, Search, Globe } from 'lucide-react'

export function Header() {
  const { locale, setLocale, t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/hotels', label: t('nav.hotels') },
    { href: '/attractions', label: t('nav.attractions') },
    { href: '/dining', label: t('nav.dining') },
    { href: '/videos', label: t('nav.videos') },
  ]

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'zh' : 'en')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold gradient-text">LocalPup</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-primary-600 transition-colors" aria-label={t('nav.search')}>
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'English' : '中文'}
            </button>
            <Link href="/hotels" className="btn-primary">
              {t('nav.exploreHotels')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <nav className="section-padding py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-slate-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? 'English' : '中文'}
              </button>
            </div>
            <div className="pt-4">
              <Link href="/hotels" className="btn-primary block text-center">
                {t('nav.exploreHotels')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}