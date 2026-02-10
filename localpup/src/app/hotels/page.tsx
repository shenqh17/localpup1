'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'

// 星级评分组件
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function HotelsPage() {
  const { t, locale } = useI18n()
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  
  // 筛选状态
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const isZh = locale === 'zh'

  const priceRanges = [
    { label: '¥0-500', min: 0, max: 500 },
    { label: '¥500-1000', min: 500, max: 1000 },
    { label: '¥1000-2000', min: 1000, max: 2000 },
    { label: '¥2000+', min: 2000, max: Infinity },
  ]

  const locations = ['西湖', '钱江新城', '滨江', '武林', '其他']

  // 筛选后的酒店列表
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // 价格筛选
      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.label === selectedPriceRange)
        if (range && (hotel.price < range.min || hotel.price >= range.max)) {
          return false
        }
      }
      
      // 位置筛选
      if (selectedLocation) {
        const hotelLocation = isZh ? hotel.locationZh : hotel.location
        if (selectedLocation === '其他') {
          // 如果选择的是"其他"，排除其他已知位置
          const knownLocations = ['西湖', '钱江新城', '滨江', '武林']
          if (knownLocations.some((loc) => hotelLocation?.includes(loc))) {
            return false
          }
        } else if (!hotelLocation?.includes(selectedLocation)) {
          return false
        }
      }
      
      return true
    })
  }, [selectedPriceRange, selectedLocation, isZh])

  const nextImage = (hotelId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (hotelId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + totalImages) % totalImages,
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
              ? `发现 ${filteredHotels.length} 家精选高分酒店，Booking 评分 9.0+，携程评分 4.0+`
              : `Discover ${filteredHotels.length} handpicked hotels with Booking 9.0+ and Ctrip 4.0+ ratings`}
          </p>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        {/* 筛选工具栏 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            {/* 价格筛选按钮组 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 mr-2">
                {isZh ? '价格筛选：' : 'Price Filter:'}
              </span>
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    setSelectedPriceRange(
                      selectedPriceRange === range.label ? null : range.label
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPriceRange === range.label
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* 位置筛选下拉框 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 mr-2">
                {isZh ? '位置筛选：' : 'Location Filter:'}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{selectedLocation || (isZh ? '选择位置' : 'Select Location')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                    <button
                      onClick={() => {
                        setSelectedLocation('')
                        setShowLocationDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                        selectedLocation === '' ? 'bg-primary-50 text-primary-600' : 'text-slate-700'
                      }`}
                    >
                      {isZh ? '全部位置' : 'All Locations'}
                    </button>
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc)
                          setShowLocationDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          selectedLocation === loc ? 'bg-primary-50 text-primary-600' : 'text-slate-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 清除筛选按钮 */}
              {(selectedPriceRange || selectedLocation) && (
                <button
                  onClick={() => {
                    setSelectedPriceRange(null)
                    setSelectedLocation('')
                  }}
                  className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isZh ? '清除筛选' : 'Clear Filters'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-6">
          <span className="text-slate-600">
            {filteredHotels.length} {isZh ? '家酒店' : 'hotels found'}
          </span>
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

        {/* Hotel Cards Grid - 响应式布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const currentIdx = currentImageIndex[hotel.id] || 0
            const currentImage = hotel.images[currentIdx]

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Image Gallery */}
                <div className="h-48 relative bg-slate-100">
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
                        onClick={(e) => {
                          e.preventDefault()
                          prevImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {hotel.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentIdx ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

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
                <div className="p-4">
                  {/* 星级评分 */}
                  <div className="mb-2">
                    <StarRating rating={hotel.starRating || Math.floor(hotel.rating)} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                    {isZh ? hotel.nameZh : hotel.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                    {isZh ? hotel.name : hotel.nameZh}
                  </p>

                  <div className="flex items-center gap-1 text-slate-500 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">
                      {isZh ? hotel.locationZh : hotel.location}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {isZh ? hotel.descriptionZh : hotel.description}
                  </p>

                  {/* Ratings */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      <span className="text-sm font-bold text-green-700">
                        {hotel.bookingRating}
                      </span>
                      <span className="text-xs text-green-600">Booking</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <span className="text-sm font-bold text-blue-700">
                        {hotel.ctripRating}
                      </span>
                      <span className="text-xs text-blue-600">携程</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        ¥{hotel.price}
                      </p>
                      <p className="text-xs text-slate-500">{t('hotels.perNight')}</p>
                    </div>
                    <Link href={`/hotels/${hotel.slug}`}>
                      <span className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                        {t('hotels.viewDetails')}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {isZh ? '没有找到符合条件的酒店' : 'No hotels found matching your criteria'}
            </p>
            <button
              onClick={() => {
                setSelectedPriceRange(null)
                setSelectedLocation('')
              }}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isZh ? '清除筛选条件' : 'Clear Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
