'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'

// 星级评分组件
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'xs' | 'sm' | 'md' }) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  }
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating)
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
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  
  // 筛选状态
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const isZh = locale === 'zh'

  // 价格区间（按用户要求）
  const priceRanges = [
    { label: '¥0-300', min: 0, max: 300, color: 'bg-green-500' },
    { label: '¥300-800', min: 300, max: 800, color: 'bg-blue-500' },
    { label: '¥800-1500', min: 800, max: 1500, color: 'bg-orange-500' },
    { label: '¥1500+', min: 1500, max: Infinity, color: 'bg-red-500' },
  ]

  // 评分筛选选项
  const ratingOptions = [
    { label: '4.5+', value: 4.5 },
    { label: '4.0+', value: 4.0 },
    { label: '3.5+', value: 3.5 },
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
      
      // 评分筛选
      if (selectedRating && hotel.rating < selectedRating) {
        return false
      }
      
      return true
    })
  }, [selectedPriceRange, selectedLocation, selectedRating, isZh])

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

  // 获取价格标签颜色和样式
  const getPriceTagStyle = (price: number) => {
    if (price < 300) return { bg: 'bg-green-500', shadow: 'shadow-green-200' }
    if (price < 800) return { bg: 'bg-blue-500', shadow: 'shadow-blue-200' }
    if (price < 1500) return { bg: 'bg-orange-500', shadow: 'shadow-orange-200' }
    return { bg: 'bg-red-500', shadow: 'shadow-red-200' }
  }

  const hasActiveFilters = selectedPriceRange || selectedLocation || selectedRating

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
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-slate-100">
          <div className="flex flex-col gap-5">
            {/* 价格筛选按钮组 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2 min-w-fit">
                <Filter className="w-4 h-4" />
                {isZh ? '价格' : 'Price'}
              </span>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === range.label ? null : range.label
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedPriceRange === range.label
                        ? `${range.color} text-white shadow-lg scale-105`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 评分筛选 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2 min-w-fit">
                <Star className="w-4 h-4" />
                {isZh ? '评分' : 'Rating'}
              </span>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSelectedRating(
                        selectedRating === option.value ? null : option.value
                      )
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedRating === option.value
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 位置筛选 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2 min-w-fit">
                <MapPin className="w-4 h-4" />
                {isZh ? '位置' : 'Location'}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedLocation
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                  }`}
                >
                  <span>{selectedLocation || (isZh ? '选择位置' : 'Select Location')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setSelectedLocation('')
                        setShowLocationDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        selectedLocation === '' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-slate-700 hover:bg-slate-50'
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
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          selectedLocation === loc ? 'bg-primary-50 text-primary-600 font-medium' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 清除筛选按钮 */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedPriceRange(null)
                    setSelectedLocation('')
                    setSelectedRating(null)
                  }}
                  className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-full transition-all"
                >
                  {isZh ? '清除全部' : 'Clear All'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-6 border border-slate-100">
          <span className="text-slate-600 font-medium">
            {filteredHotels.length} {isZh ? '家酒店' : 'hotels found'}
          </span>
          <div className="flex items-center gap-2">
            <select className="text-sm border-none bg-slate-100 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2 cursor-pointer">
              <option>{isZh ? '推荐排序' : 'Recommended'}</option>
              <option>{isZh ? '价格：低到高' : 'Price: Low to High'}</option>
              <option>{isZh ? '价格：高到低' : 'Price: High to Low'}</option>
              <option>{isZh ? '评分：高到低' : 'Rating: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const currentIdx = currentImageIndex[hotel.id] || 0
            const currentImage = hotel.images[currentIdx]
            const priceStyle = getPriceTagStyle(hotel.price)

            return (
              <Link 
                key={hotel.id} 
                href={`/hotels/${hotel.slug}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100"
              >
                {/* Image Gallery */}
                <div className="h-52 relative bg-slate-100 overflow-hidden">
                  <Image
                    src={currentImage.url}
                    alt={isZh ? hotel.nameZh || hotel.name : hotel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* 醒目的价格标签 */}
                  <div className={`absolute top-3 right-3 ${priceStyle.bg} text-white px-3 py-1.5 rounded-full shadow-lg ${priceStyle.shadow} z-10`}>
                    <span className="text-sm font-bold">¥{hotel.price}</span>
                    <span className="text-xs opacity-90">{isZh ? '/晚' : '/nt'}</span>
                  </div>

                  {/* 精选标签 */}
                  {hotel.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-200">
                        {isZh ? '⭐ 精选' : '⭐ Featured'}
                      </span>
                    </div>
                  )}

                  {/* Image Navigation */}
                  {hotel.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          prevImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {hotel.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === currentIdx ? 'bg-white w-3' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    {currentIdx + 1} / {hotel.images.length}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* 星级评分可视化 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={hotel.rating} size="sm" />
                      <span className="text-sm font-semibold text-slate-700">{hotel.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {hotel.reviewCount.toLocaleString()} {isZh ? '评价' : 'reviews'}
                    </span>
                  </div>

                  {/* 酒店名称 */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {isZh ? hotel.nameZh : hotel.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1 mb-3">
                    {isZh ? hotel.name : hotel.nameZh}
                  </p>

                  {/* 位置 */}
                  <div className="flex items-center gap-1.5 text-slate-500 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-primary-500" />
                    <span className="text-sm line-clamp-1">
                      {isZh ? hotel.locationZh : hotel.location}
                    </span>
                  </div>

                  {/* 平台评分 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                      <span className="text-sm font-bold text-blue-700">
                        {hotel.bookingRating}
                      </span>
                      <span className="text-xs text-blue-600">Booking</span>
                    </div>
                    <div className="flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-lg">
                      <span className="text-sm font-bold text-sky-700">
                        {hotel.ctripRating}
                      </span>
                      <span className="text-xs text-sky-600">{isZh ? '携程' : 'Ctrip'}</span>
                    </div>
                  </div>

                  {/* 设施标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">¥{hotel.price}</span>
                      <span className="text-xs text-slate-500">{t('hotels.perNight')}</span>
                    </div>
                    <span className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg group-hover:bg-primary-600 transition-colors shadow-md group-hover:shadow-lg">
                      {t('hotels.viewDetails')}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* No Results */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg mb-4">
              {isZh ? '没有找到符合条件的酒店' : 'No hotels found matching your criteria'}
            </p>
            <button
              onClick={() => {
                setSelectedPriceRange(null)
                setSelectedLocation('')
                setSelectedRating(null)
              }}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {isZh ? '清除筛选条件' : 'Clear All Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
