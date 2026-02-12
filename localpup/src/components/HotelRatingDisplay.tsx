'use client'

import { useMemo } from 'react'
import { Star, Globe, TrendingUp, Award, Shield, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'
import { Hotel } from '@/data/hotels100'
import { calculateWeightedScore, getRatingStats, convert5To10 } from '@/lib/rating-converter'
import MetalPupRating from './MetalPupRating'

interface HotelRatingDisplayProps {
  hotel: Hotel
  compact?: boolean
}

export default function HotelRatingDisplay({ hotel, compact = false }: HotelRatingDisplayProps) {
  const { t, locale } = useI18n()
  const isZh = locale === 'zh'

  // 计算加权综合评分
  const ratingStats = useMemo(() => getRatingStats(hotel), [hotel])
  const weightedScore = ratingStats.weightedScore
  const availablePlatforms = ratingStats.availablePlatforms
  const totalReviews = ratingStats.totalReviews

  // 平台配置
  const platformConfigs = [
    {
      key: 'booking',
      name: 'Booking.com',
      nameZh: 'Booking.com',
      rating: hotel.bookingRating,
      reviewCount: hotel.bookingReviewCount,
      color: 'from-blue-500 to-cyan-500',
      icon: '🌐',
      weight: 1.0,
      scale: '10分制'
    },
    {
      key: 'agoda',
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating,
      reviewCount: hotel.agodaReviewCount,
      color: 'from-red-500 to-orange-500',
      icon: '🏨',
      weight: 0.9,
      scale: '10分制'
    },
    {
      key: 'hotelscom',
      name: 'Hotels.com',
      nameZh: 'Hotels.com',
      rating: hotel.hotelscomRating,
      reviewCount: hotel.hotelscomReviewCount,
      color: 'from-green-500 to-emerald-500',
      icon: '🏠',
      weight: 0.85,
      scale: '10分制'
    },
    {
      key: 'airbnb',
      name: 'Airbnb',
      nameZh: '爱彼迎',
      rating: hotel.airbnbRating,
      reviewCount: hotel.airbnbReviewCount,
      color: 'from-rose-500 to-pink-500',
      icon: '🏡',
      weight: 0.8,
      scale: '10分制'
    },
    {
      key: 'ctrip',
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating,
      reviewCount: hotel.ctripReviewCount,
      color: 'from-orange-500 to-amber-500',
      icon: '✈️',
      weight: 1.1,
      scale: '5分制',
      convertedRating: hotel.ctripRating ? convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount) : 0
    },
    {
      key: 'fliggy',
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: hotel.fliggyRating,
      reviewCount: hotel.fliggyReviewCount,
      color: 'from-purple-500 to-violet-500',
      icon: '🐷',
      weight: 1.0,
      scale: '5分制',
      convertedRating: hotel.fliggyRating ? convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount) : 0
    }
  ]

  // 过滤有评分的平台
  const availablePlatformsList = platformConfigs.filter(p => p.rating && p.rating > 0)

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
              star <= Math.round(rating / 2)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* 金属质感Pup评分 */}
        <MetalPupRating hotel={hotel} size="sm" />
        
        {/* 平台评分气泡 */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {availablePlatformsList.slice(0, 3).map((platform) => (
              <div
                key={platform.key}
                className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${platform.color} text-white text-sm font-medium
                  flex items-center gap-1.5 shadow-sm`}
              >
                <span>{platform.icon}</span>
                <span className="font-bold">
                  {platform.scale === '5分制' ? platform.rating?.toFixed(1) : platform.rating?.toFixed(1)}
                </span>
                <span className="text-xs opacity-90">/{
                  platform.scale === '5分制' ? '5' : '10'
                }</span>
              </div>
            ))}
            {availablePlatformsList.length > 3 && (
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium">
                +{availablePlatformsList.length - 3} {isZh ? '更多' : 'more'}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧：金属质感Pup评分 */}
        <div className="lg:w-1/3">
          <div className="flex flex-col items-center">
            <MetalPupRating hotel={hotel} size="lg" showDetails={true} />
            
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isZh ? 'Pup综合评分' : 'Pup Composite Score'}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {isZh 
                  ? '基于7大平台智能加权计算，每周自动更新'
                  : 'Intelligently weighted from 7 platforms, updated weekly'
                }
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">{availablePlatforms}</div>
                  <div className="text-xs text-blue-600 font-medium">
                    {isZh ? '数据平台' : 'Platforms'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-700">
                    {totalReviews > 1000 ? `${(totalReviews/1000).toFixed(1)}k` : totalReviews}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    {isZh ? '总评论' : 'Reviews'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：7平台详细评分 */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isZh ? '多平台评分详情' : 'Multi-Platform Ratings'}
              </h2>
              <p className="text-slate-600 mt-1">
                {isZh ? '来自全球主流预订平台的真实用户评分' : 'Real user ratings from global booking platforms'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2 rounded-full">
              <Award className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-700">{availablePlatforms}/7</span>
              <span className="text-sm text-primary-600">{isZh ? '平台覆盖' : 'Platforms'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlatformsList.map((platform) => {
              const displayRating = platform.scale === '5分制' 
                ? platform.convertedRating 
                : platform.rating
              
              return (
                <div 
                  key={platform.key}
                  className="group bg-white hover:bg-gradient-to-r hover:from-white hover:to-slate-50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-lg`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {isZh ? platform.nameZh : platform.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={displayRating || 0} size="sm" />
                          <span className="text-sm text-slate-500">
                            {platform.scale === '5分制' ? '5分制' : '10分制'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {displayRating?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-500">
                        /{platform.scale === '5分制' ? '5' : '10'}
                        {platform.scale === '5分制' && platform.rating && (
                          <span className="text-xs text-slate-400 ml-1">
                            ({platform.rating.toFixed(1)})
                          </span>
                        )}
                      </div>
                      {platform.reviewCount && platform.reviewCount > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          {platform.reviewCount.toLocaleString()} {isZh ? '条评论' : 'reviews'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 平台权重指示器 */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{isZh ? '算法权重' : 'Algorithm Weight'}</span>
                      <span className="font-medium">{platform.weight.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${platform.color} rounded-full`}
                        style={{ width: `${platform.weight * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 算法说明 */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-slate-900">
                {isZh ? '智能评分算法说明' : 'Intelligent Rating Algorithm'}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-700 mb-1">
                  {isZh ? '平台权重' : 'Platform Weight'}
                </div>
                <div className="text-xs text-blue-600">
                  {isZh 
                    ? '基于平台权威性和用户覆盖度分配不同权重'
                    : 'Different weights based on platform authority and user coverage'
                  }
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3">
                <div className="text-sm font-medium text-emerald-700 mb-1">
                  {isZh ? '智能换算' : 'Smart Conversion'}
                </div>
                <div className="text-xs text-emerald-600">
                  {isZh 
                    ? '5分制平台使用非线性智能换算公式'
                    : 'Non-linear smart conversion for 5-point scale platforms'
                  }
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <div className="text-sm font-medium text-purple-700 mb-1">
                  {isZh ? '每周更新' : 'Weekly Updates'}
                </div>
                <div className="text-xs text-purple-600">
                  {isZh 
                    ? '评分数据每周自动更新，保持时效性'
                    : 'Ratings automatically updated weekly for freshness'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}