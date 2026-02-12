'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Filter, ChevronLeft, ChevronRight, ChevronDown, X, SortAsc, Building2 } from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'
import { getSortedHotels, calculateOverallRating } from '@/data/hotel-utils'
import CompactRatingBubbles from '@/components/CompactRatingBubbles'

// 星级评分组件
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
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

// 根据价格获取酒店类型
function getHotelTypeByPrice(price: number): string {
  if (price >= 1500) return 'luxury'
  if (price >= 800) return 'premium'
  if (price >= 400) return 'midscale'
  if (price >= 200) return 'budget'
  return 'homestay'
}

// 酒店类型标签
const hotelTypes = [
  { key: 'luxury', labelZh: '豪华', labelEn: 'Luxury', minPrice: 1500, maxPrice: Infinity, color: 'bg-purple-500' },
  { key: 'premium', labelZh: '高端', labelEn: 'Premium', minPrice: 800, maxPrice: 1500, color: 'bg-indigo-500' },
  { key: 'midscale', labelZh: '中端', labelEn: 'Midscale', minPrice: 400, maxPrice: 800, color: 'bg-blue-500' },
  { key: 'budget', labelZh: '经济', labelEn: 'Budget', minPrice: 200, maxPrice: 400, color: 'bg-green-500' },
  { key: 'homestay', labelZh: '民宿', labelEn: 'Homestay', minPrice: 0, maxPrice: 200, color: 'bg-amber-500' },
]

export default function HotelsPage() {
  const { t, locale } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  
  // 筛选状态
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedHotelType, setSelectedHotelType] = useState<string | null>(null)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'>('recommended')
  
  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)

  const isZh = locale === 'zh'

  // 价格区间（新需求：¥0-300/300-600/600-1000/1000+）
  const priceRanges = [
    { label: isZh ? '¥0-300' : '¥0-300', min: 0, max: 300, color: 'bg-green-500', textColor: 'text-green-600', gradient: 'from-green-400 to-green-600' },
    { label: isZh ? '¥300-600' : '¥300-600', min: 300, max: 600, color: 'bg-blue-500', textColor: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
    { label: isZh ? '¥600-1000' : '¥600-1000', min: 600, max: 1000, color: 'bg-orange-500', textColor: 'text-orange-600', gradient: 'from-orange-400 to-orange-600' },
    { label: isZh ? '¥1000+' : '¥1000+', min: 1000, max: Infinity, color: 'bg-red-500', textColor: 'text-red-600', gradient: 'from-red-400 to-red-600' },
  ]

  // 评分筛选选项（10分制：9.0+/8.0+/7.0+）
  const ratingOptions = [
    { label: isZh ? '全部' : 'All', value: null },
    { label: '9.0+', value: 9.0 },
    { label: '8.0+', value: 8.0 },
    { label: '7.0+', value: 7.0 },
  ]

  // 位置选项（匹配数据中的实际位置）
  const locations = [
    { value: 'westlake', labelZh: '西湖', labelEn: 'West Lake', keywords: ['西湖', 'West Lake', 'Xihu'] },
    { value: 'qianjiang', labelZh: '钱江新城', labelEn: 'Qianjiang CBD', keywords: ['钱江', 'Qianjiang', 'CBD', '江干'] },
    { value: 'binjiang', labelZh: '滨江', labelEn: 'Binjiang', keywords: ['滨江', 'Binjiang', '滨江区'] },
    { value: 'wulin', labelZh: '武林', labelEn: 'Wulin', keywords: ['武林', 'Wulin', '下城'] },
    { value: 'lingyin', labelZh: '灵隐寺', labelEn: 'Lingyin Temple', keywords: ['灵隐', 'Lingyin', '飞来峰'] },
    { value: 'other', labelZh: '其他', labelEn: 'Others', keywords: [] },
  ]

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 筛选后的酒店列表 - 使用排序后的数据
  const filteredHotels = useMemo(() => {
    const sortedHotels = getSortedHotels(hotels) // 按评分从高到低排序
    let result = sortedHotels.filter((hotel) => {
      // 价格筛选
      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.label === selectedPriceRange)
        if (range && (hotel.price < range.min || hotel.price >= range.max)) {
          return false
        }
      }
      
      // 位置筛选
      if (selectedLocation) {
        const locConfig = locations.find(l => l.value === selectedLocation)
        if (locConfig) {
          const hotelLocationText = `${hotel.location} ${hotel.locationZh || ''}`.toLowerCase()
          const keywordMatch = locConfig.keywords.some(keyword =>
            hotelLocationText.includes(keyword.toLowerCase())
          )
          if (selectedLocation === 'other') {
            // "其他"：排除已知位置
            const knownKeywords = locations.filter(l => l.value !== 'other').flatMap(l => l.keywords)
            const isKnown = knownKeywords.some(keyword =>
              hotelLocationText.includes(keyword.toLowerCase())
            )
            if (isKnown) return false
          } else {
            // 正常筛选：匹配关键词
            if (!keywordMatch) return false
          }
        }
      }
      
      // 评分筛选
      if (selectedRating && hotel.rating < selectedRating) {
        return false
      }

      // 酒店类型筛选
      if (selectedHotelType) {
        const hotelType = getHotelTypeByPrice(hotel.price)
        if (hotelType !== selectedHotelType) {
          return false
        }
      }
      
      return true
    })

    // 排序
    switch (sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        result = result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // 推荐排序：精选优先，然后按评分
        result = result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
    }

    return result
  }, [selectedPriceRange, selectedLocation, selectedRating, selectedHotelType, sortBy, isZh])

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

  // 获取价格标签颜色和样式（新需求：绿/蓝/橙/红）
  const getPriceTagStyle = (price: number) => {
    if (price < 300) return { bg: 'bg-green-500', shadow: 'shadow-green-200', ring: 'ring-green-100', gradient: 'from-green-400 to-green-600' }
    if (price < 600) return { bg: 'bg-blue-500', shadow: 'shadow-blue-200', ring: 'ring-blue-100', gradient: 'from-blue-400 to-blue-600' }
    if (price < 1000) return { bg: 'bg-orange-500', shadow: 'shadow-orange-200', ring: 'ring-orange-100', gradient: 'from-orange-400 to-orange-600' }
    return { bg: 'bg-red-500', shadow: 'shadow-red-200', ring: 'ring-red-100', gradient: 'from-red-400 to-red-600' }
  }

  const hasActiveFilters = selectedPriceRange || selectedLocation || selectedRating || selectedHotelType

  // 获取当前选中的位置标签
  const selectedLocationLabel = selectedLocation
    ? (isZh ? locations.find(l => l.value === selectedLocation)?.labelZh : locations.find(l => l.value === selectedLocation)?.labelEn)
    : (isZh ? '选择位置' : 'Select Location')

  // 获取当前选中的类型标签
  const selectedTypeLabel = selectedHotelType
    ? (isZh ? hotelTypes.find(t => t.key === selectedHotelType)?.labelZh : hotelTypes.find(t => t.key === selectedHotelType)?.labelEn)
    : (isZh ? '酒店类型' : 'Hotel Type')

  // 清除所有筛选
  const clearAllFilters = () => {
    setSelectedPriceRange(null)
    setSelectedLocation('')
    setSelectedRating(null)
    setSelectedHotelType(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('common.hotelsInHangzhou')}
          </h1>
          <p className="text-slate-600">
            {isZh
              ? `发现 ${filteredHotels.length} ${t('common.discoverHotels')}`
              : `${filteredHotels.length} ${t('common.discoverHotels')}`}
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
                {t('hotels.filter.price')}
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedPriceRange === range.label
                        ? `${range.color} text-white shadow-lg scale-105 ring-2 ring-offset-2 ${range.color.replace('bg-', 'ring-')}-200`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {range.label}
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
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() =>
                      setSelectedLocation(
                        selectedLocation === loc.value ? '' : loc.value
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedLocation === loc.value
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 scale-105 ring-2 ring-primary-100 ring-offset-2'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {isZh ? loc.labelZh : loc.labelEn}
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
                    key={option.label}
                    onClick={() =>
                      setSelectedRating(
                        selectedRating === option.value ? null : option.value
                      )
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedRating === option.value
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105 ring-2 ring-amber-100 ring-offset-2'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {option.value && <Star className="w-3.5 h-3.5 fill-current" />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 酒店类型筛选 */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2 min-w-fit">
                <Building2 className="w-4 h-4" />
                {isZh ? '类型' : 'Type'}
              </span>
              <div className="flex flex-wrap gap-2">
                {hotelTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() =>
                      setSelectedHotelType(
                        selectedHotelType === type.key ? null : type.key
                      )
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedHotelType === type.key
                        ? `${type.color} text-white shadow-lg scale-105 ring-2 ring-offset-2 ${type.color.replace('bg-', 'ring-')}-200`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    {isZh ? type.labelZh : type.labelEn}
                  </button>
                ))}
              </div>
              
              {/* 清除筛选按钮 */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-full transition-all ml-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  {t('common.clearAll')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sort Bar + 搜索结果计数 */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-6 border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900">{filteredHotels.length}</span>
            <span className="text-slate-600 font-medium">
              {t('common.hotelsFound')}
            </span>
            {hasActiveFilters && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {t('common.filtersActive')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border-none bg-slate-100 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2 cursor-pointer"
            >
              <option value="recommended">{t('hotels.filter.recommended')}</option>
              <option value="price-asc">{t('hotels.filter.priceLowHigh')}</option>
              <option value="price-desc">{t('hotels.filter.priceHighLow')}</option>
              <option value="rating-desc">{t('hotels.filter.ratingHighLow')}</option>
            </select>
          </div>
        </div>

        {/* Hotel Cards Grid - 响应式布局：手机1列/平板2列/桌面3列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => {
            const currentIdx = currentImageIndex[hotel.id] || 0
            const currentImage = hotel.images[currentIdx]
            const priceStyle = getPriceTagStyle(hotel.price)
            const hotelType = hotelTypes.find(t => t.key === getHotelTypeByPrice(hotel.price))

            return (
              <Link 
                key={hotel.id} 
                href={`/hotels/${hotel.slug}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Gallery */}
                <div className="h-52 relative bg-slate-100 overflow-hidden">
                  <Image
                    src={currentImage?.url || hotel.image}
                    alt={isZh ? hotel.nameZh || hotel.name : hotel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* 渐变遮罩 - 悬浮时显示 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* 醒目的价格标签（绿/蓝/橙/红） */}
                  <div className={`absolute top-3 right-3 bg-gradient-to-r ${priceStyle.gradient} text-white px-3 py-1.5 rounded-full shadow-lg ${priceStyle.shadow} z-10 transform group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-sm font-bold">¥{hotel.price}</span>
                    <span className="text-xs opacity-90">{t('common.perNight')}</span>
                  </div>

                  {/* 酒店类型标签 */}
                  {hotelType && (
                    <div className={`absolute top-3 left-3 ${hotelType.color} text-white px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      {isZh ? hotelType.labelZh : hotelType.labelEn}
                    </div>
                  )}

                  {/* 精选标签 */}
                  {hotel.featured && (
                    <div className="absolute bottom-3 left-3 transform group-hover:scale-105 transition-transform duration-300">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-200">
                        ⭐ {t('common.featured')}
                      </span>
                    </div>
                  )}

                  {/* Image Navigation - 悬浮时显示 */}
                  {hotel.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          prevImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextImage(hotel.id, hotel.images.length)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {hotel.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentIdx ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {currentIdx + 1} / {hotel.images.length}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* 星级评分可视化 - 增强版 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        <StarRating rating={hotel.rating} size="sm" />
                        <span className="text-sm font-bold text-amber-700">{hotel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {hotel.reviewCount?.toLocaleString()} {t('common.reviews')}
                    </span>
                  </div>

                  {/* 酒店名称 */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
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

                  {/* 平台评分 - 使用新组件 */}
                  <div className="mb-4">
                    <CompactRatingBubbles hotel={hotel} showPup={true} />
                  </div>

                  {/* 设施标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities?.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">¥{hotel.price}</span>
                      <span className="text-xs text-slate-500">{t('common.perNight')}</span>
                    </div>
                    <span className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg group-hover:bg-primary-600 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-primary-200 transform group-hover:translate-x-0.5">
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
              {t('common.noResults')}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {t('common.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
