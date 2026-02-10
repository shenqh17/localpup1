'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'

export default function HotelsPage() {
  const { t, locale } = useI18n()
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})

  const isZh = locale === 'zh'

  const nextImage = (hotelId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % totalImages
    }))
  }

  const prevImage = (hotelId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isZh ? '杭州酒店' : 'Hotels in Hangzhou'}
          </h1>
          <p className="text-slate-600">
            {isZh 
              ? `发现 ${hotels.length} 家精选高分酒店，Booking 评分 9.0+，携程评分 4.0+`
              : `Discover ${hotels.length} handpicked hotels with Booking 9.0+ and Ctrip 4.0+ ratings`
            }
          </p>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">{t('hotels.filters')}</h3>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">{t('hotels.filter.rating')}</h4>
                <div className="space-y-2">
                  {[5, 4].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-slate-600">{rating}+ {isZh ? '星' : 'Stars'}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">{t('hotels.filter.location')}</h4>
                <div className="space-y-2">
                  {['West Lake', 'CBD', 'Lingyin Temple', 'Xixi Wetland', 'Longjing'].map((loc) => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm text-slate-600">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">{t('hotels.filter.price')}</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder={isZh ? '最低' : 'Min'}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder={isZh ? '最高' : 'Max'}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel List */}
          <div className="flex-1 space-y-6">
            {/* Sort Bar */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <span className="text-slate-600">{hotels.length} {isZh ? '家酒店' : 'hotels found'}</span>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select className="text-sm border-none bg-transparent text-slate-700 font-medium focus:outline-none">
                  <option>{isZh ? '推荐' : 'Recommended'}</option>
                  <option>{isZh ? '价格：低到高' : 'Price: Low to High'}</option>
                  <option>{isZh ? '价格：高到低' : 'Price: High to Low'}</option>
                  <option>{isZh ? '评分：高到低' : 'Rating: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Hotel Cards */}
            {hotels.map((hotel) => {
              const currentIdx = currentImageIndex[hotel.id] || 0
              const currentImage = hotel.images[currentIdx]
              
              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Gallery */}
                    <div className="md:w-96 h-64 md:h-auto relative bg-slate-100">
                      <Image
                        src={currentImage.url}
                        alt={isZh ? hotel.nameZh || hotel.name : hotel.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Image Navigation */}
                      {hotel.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.preventDefault(); prevImage(hotel.id, hotel.images.length) }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); nextImage(hotel.id, hotel.images.length) }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {hotel.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === currentIdx ? 'bg-white' : 'bg-white/50'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Image Source Attribution */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {isZh 
                          ? currentImage.sourceAttribution.replace('Images from', '图片来自').replace('Official', '官方')
                          : currentImage.sourceAttribution
                        }
                      </div>
                      
                      {/* Featured Badge */}
                      {hotel.featured && (
                        <div className="absolute top-2 left-2">
                          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                            {isZh ? '精选' : 'Featured'}
                          </span>
                        </div>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {currentIdx + 1} / {hotel.images.length}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{isZh ? hotel.nameZh : hotel.name}</h3>
                          <p className="text-sm text-slate-500">{isZh ? hotel.name : hotel.nameZh}</p>
                          <div className="flex items-center gap-1 text-slate-500 mb-3 mt-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{isZh ? hotel.locationZh : hotel.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">¥{hotel.price}</p>
                          <p className="text-sm text-slate-500">{t('hotels.perNight')}</p>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {isZh ? hotel.descriptionZh : hotel.description}
                      </p>

                      {/* Dual Ratings */}
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                          <span className="text-lg font-bold text-green-700">{hotel.bookingRating}</span>
                          <div className="text-xs text-green-600">
                            <div>Booking.com</div>
                            <div>{hotel.bookingReviewCount} {isZh ? '条评价' : 'reviews'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                          <span className="text-lg font-bold text-blue-700">{hotel.ctripRating}</span>
                          <div className="text-xs text-blue-600">
                            <div>Ctrip 携程</div>
                            <div>{hotel.ctripReviewCount} {isZh ? '条评价' : 'reviews'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-900">{hotel.rating}</span>
                          <span className="text-sm text-slate-500">({hotel.reviewCount})</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 5).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 5 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                            +{hotel.amenities.length - 5}
                          </span>
                        )}
                      </div>

                      <Link href={`/hotels/${hotel.slug}`}>
                        <span className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                          {t('hotels.viewDetails')} →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}