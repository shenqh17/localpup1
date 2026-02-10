'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CityGuide() {
  const t = useTranslations('cityGuide')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  
  const attractions = [
    {
      name: t('westLake.title'),
      nameCn: '西湖',
      description: t('westLake.desc'),
      image: 'https://images.unsplash.com/photo-1597743057129-30193259b26c?w=600&q=80',
    },
    {
      name: t('lingyin.title'),
      nameCn: '灵隐寺',
      description: t('lingyin.desc'),
      image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&q=80',
    },
    {
      name: t('xixi.title'),
      nameCn: '西溪湿地',
      description: t('xixi.desc'),
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="lg:w-1/2">
            <span className="inline-block px-4 py-2 bg-accent-100 text-accent-700 font-medium rounded-full text-sm mb-4">
              {t('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              {t('title')}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            {/* Attractions */}
            <div className="space-y-4">
              {attractions.map((attraction, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{attraction.name}</h3>
                    <p className="text-sm text-slate-500">{attraction.nameCn}</p>
                    <p className="text-sm text-slate-600 mt-1">{attraction.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/guide`}
              className="inline-flex items-center gap-2 mt-8 text-primary-600 font-semibold hover:text-primary-700"
            >
              {t('learnMore')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Image Grid */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=400&q=80"
                  alt="West Lake"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80"
                  alt="Hangzhou"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1569078875997-6cb7c39087a9?w=400&q=80"
                  alt="Tea Fields"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400&q=80"
                  alt="Architecture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}