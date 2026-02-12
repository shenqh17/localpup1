'use client'

import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, getRatingStats, convert5To10, PLATFORM_WEIGHTS } from '@/lib/rating-converter'

interface PlatformRatingBubbleProps {
  hotel: {
    bookingRating?: number
    bookingReviewCount?: number
    ctripRating?: number
    ctripReviewCount?: number
    agodaRating?: number
    agodaReviewCount?: number
    hotelscomRating?: number
    hotelscomReviewCount?: number
    fliggyRating?: number
    fliggyReviewCount?: number
    airbnbRating?: number
    airbnbReviewCount?: number
  }
}

// 平台气泡配置（椭圆胶囊形状）
const platformConfig = [
  {
    key: 'booking' as const,
    name: 'Booking',
    nameZh: 'Booking',
    color: 'from-blue-500 to-blue-600',
    getRating: (h: any) => h.bookingRating || 0,
    getReviews: (h: any) => h.bookingReviewCount || 0,
    weight: PLATFORM_WEIGHTS.booking
  },
  {
    key: 'agoda' as const,
    name: 'Agoda',
    nameZh: 'Agoda',
    color: 'from-red-500 to-red-600',
    getRating: (h: any) => h.agodaRating || 0,
    getReviews: (h: any) => h.agodaReviewCount || 0,
    weight: PLATFORM_WEIGHTS.agoda
  },
  {
    key: 'airbnb' as const,
    name: 'Airbnb',
    nameZh: 'Airbnb',
    color: 'from-rose-500 to-rose-600',
    getRating: (h: any) => h.airbnbRating || 0,
    getReviews: (h: any) => h.airbnbReviewCount || 0,
    weight: PLATFORM_WEIGHTS.airbnb
  },
  {
    key: 'ctrip' as const,
    name: 'Ctrip',
    nameZh: '携程',
    color: 'from-orange-500 to-orange-600',
    getRating: (h: any) => convert5To10(h.ctripRating || 0, 'ctrip', h.ctripReviewCount || 0),
    getReviews: (h: any) => h.ctripReviewCount || 0,
    weight: PLATFORM_WEIGHTS.ctrip
  },
  {
    key: 'fliggy' as const,
    name: 'Fliggy',
    nameZh: '飞猪',
    color: 'from-purple-500 to-purple-600',
    getRating: (h: any) => convert5To10(h.fliggyRating || 0, 'fliggy', h.fliggyReviewCount || 0),
    getReviews: (h: any) => h.fliggyReviewCount || 0,
    weight: PLATFORM_WEIGHTS.fliggy
  },
]

// 平台评分气泡（椭圆胶囊）
function PlatformPill({
  label,
  rating,
  color,
}: {
  label: string
  rating: number
  color: string
}) {
  return (
    <div
      className={`
        bg-gradient-to-r ${color}
        shadow-md
        px-2.5 py-1 rounded-full
        flex items-center gap-1.5
        whitespace-nowrap
        text-white
        text-xs
      `}
    >
      <span className="font-medium opacity-95">{label}</span>
      <span className="w-px h-3 bg-white/30" />
      <span className="font-bold">{rating > 0 ? rating.toFixed(1) : '-'}</span>
    </div>
  )
}

// Pup综合评分 - 金属勋章质感
function PupRatingBadge({ rating }: { rating: number }) {
  // 根据评分选择金属质感颜色
  const medalStyle = rating >= 9
    ? {
        gradient: 'from-amber-300 via-yellow-400 via-amber-500 to-amber-600',
        shadow: 'shadow-amber-300/50',
        ring: 'ring-yellow-400/30',
        badge: '卓越'
      }
    : rating >= 8
    ? {
        gradient: 'from-emerald-300 via-green-400 via-emerald-500 to-green-600',
        shadow: 'shadow-emerald-300/50',
        ring: 'ring-green-400/30',
        badge: '出色'
      }
    : rating >= 7
    ? {
        gradient: 'from-orange-300 via-amber-400 via-orange-500 to-orange-600',
        shadow: 'shadow-orange-300/50',
        ring: 'ring-orange-400/30',
        badge: '很好'
      }
    : {
        gradient: 'from-slate-300 via-slate-400 via-slate-500 to-slate-600',
        shadow: 'shadow-slate-300/50',
        ring: 'ring-slate-400/30',
        badge: '良好'
      }

  return (
    <div
      className={`
        bg-gradient-to-br ${medalStyle.gradient}
        ${medalStyle.shadow}
        ring-2 ${medalStyle.ring}
        px-3 py-1.5 rounded-full
        flex items-center gap-2
        whitespace-nowrap
        text-white
        relative
        overflow-hidden
      `}
    >
      {/* 多层金属光泽效果 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-bl from-black/10 via-transparent to-transparent" />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />

      {/* Pup徽章 */}
      <div className="relative z-10 flex items-center gap-1.5">
        <span className="text-[10px] font-bold tracking-wider drop-shadow-md">
          Pup{medalStyle.badge}
        </span>
        <span className="w-px h-4 bg-white/50" />
        <span className="font-bold text-sm drop-shadow-md">{rating.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default function PlatformRatingBubbles({ hotel }: PlatformRatingBubbleProps) {
  const { locale } = useI18n()
  const isZh = locale === 'zh'

  // 使用加权综合评分算法
  const pupRating = calculateWeightedScore(hotel)

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {/* Pup综合评分 - 金属勋章 */}
      <PupRatingBadge rating={pupRating} />

      {/* 七个平台评分气泡 */}
      {platformConfig.map((platform) => {
        const rating = platform.getRating(hotel)
        if (rating <= 0) return null

        return (
          <PlatformPill
            key={platform.key}
            label={isZh ? platform.nameZh : platform.name}
            rating={rating}
            color={platform.color}
          />
        )
      })}
    </div>
  )
}
