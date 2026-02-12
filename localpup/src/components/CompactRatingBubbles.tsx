'use client'

import { Star, Award, TrendingUp } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, convert5To10 } from '@/lib/rating-converter'
import { Hotel } from '@/data/hotels100'

interface CompactRatingBubblesProps {
  hotel: Hotel
  showPup?: boolean
}

export default function CompactRatingBubbles({ hotel, showPup = true }: CompactRatingBubblesProps) {
  const { isZh } = useI18n()
  
  // 计算加权综合评分
  const weightedScore = calculateWeightedScore(hotel)
  
  // 平台配置
  const platforms = [
    {
      key: 'pup',
      name: 'Pup',
      nameZh: 'Pup',
      rating: weightedScore,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
      borderColor: 'border-amber-400/30',
      icon: '🏆',
      scale: '10',
      show: showPup
    },
    {
      key: 'booking',
      name: 'Booking',
      nameZh: 'Booking',
      rating: hotel.bookingRating,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      borderColor: 'border-blue-400/30',
      icon: '🌐',
      scale: '10',
      show: hotel.bookingRating && hotel.bookingRating > 0
    },
    {
      key: 'agoda',
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-red-500 to-orange-500',
      borderColor: 'border-red-400/30',
      icon: '🏨',
      scale: '10',
      show: hotel.agodaRating && hotel.agodaRating > 0
    },
    {
      key: 'hotelscom',
      name: 'Hotels',
      nameZh: 'Hotels',
      rating: hotel.hotelscomRating,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500',
      borderColor: 'border-green-400/30',
      icon: '🏠',
      scale: '10',
      show: hotel.hotelscomRating && hotel.hotelscomRating > 0
    },
    {
      key: 'ctrip',
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating,
      convertedRating: hotel.ctripRating ? convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount) : 0,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-500 to-amber-500',
      borderColor: 'border-orange-400/30',
      icon: '✈️',
      scale: '5',
      show: hotel.ctripRating && hotel.ctripRating > 0
    },
    {
      key: 'fliggy',
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: hotel.fliggyRating,
      convertedRating: hotel.fliggyRating ? convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount) : 0,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-gradient-to-br from-purple-500 to-violet-500',
      borderColor: 'border-purple-400/30',
      icon: '🐷',
      scale: '5',
      show: hotel.fliggyRating && hotel.fliggyRating > 0
    }
  ]
  
  // 过滤显示的平台
  const visiblePlatforms = platforms.filter(p => p.show)
  
  return (
    <div className="flex flex-col gap-2">
      {/* 平台标签已移除 */}
      
      {/* 紧凑气泡行 */}
      <div className="flex flex-wrap gap-1.5">
        {visiblePlatforms.map((platform) => {
          const displayRating = platform.scale === '5' && platform.convertedRating 
            ? platform.convertedRating 
            : platform.rating
          
          const displayScale = platform.key === 'pup' ? '10' : platform.scale
          
          return (
            <div
              key={platform.key}
              className={`
                relative group
                w-14 h-14 rounded-xl
                ${platform.bgColor}
                border ${platform.borderColor}
                flex flex-col items-center justify-center
                shadow-md hover:shadow-lg
                transition-all duration-200
                hover:scale-105 hover:z-10
                before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-br before:from-white/10 before:to-transparent
                before:opacity-40
                after:absolute after:inset-0 after:rounded-xl
                after:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_70%)]
                after:opacity-30
              `}
            >
              {/* 平台图标 */}
              <div className="text-xs mb-0.5 z-10">{platform.icon}</div>
              
              {/* 评分 */}
              <div className="text-white font-bold text-sm leading-tight z-10">
                {displayRating ? displayRating.toFixed(1) : 'N/A'}
              </div>
              
              {/* 评分制式 */}
              <div className="text-white/80 text-[10px] z-10">
                /{displayScale}
              </div>
              
              {/* Pup角标 */}
              {platform.key === 'pup' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 
                  bg-gradient-to-br from-primary-500 to-accent-500 
                  rounded-full flex items-center justify-center
                  text-white text-[8px] font-bold
                  border border-white/50">
                  pup
                </div>
              )}
              
              {/* 悬停提示 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                bg-gradient-to-br from-slate-900 to-slate-800 text-white text-xs
                px-3 py-1.5 rounded-lg whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                shadow-lg border border-slate-700/50 pointer-events-none
                z-20">
                <div className="font-medium">
                  {isZh ? platform.nameZh : platform.name}
                </div>
                <div className="text-slate-300 text-[10px]">
                  {platform.scale === '5' && platform.rating ? 
                    `${platform.rating.toFixed(1)}/5 → ${displayRating.toFixed(1)}/10` :
                    `${displayRating.toFixed(1)}/10`
                  }
                </div>
              </div>
              
              {/* 金属光泽效果 */}
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* 平台数量提示 */}
      {visiblePlatforms.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{isZh ? '综合评分' : 'Composite Score'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>{visiblePlatforms.length} {isZh ? '个平台' : 'platforms'}</span>
          </div>
        </div>
      )}
      
      {/* 样式定义 */}
      <style jsx>{`
        .group:hover .hover-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}