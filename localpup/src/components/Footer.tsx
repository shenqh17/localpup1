'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n-context'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-bold">LocalPup</span>
              </div>
              <p className="text-slate-400 text-sm">
                {t('footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">{t('nav.home')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/hotels" className="hover:text-white transition-colors">{t('nav.hotels')}</Link></li>
                <li><Link href="/attractions" className="hover:text-white transition-colors">{t('nav.attractions')}</Link></li>
                <li><Link href="/dining" className="hover:text-white transition-colors">{t('nav.dining')}</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">Subscribe for travel tips and exclusive deals.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 text-sm">
            © 2026 LocalPup. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}