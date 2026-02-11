'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'

// 区域数据
const regions = [
  {
    id: 'westlake',
    name: '西湖',
    nameEn: 'West Lake',
    slug: 'west-lake',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    hotelCount: 25,
    avgPrice: 1200,
    description: '杭州的心脏，诗画江南的典范',
    features: ['西湖十景', '茶园环绕', '历史悠久']
  },
  {
    id: 'qianjiang',
    name: '钱江新城',
    nameEn: 'Qianjiang CBD',
    slug: 'qianjiang-new-city',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    hotelCount: 18,
    avgPrice: 980,
    description: '现代都市天际线，商务与休闲完美融合',
    features: ['城市景观', '购物中心', '交通便利']
  },
  {
    id: 'binjiang',
    name: '滨江',
    nameEn: 'Binjiang',
    slug: 'binjiang',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    hotelCount: 12,
    avgPrice: 650,
    description: '钱塘江畔的科技创新高地',
    features: ['江景', '科技园区', '美食天堂']
  },
  {
    id: 'wulin',
    name: '武林',
    nameEn: 'Wulin',
    slug: 'wulin',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    hotelCount: 15,
    avgPrice: 580,
    description: '杭州最繁华的商业中心',
    features: ['购物商场', '美食林立', '夜生活丰富']
  }
]

// 精选酒店数据
const featuredHotels = [
  {
    id: '1',
    name: '杭州西子湖四季酒店',
    slug: 'four-seasons-hangzhou',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.9,
    price: 2800,
    location: '西湖区',
    tags: ['豪华', '湖景']
  },
  {
    id: '2',
    name: '杭州柏悦酒店',
    slug: 'park-hyatt-hangzhou',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    rating: 4.8,
    price: 1800,
    location: '钱江新城',
    tags: ['现代', '城市景观']
  },
  {
    id: '3',
    name: '法云安缦',
    slug: 'amanfayun-hangzhou',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.9,
    price: 6500,
    location: '西湖区',
    tags: ['隐世', '禅意']
  },
  {
    id: '4',
    name: '杭州康莱德酒店',
    slug: 'conrad-hangzhou',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.7,
    price: 1200,
    location: '滨江区',
    tags: ['设计感', '江景']
  },
  {
    id: '5',
    name: '杭州香格里拉',
    slug: 'shangri-la-hangzhou',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    rating: 4.6,
    price: 950,
    location: '西湖区',
    tags: ['经典', '近西湖']
  }
]

export function Hero() {
  const { t, locale } = useI18n()
  const isZh = locale === 'zh'
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState('2')
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // 轮播状态
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return hotels.filter(hotel => 
      (isZh ? hotel.nameZh : hotel.name)?.toLowerCase().includes(query) ||
      hotel.location?.toLowerCase().includes(query) ||
      hotel.locationZh?.includes(query) ||
      hotel.amenities?.some(a => a.toLowerCase().includes(query))
    ).slice(0, 8)
  }, [searchQuery, isZh])
  
  // 搜索处理
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/hotels?q=${encodeURIComponent(searchQuery)}`
    }
  }
  
  // 键盘搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // 轮播导航
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredHotels.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredHotels.length) % featuredHotels.length)
  }
  
  // 跳转到轮播索引
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }
  
  // 获取今天的日期（最小入住日期）
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${featuredHotels[currentSlide].image})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding text-center text-white max-w-6xl mx-auto pt-24">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20 animate-fade-in">
          ✨ {isZh ? '杭州最佳酒店精选平台' : "Hangzhou's Best Hotel Selection"}
        </span>
        
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
          {isZh ? '发现杭州' : 'Discover'} <span className="text-amber-400">{isZh ? '完美住宿' : 'Perfect Stay'}</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
          {isZh 
            ? '精选杭州高分酒店，从西湖畔的传统园林到钱江新城的现代奢华，为您打造完美住宿体验'
            : 'Handpicked high-rated hotels in Hangzhou, from traditional gardens by West Lake to modern luxury in Qianjiang CBD'
          }
        </p>

        {/* Search Bar - 增强版 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-5xl mx-auto mb-10 animate-fade-in-up delay-200">
          <div className="flex flex-col gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={isZh ? '搜索酒店名称、位置或设施...' : 'Search hotel, location, or amenities...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(e.target.value.length > 0)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
              
              {/* 搜索结果下拉 */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-2">
                    <p className="text-xs text-slate-400 px-3 py-2">
                      {isZh ? `找到 ${searchResults.length} 个结果` : `${searchResults.length} results found`}
                    </p>
                    {searchResults.map((hotel) => (
                      <Link
                        key={hotel.id}
                        href={`/hotels/${hotel.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={hotel.image}
                            alt={isZh ? (hotel.nameZh || hotel.name) : hotel.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {isZh ? hotel.nameZh : hotel.name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {isZh ? hotel.locationZh : hotel.location}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary-600">¥{hotel.price}</p>
                          <p className="text-xs text-slate-400">{isZh ? '/晚' : '/nt'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/hotels?q=${encodeURIComponent(searchQuery)}`}
                    className="flex items-center justify-center gap-2 p-3 bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 transition-colors"
                    onClick={() => setShowSearchResults(false)}
                  >
                    {isZh ? '查看所有结果' : 'View all results'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
            
            {/* 日期和人数 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{isZh ? '入住日期' : 'Check-in'}</p>
                  <input
                    type="date"
                    value={checkInDate}
                    min={today}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{isZh ? '退房日期' : 'Check-out'}</p>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate || tomorrow}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <Users className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{isZh ? '住客' : 'Guests'}</p>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {isZh ? '位成人' : `${num > 1 ? 'guests' : 'guest'}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary flex items-center justify-center gap-2 py-3 sm:py-0 px-8 min-w-[120px]"
              >
                <Search className="w-5 h-5" />
                {isZh ? '搜索' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in-up delay-300">
          <span className="text-white/70 text-sm">{isZh ? '热门搜索：' : 'Popular: '}</span>
          {['西湖', '钱江新城', '武林', '滨江', '湖景', '豪华'].map((tag) => (
            <Link
              key={tag}
              href={`/hotels?q=${encodeURIComponent(tag)}`}
              className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white hover:bg-white/20 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-16 animate-fade-in-up delay-300">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">{hotels.length}+</p>
            <p className="text-white/80 text-sm">{isZh ? '精选酒店' : 'Hotels'}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">50K+</p>
            <p className="text-white/80 text-sm">{isZh ? '满意住客' : 'Guests'}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">4.8</p>
            <p className="text-white/80 text-sm">{isZh ? '平均评分' : 'Avg Rating'}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>

      {/* Featured Hotels Carousel */}
      <div className="absolute bottom-24 left-0 right-0 z-20">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Navigation Arrow */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Carousel Items */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 280}px)` }}
              >
                {featuredHotels.map((hotel, index) => (
                  <Link
                    key={hotel.id}
                    href={`/hotels/${hotel.slug}`}
                    className={`flex-shrink-0 w-64 bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
                      index === currentSlide ? 'bg-white/30 ring-2 ring-white/50' : 'hover:bg-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/30 flex-shrink-0">
                        <Image
                          src={hotel.image}
                          alt={hotel.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="text-left text-white min-w-0 flex-1">
                        <p className="font-semibold truncate text-sm">{hotel.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs">{hotel.rating}</span>
                          <span className="text-xs opacity-70">· {hotel.location}</span>
                        </div>
                        <p className="text-sm font-bold mt-1">¥{hotel.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrow */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {featuredHotels.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// 区域导航卡片组件
export function RegionCards() {
  const { locale } = useI18n()
  const isZh = locale === 'zh'
  
  return (
    <section className="py-16 bg-slate-50">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              {isZh ? '热门区域' : 'Popular Areas'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {isZh ? '探索杭州各大区域' : 'Explore Hangzhou Regions'}
            </h2>
            <p className="text-slate-600 mt-2 text-lg">
              {isZh ? '不同区域，不同风情' : 'Different areas, different charms'}
            </p>
          </div>
          <Link 
            href="/hotels"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            {isZh ? '查看全部' : 'View All'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <Link
              key={region.id}
              href={`/hotels?location=${encodeURIComponent(region.name)}`}
              className="group relative h-72 rounded-2xl overflow-hidden"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${region.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {isZh ? region.name : region.nameEn}
                  </h3>
                  <p className="text-white/80 text-sm mb-2">
                    {isZh ? region.description : region.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {region.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {region.hotelCount} {isZh ? '家酒店' : 'hotels'}
                    </span>
                    <span>
                      ¥{region.avgPrice}+ {isZh ? '起' : 'from'}
                    </span>
                  </div>
                </div>
                
                {/* Hover Effect Arrow */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl"
          >
            {isZh ? '查看所有区域' : 'View All Areas'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
