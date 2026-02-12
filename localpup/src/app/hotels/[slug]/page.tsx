'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Star, 
  MapPin, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  Check,
  ExternalLink,
  Heart,
  Share2,
  Bed,
  Bath,
  Wind,
  Shield,
  Clock,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import { hotels } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'
import HotelRatingDisplay from '@/components/HotelRatingDisplay'

// 设施图标映射
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Free WiFi': Wifi,
  'Pool': Waves,
  'Spa': Wind,
  'Restaurant': Utensils,
  'Gym': Dumbbell,
  'Bar': Coffee,
  'Room Service': Clock,
  'Concierge': Shield,
  'Free Parking': Car,
  'Fitness Center': Dumbbell,
  'Swimming Pool': Waves,
  'Coffee Shop': Coffee,
  'Lake View Rooms': Bed,
  'Business Center': Globe,
  'Executive Lounge': Shield,
  'Club Lounge': Shield,
  'Garden': Wind,
  'Tea House': Coffee,
  'Cultural Activities': Globe,
  'Library': BookIcon,
  'Tea Fields': Wind,
  'Viewing Deck': Bed,
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

// 平台评分配置
interface PlatformRating {
  name: string
  nameZh: string
  rating: number
  reviewCount: number
  color: string
  bgColor: string
  textColor: string
  url?: string
}

// 星级评分组件
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
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

// 相似酒店卡片组件
function SimilarHotelCard({ hotel, isZh }: { hotel: typeof hotels[0]; isZh: boolean }) {
  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={hotel.image}
            alt={isZh ? hotel.nameZh || hotel.name : hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-sm font-bold text-slate-900">¥{hotel.price}</span>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-slate-900 mb-1 line-clamp-1">
            {isZh ? hotel.nameZh : hotel.name}
          </h4>
          <p className="text-xs text-slate-500 mb-2">
            {isZh ? hotel.locationZh : hotel.location}
          </p>
          <div className="flex items-center gap-2">
            <StarRating rating={hotel.rating} size="sm" />
            <span className="text-sm font-medium text-slate-700">{hotel.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HotelDetailPage() {
  const params = useParams()
  const { locale, t } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  
  const isZh = locale === 'zh'
  const slug = params.slug as string
  
  // 查找当前酒店
  const hotel = useMemo(() => {
    return hotels.find(h => h.slug === slug) || hotels[0]
  }, [slug])
  
  // 查找相似酒店（同区域，价格相差不超过30%）
  const similarHotels = useMemo(() => {
    return hotels
      .filter(h => 
        h.id !== hotel.id && 
        h.location === hotel.location &&
        Math.abs(h.price - hotel.price) / hotel.price <= 0.5
      )
      .slice(0, 3)
  }, [hotel])
  
  // 使用联盟链接配置
  const affiliateConfig = {
    affiliateId: 'localpup',
    source: 'localpup_website',
    campaign: 'localpup_hangzhou_hotels',
  }
  
  // 构建 Booking 联盟链接
  const buildBookingUrl = (slug: string) => {
    const params = new URLSearchParams({
      aid: affiliateConfig.affiliateId,
      dest_id: '-3339992',
      dest_type: 'city',
      group_adults: '2',
      group_children: '0',
      no_rooms: '1',
      source: affiliateConfig.source,
      utm_campaign: affiliateConfig.campaign,
      utm_medium: 'referral',
    })
    return `https://www.booking.com/hotel/cn/${slug}.html?${params.toString()}`
  }
  
  // 构建携程联盟链接
  const buildCtripUrl = (hotelId: string) => {
    const params = new URLSearchParams({
      AllianceID: 'localpup',
      from: 'localpup',
      sid: hotelId,
    })
    return `https://hotels.ctrip.com/hotels/${hotelId}.html?${params.toString()}`
  }
  
  // 构建 Agoda 联盟链接
  const buildAgodaUrl = (slug: string) => {
    const params = new URLSearchParams({
      cid: 'localpup001',
      currency: 'CNY',
      device: 'desktop',
    })
    return `https://www.agoda.com/${slug}/hotel/hangzhou-cn.html?${params.toString()}`
  }
  
  // 构建 Hotels.com 联盟链接
  const buildHotelsComUrl = (hotelId: string, slug: string) => {
    return `https://www.hotels.com/ho${hotelId}/${slug}.html?IMS=${affiliateConfig.source}`
  }
  
  // 构建飞猪联盟链接
  const buildFliggyUrl = (hotelId: string) => {
    return `https://www.fliggy.com/hotel/${hotelId}.html?from=localpup_referral`
  }
  
  // 构建平台评分数据（使用联盟链接）
  const platformRatings: PlatformRating[] = [
    {
      name: 'Booking.com',
      nameZh: 'Booking.com',
      rating: hotel.bookingRating,
      reviewCount: hotel.bookingReviewCount,
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      url: buildBookingUrl(hotel.slug)
    },
    {
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating,
      reviewCount: hotel.ctripReviewCount,
      color: 'bg-sky-500',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      url: buildCtripUrl(hotel.id)
    },
    {
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: Math.min(hotel.rating + 0.1, 5),
      reviewCount: Math.floor(hotel.reviewCount * 0.6),
      color: 'bg-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      url: buildAgodaUrl(hotel.slug)
    },
    {
      name: 'Hotels.com',
      nameZh: 'Hotels.com',
      rating: Math.min(hotel.rating + 0.05, 5),
      reviewCount: Math.floor(hotel.reviewCount * 0.4),
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      url: buildHotelsComUrl(hotel.id, hotel.slug)
    },
    {
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: Math.min(hotel.ctripRating + 0.1, 5),
      reviewCount: Math.floor(hotel.ctripReviewCount * 0.5),
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      url: buildFliggyUrl(hotel.id)
    }
  ]
  
  // 图片导航
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length)
  }
  
  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isZh ? hotel.nameZh : hotel.name,
          text: isZh ? hotel.descriptionZh : hotel.description,
          url: window.location.href,
        })
      } catch {
        // 用户取消分享
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert(isZh ? '链接已复制到剪贴板' : 'Link copied to clipboard')
    }
  }
  
  // 获取设施图标
  const getAmenityIcon = (amenity: string) => {
    const Icon = amenityIcons[amenity] || Check
    return Icon
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 返回按钮和导航栏 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="section-padding py-4 max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/hotels" 
            className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {isZh ? '返回酒店列表' : 'Back to Hotels'}
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 大型图片画廊 */}
      <div className="relative">
        {/* 主图展示 */}
        <div 
          className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] bg-slate-900 cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <Image
            src={hotel.images[currentImageIndex]?.url || hotel.image}
            alt={isZh 
              ? hotel.images[currentImageIndex]?.captionZh || hotel.nameZh || hotel.name
              : hotel.images[currentImageIndex]?.caption || hotel.name
            }
            fill
            className="object-cover"
            priority
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* 图片导航按钮 */}
          {hotel.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-slate-900" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-slate-900" />
              </button>
            </>
          )}
          
          {/* 图片计数器 */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {hotel.images.length}
          </div>
          
          {/* 图片来源标注 */}
          <div className="absolute bottom-4 left-4 text-white/80 text-xs">
            {hotel.images[currentImageIndex]?.sourceAttribution}
          </div>
          
          {/* 全屏查看提示 */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {isZh ? '全屏查看' : 'Full Screen'}
          </div>
        </div>
        
        {/* 缩略图画廊 */}
        <div className="section-padding py-4 max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {hotel.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  idx === currentImageIndex 
                    ? 'ring-2 ring-primary-500 ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={isZh ? img.captionZh || img.caption : img.caption}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="section-padding py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 酒店基本信息卡片 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              {/* 名称和评分 */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      {isZh ? hotel.nameZh : hotel.name}
                    </h1>
                    <p className="text-lg text-slate-500">
                      {isZh ? hotel.name : hotel.nameZh}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl md:text-3xl font-bold text-primary-600">¥{hotel.price}</p>
                    <p className="text-sm text-slate-500">{isZh ? '每晚' : 'per night'}</p>
                  </div>
                </div>
                
                {/* 星级评分 */}
                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={hotel.rating} size="md" />
                  <span className="text-lg font-semibold text-slate-900">{hotel.rating}</span>
                  <span className="text-slate-500">
                    ({hotel.reviewCount.toLocaleString()} {isZh ? '条评价' : 'reviews'})
                  </span>
                </div>
              </div>
              
              {/* 地址 */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    {isZh ? hotel.locationZh : hotel.location}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {isZh ? '位于杭州核心区域，交通便利' : 'Located in prime Hangzhou area with convenient transportation'}
                  </p>
                </div>
              </div>
            </div>

            {/* 多平台评分对比 - 使用新组件 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {isZh ? '多平台评分对比' : 'Platform Ratings Comparison'}
              </h2>
              
              <HotelRatingDisplay hotel={hotel} compact={false} />
              
              <p className="text-sm text-slate-500 mt-6 text-center">
                {isZh 
                  ? '评分聚合自全球前三预订平台（Booking.com、Agoda、Hotels.com）和国内前二平台（携程、飞猪）' 
                  : 'Ratings aggregated from top 3 global booking platforms (Booking.com, Agoda, Hotels.com) and top 2 domestic platforms (Ctrip, Fliggy)'}
              </p>
            </div>

            {/* 设施列表 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {isZh ? '酒店设施' : 'Hotel Amenities'}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hotel.amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity)
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 酒店描述 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {isZh ? '关于酒店' : 'About This Hotel'}
              </h2>
              
              {/* 英文描述 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  English
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {hotel.description}
                </p>
              </div>
              
              {/* 中文描述 */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  中文
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {hotel.descriptionZh}
                </p>
              </div>
            </div>

            {/* 相似酒店推荐 */}
            {similarHotels.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {isZh ? '相似酒店推荐' : 'Similar Hotels'}
                </h2>
                <p className="text-slate-500 mb-6">
                  {isZh 
                    ? `更多${hotel.locationZh}区域的精选酒店` 
                    : `More curated hotels in ${hotel.location} area`}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarHotels.map((similarHotel) => (
                    <SimilarHotelCard 
                      key={similarHotel.id} 
                      hotel={similarHotel} 
                      isZh={isZh} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右侧预订侧边栏 */}
          <div className="space-y-6">
            {/* 预订卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {isZh ? '预订您的住宿' : 'Book Your Stay'}
              </h3>
              
              {/* 价格预览 */}
              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                <span className="text-3xl font-bold text-primary-600">¥{hotel.price}</span>
                <span className="text-slate-500">{isZh ? '/ 晚' : '/ night'}</span>
              </div>
              
              {/* 快速预订按钮 */}
              <div className="space-y-3">
                <a
                  href={buildBookingUrl(hotel.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Booking.com</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <a
                  href={buildCtripUrl(hotel.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <span>{isZh ? '携程' : 'Ctrip'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <a
                  href={buildAgodaUrl(hotel.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Agoda</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              {/* 服务保障 */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{isZh ? '最优价格保证' : 'Best price guarantee'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{isZh ? '免费取消' : 'Free cancellation'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{isZh ? '即时确认' : 'Instant confirmation'}</span>
                </div>
              </div>
            </div>

            {/* 联系信息卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {isZh ? '需要帮助?' : 'Need Help?'}
              </h3>
              <div className="space-y-3">
                <a 
                  href="tel:+8657188888888" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary-600" />
                  <span className="text-slate-700">+86 571 8888 8888</span>
                </a>
                <a 
                  href="mailto:support@localpup.com" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary-600" />
                  <span className="text-slate-700">support@localpup.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片全屏模态框 */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
            <Image
              src={hotel.images[currentImageIndex]?.url || hotel.image}
              alt={isZh 
                ? hotel.images[currentImageIndex]?.captionZh || hotel.nameZh || hotel.name
                : hotel.images[currentImageIndex]?.caption || hotel.name
              }
              fill
              className="object-contain"
            />
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-lg font-medium">
              {isZh 
                ? hotel.images[currentImageIndex]?.captionZh || hotel.nameZh 
                : hotel.images[currentImageIndex]?.caption || hotel.name
              }
            </p>
            <p className="text-sm text-white/70 mt-1">
              {currentImageIndex + 1} / {hotel.images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
