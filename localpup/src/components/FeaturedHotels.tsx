'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

const hotels = [
  {
    id: '1',
    name: 'Four Seasons Hotel Hangzhou',
    slug: 'four-seasons-hangzhou',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.9,
    reviewCount: 2847,
    price: 2800,
    location: 'West Lake',
    description: 'Luxury resort nestled among traditional gardens and ponds with stunning West Lake views.',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
    imageSource: 'booking',
  },
  {
    id: '2',
    name: 'Park Hyatt Hangzhou',
    slug: 'park-hyatt-hangzhou',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    rating: 4.8,
    reviewCount: 1923,
    price: 1800,
    location: 'CBD',
    description: 'Modern luxury hotel with panoramic city views and world-class amenities.',
    amenities: ['Free WiFi', 'Gym', 'Bar', 'Restaurant'],
    imageSource: 'ctrip',
  },
  {
    id: '3',
    name: 'Amanfayun',
    slug: 'amanfayun-hangzhou',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.9,
    reviewCount: 892,
    price: 6500,
    location: 'Lingyin Temple Area',
    description: 'Ancient village restored into an exclusive retreat surrounded by tea fields.',
    amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Garden'],
    imageSource: 'official',
  },
]

export function FeaturedHotels() {
  const { t } = useI18n()

  return (
    <section className="py-20 bg-slate-50">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              {t('hotels.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('hotels.title')}</h2>
            <p className="text-slate-600 mt-2 text-lg">{t('hotels.subtitle')}</p>
          </div>
          <Link href="/hotels" className="group flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            {t('hotels.viewAll')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hotel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded-full">
                    {t('hotels.featured')}
                  </span>
                </div>
                {/* Image Source Attribution */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {t(`hotels.imageSource.${hotel.imageSource}`)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span className="font-semibold text-green-700">{hotel.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.location}</span>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">¥{hotel.price}</span>
                    <span className="text-slate-500 text-sm"> / {t('hotels.perNight')}</span>
                  </div>
                  <span className="text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                    {t('hotels.viewDetails')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}