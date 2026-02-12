'use client'

import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, convert5To10 } from '@/lib/rating-converter'
import { Hotel } from '@/data/hotels100'

interface OvalRatingBubblesProps {
  hotel: Hotel
  showPup?: boolean
}

export default function OvalRatingBubbles({ hotel, showPup = true }: OvalRatingBubblesProps) {
  const { isZh } = useI18n()
  
  // 计算加权综合评分
  const weightedScore = calculateWeightedScore(hotel)
  
  // 平台配置 - 长椭圆形设计
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
      rating: hotel.bookingRating || 8.5,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      borderColor: 'border-blue-400/30',
      icon: '🌐',
      scale: '10',
      show: true
    },
    {
      key: 'agoda',
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating || 8.3,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-red-500 to-orange-500',
      borderColor: 'border-red-400/30',
      icon: '🏨',
      scale: '10',
      show: true
    },
    {
      key: 'hotelscom',
      name: 'Hotels',
      nameZh: 'Hotels',
      rating: hotel.hotelscomRating || 8.2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500',
      borderColor: 'border-green-400/30',
      icon: '🏠',
      scale: '10',
      show: true
    },
    {
      key: 'ctrip',
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating || 4.4,
      convertedRating: hotel.ctripRating ? convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount) : 8.8,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-500 to-amber-500',
      borderColor: 'border-orange-400/30',
      icon: '✈️',
      scale: '5',
      show: true
    },
    {
      key: 'fliggy',
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: hotel.fliggyRating || 4.5,
      convertedRating: hotel.fliggyRating ? convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount) : 9.0,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-gradient-to-br from-purple-500 to-violet-500',
      borderColor: 'border-purple-400/30',
      icon: '🐷',
      scale: '5',
      show: true
    }
  ]
  
  // 确保所有平台都有数据
  const visiblePlatforms = platforms.filter(p => p.show)
  
  return (
    <div className="flex flex-col gap-1">
      {/* 紧凑长椭圆形气泡行 */}
      <div className="flex flex-wrap gap-1 justify-center">
        {visiblePlatforms.map((platform) => {
          const displayRating = platform.scale === '5' && platform.convertedRating 
            ? platform.convertedRating 
            : platform.rating
          
          const displayScale = platform.key === 'pup' ? '10' : platform.scale
          const is5Scale = platform.scale === '5'
          
          return (
            <div
              key={platform.key}
              className={`
                relative group
                w-20 h-10 rounded-full  /* 长椭圆形 */
                ${platform.bgColor}
                border ${platform.borderColor}
                flex flex-col items-center justify-center
                shadow-sm hover:shadow-md
                transition-all duration-200
                hover:scale-105 hover:z-10
                before:absolute before:inset-0 before:rounded-full
                before:bg-gradient-to-br before:from-white/10 before:to-transparent
                before:opacity-30
                after:absolute after:inset-0 after:rounded-full
                after:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]
                after:opacity-20
              `}
            >
              {/* 平台名称和评分 - 两行居中 */}
              <div className="flex flex-col items-center justify-center z-10 px-2">
                {/* 第一行：平台名称 */}
                <div className="text-white text-[10px] font-medium leading-tight whitespace-nowrap">
                  {isZh ? platform.nameZh : platform.name}
                </div>
                
                {/* 第二行：评分 */}
                <div className="flex items-baseline gap-0.5">
                  <div className="text-white font-bold text-xs leading-tight">
                    {displayRating ? displayRating.toFixed(1) : 'N/A'}
                  </div>
                  <div className="text-white/80 text-[8px] leading-tight">
                    /{displayScale}
                  </div>
                  {is5Scale && platform.rating && (
                    <div className="text-white/60 text-[6px] leading-tight ml-0.5">
                      ({platform.rating.toFixed(1)})
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pup角标 */}
              {platform.key === 'pup' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 
                  bg-gradient-to-br from-primary-500 to-accent-500 
                  rounded-full flex items-center justify-center
                  text-white text-[6px] font-bold
                  border border-white/50">
                  pup
                </div>
              )}
              
              {/* 金属光泽效果 */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-15">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {/* 悬停放大效果 */}
              <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors duration-200"></div>
            </div>
          )
        })}
      </div>
      
      {/* 数据来源提示 */}
      <div className="text-center">
        <div className="text-slate-500 text-[10px] mt-1 px-2">
          {isZh ? '6大平台综合评分 · 每周自动更新' : '6 platforms · Updated weekly'}
        </div>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 确保长椭圆形气泡在移动端也美观 */
        @media (max-width: 640px) {
          .oval-bubble {
            min-width: 70px;
          }
        }
        
        /* 悬停动画 */
        @keyframes bubblePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .group:hover {
          animation: bubblePulse 0.3s ease;
        }
      `}</style>
    </div>
  )
}