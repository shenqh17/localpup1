'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Locale, locales, defaultLocale } from '@/lib/locale'
import { Globe, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文'
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get current locale from pathname
  const pathLocale = pathname.split('/')[1] as Locale
  const currentLocale = locales.includes(pathLocale) ? pathLocale : defaultLocale

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale === currentLocale) {
      setIsOpen(false)
      return
    }

    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/(en|zh)/, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-primary-600 font-medium transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                currentLocale === locale ? 'text-primary-600 font-medium' : 'text-slate-700'
              }`}
            >
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}