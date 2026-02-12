'use client'

import { Star, Globe, TrendingUp } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface HotelRatingDisplayProps {
  hotel: {
    bookingRating: number
    bookingReviewCount: number
    ctripRating: number
    ctripReviewCount: number
    rating: number
    reviewCount: number
    agodaRating?: number
    agodaReviewCount?: number
    hotelscomRating?: number
    hotelscomReviewCount?: number
    fliggyRating?: number
    fliggyReviewCount?: number
  }
  compact?: boolean
}

export default function HotelRatingDisplay({ hotel, compact = false }: HotelRatingDisplayProps) {
  const { t } = useI18n()
  
  // 全球前三预订平台
  const globalPlatforms = [
    {
      name: 'Booking.com',
      nameZh: 'Booking.com',
      rating: hotel.bookingRating,
      reviewCount: hotel.bookingReviewCount,
      color: 'bg-blue-500',
      icon: '🌐',
      isGlobal: true,
      available: true
    },
    {
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating || 0,
      reviewCount: hotel.agodaReviewCount || 0,
      color: 'bg-red-500',
      icon: '🏨',
      isGlobal: true,
      available: !!hotel.agodaRating
    },
    {
      name: 'Hotels.com',
      nameZh: 'Hotels.com',
      rating: hotel.hotelscomRating || 0,
      reviewCount: hotel.hotelscomReviewCount || 0,
      color: 'bg-green-500',
      icon: '🏠',
      isGlobal: true,
      available: !!hotel.hotelscomRating
    }
  ]
  
  // 国内平台
  const domesticPlatforms = [
    {
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating,
      reviewCount: hotel.ctripReviewCount,
      color: 'bg-orange-500',
      icon: '✈️',
      isGlobal: false,
      available: true
    },
    {
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: hotel.fliggyRating || 0,
      reviewCount: hotel.fliggyReviewCount || 0,
      color: 'bg-purple-500',
      icon: '🐷',
      isGlobal: false,
      available: !!hotel.fliggyRating
    }
  ]
  
  // 计算综合评分
  const calculateOverallRating = () => {
    const ratings = [
      hotel.bookingRating,
      hotel.agodaRating || 0,
      hotel.hotelscomRating || 0,
      hotel.ctripRating * 2, // 国内平台权重加倍
      (hotel.fliggyRating || 0) * 2
    ]
    const total = ratings.reduce((sum, rating) => sum + rating, 0)
    return (total / (ratings.length + 2)).toFixed(1) // 国内平台权重已加倍
  }
  
  const overallRating = calculateOverallRating()
  
  // 过滤可用的平台
  const availableGlobalPlatforms = globalPlatforms.filter(p => p.available)
  const availableDomesticPlatforms = domesticPlatforms.filter(p => p.available)
  
  // 星级显示组件
  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'xs' | 'sm' | 'md' | 'lg' }) => {
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
              star <= Math.round(rating / 2) // 10分制转5星制
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
    )
  }
  
  // 平台评分项
  const PlatformRatingItem = ({ 
    platform, 
    isGlobal = false 
  }: { 
    platform: typeof globalPlatforms[0]
    isGlobal?: boolean 
  }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isGlobal ? 'bg-blue-50' : 'bg-orange-50'} border ${isGlobal ? 'border-blue-100' : 'border-orange-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white font-bold`}>
          {platform.icon}
        </div>
        <div>
          <div className="font-semibold text-slate-900">{t('common.locale') === 'zh' ? platform.nameZh : platform.name}</div>
          <div className="text-sm text-slate-500">
            {platform.reviewCount.toLocaleString()} {t('hotels.reviews')}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-slate-900">{platform.rating.toFixed(1)}</div>
          <div className="text-sm text-slate-500">/10</div>
        </div>
        <div className="mt-1">
          <StarRating rating={platform.rating} size="xs" />
        </div>
      </div>
    </div>
  )
  
  if (compact) {
    return (
      <div className="flex items-center gap-4">
        {/* 综合评分 */}
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">{overallRating}</div>
          <div className="text-sm text-slate-500">{t('hotels.overallRating')}</div>
          <div className="mt-1">
            <StarRating rating={parseFloat(overallRating) * 2} size="xs" />
          </div>
        </div>
        
        {/* 平台评分摘要 */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {/* 全球平台 */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {t('hotels.globalPlatforms')}
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {availableGlobalPlatforms.map(p => p.rating.toFixed(1)).join(' / ')}
              </div>
            </div>
            
            {/* 国内平台 */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {t('hotels.domesticPlatforms')}
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {availableDomesticPlatforms.map(p => p.rating.toFixed(1)).join(' / ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* 综合评分卡片 */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-primary-700">{t('hotels.overallRating')}</div>
            <div className="text-4xl font-bold text-slate-900 mt-1">{overallRating}</div>
            <div className="text-sm text-slate-600 mt-2">
              {t('hotels.basedOn')} {hotel.reviewCount.toLocaleString()} {t('hotels.reviews')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl">
              <StarRating rating={parseFloat(overallRating) * 2} size="lg" />
            </div>
            <div className="text-sm text-slate-600 mt-2">{t('hotels.outOf5Stars')}</div>
          </div>
        </div>
      </div>
      
      {/* 全球平台评分 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">{t('hotels.globalPlatformRatings')}</h3>
        </div>
        <div className="space-y-3">
          {availableGlobalPlatforms.map((platform) => (
            <PlatformRatingItem key={platform.name} platform={platform} isGlobal />
          ))}
        </div>
      </div>
      
      {/* 国内平台评分 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-900">{t('hotels.domesticPlatformRatings')}</h3>
        </div>
        <div className="space-y-3">
          {availableDomesticPlatforms.map((platform) => (
            <PlatformRatingItem key={platform.name} platform={platform} />
          ))}
        </div>
      </div>
      
      {/* 评分说明 */}
      <div className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg">
        <p className="font-medium text-slate-700 mb-1">{t('hotels.ratingExplanation')}</p>
        <p>{t('hotels.ratingExplanationDetail')}</p>
      </div>
    </div>
  )
}