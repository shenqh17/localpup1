'use client'

import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1920&q=80)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding text-center text-white max-w-4xl mx-auto pt-20">
        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
          ✨ {t('hotels.badge')}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {t('hero.title1')}<br />
          <span className="gradient-text">{t('hero.title2')}</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="text-xs text-slate-500">{t('nav.home')}</p>
                <p className="font-medium text-slate-900">Hangzhou, China</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="text-xs text-slate-500">Dates</p>
                <p className="font-medium text-slate-900">Add dates</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <Users className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="text-xs text-slate-500">Guests</p>
                <p className="font-medium text-slate-900">2 Adults</p>
              </div>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 py-3 sm:py-0">
              <Search className="w-5 h-5" />
              {t('hero.searchButton')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-16 mt-12">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">500+</p>
            <p className="text-white/80 text-sm">Curated Hotels</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">50K+</p>
            <p className="text-white/80 text-sm">Happy Travelers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">4.9</p>
            <p className="text-white/80 text-sm">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}