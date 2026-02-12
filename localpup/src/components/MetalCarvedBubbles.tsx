'use client'

import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, convert5To10 } from '@/lib/rating-converter'
import { Hotel } from '@/data/hotels100'

interface MetalCarvedBubblesProps {
  hotel: Hotel
  showPup?: boolean
}

export default function MetalCarvedBubbles({ hotel, showPup = true }: MetalCarvedBubblesProps) {
  const { isZh } = useI18n()
  
  // 计算加权综合评分
  const weightedScore = calculateWeightedScore(hotel)
  
  // 平台配置 - 金属雕刻效果
  const platforms = [
    {
      key: 'pup',
      name: 'Pup',
      nameZh: 'Pup',
      rating: weightedScore,
      color: 'from-amber-600 to-orange-700',
      lightColor: 'amber',
      icon: '🏆',
      scale: '10',
      show: showPup
    },
    {
      key: 'booking',
      name: 'Booking',
      nameZh: 'Booking',
      rating: hotel.bookingRating || 8.5,
      color: 'from-blue-600 to-cyan-700',
      lightColor: 'blue',
      icon: '🌐',
      scale: '10',
      show: true
    },
    {
      key: 'agoda',
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating || 8.3,
      color: 'from-red-600 to-orange-700',
      lightColor: 'red',
      icon: '🏨',
      scale: '10',
      show: true
    },
    {
      key: 'hotelscom',
      name: 'Hotels',
      nameZh: 'Hotels',
      rating: hotel.hotelscomRating || 8.2,
      color: 'from-green-600 to-emerald-700',
      lightColor: 'green',
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
      color: 'from-orange-600 to-amber-700',
      lightColor: 'orange',
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
      color: 'from-purple-600 to-violet-700',
      lightColor: 'purple',
      icon: '🐷',
      scale: '5',
      show: true
    }
  ]
  
  // 确保所有平台都有数据
  const visiblePlatforms = platforms.filter(p => p.show)
  
  return (
    <div className="flex flex-col gap-1">
      {/* 金属雕刻效果气泡行 */}
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
                w-16 h-8 rounded-full  /* 缩小20%：原w-20 h-10 → w-16 h-8 */
                bg-gradient-to-br ${platform.color}
                flex flex-col items-center justify-center
                transition-all duration-300
                hover:scale-110 hover:z-20
                hover:shadow-[0_0_20px_rgba(var(--color),0.4)]
                
                /* 金属雕刻效果 - 凹进感 */
                before:absolute before:inset-0 before:rounded-full
                before:bg-gradient-to-br before:from-black/20 before:to-transparent
                before:opacity-40
                before:border before:border-black/30
                
                /* 雕刻光影效果 */
                after:absolute after:inset-0 after:rounded-full
                after:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]
                after:opacity-30
                after:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.2)]
                
                /* 金属边框 */
                border border-black/40
                shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]
              `}
              style={{
                '--color': platform.lightColor === 'amber' ? '250,204,21' :
                          platform.lightColor === 'blue' ? '59,130,246' :
                          platform.lightColor === 'red' ? '239,68,68' :
                          platform.lightColor === 'green' ? '34,197,94' :
                          platform.lightColor === 'orange' ? '249,115,22' :
                          platform.lightColor === 'purple' ? '168,85,247' : '59,130,246'
              } as any}
            >
              {/* 平台名称和评分 - 两行居中，粗体 */}
              <div className="flex flex-col items-center justify-center z-10 px-1">
                {/* 第一行：平台名称 - 粗体 */}
                <div className="text-white text-[9px] font-black leading-tight whitespace-nowrap tracking-tight">
                  {isZh ? platform.nameZh : platform.name}
                </div>
                
                {/* 第二行：评分 - 分子分母一样大，粗体 */}
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  {/* 分子 - 粗体 */}
                  <div className="text-white font-black text-[10px] leading-tight">
                    {displayRating ? displayRating.toFixed(1) : 'N/A'}
                  </div>
                  
                  {/* 斜杠 */}
                  <div className="text-white/90 font-black text-[10px] leading-tight">/</div>
                  
                  {/* 分母 - 与分子一样大，粗体 */}
                  <div className="text-white/90 font-black text-[10px] leading-tight">
                    {displayScale}
                  </div>
                  
                  {/* 5分制原始评分 */}
                  {is5Scale && platform.rating && (
                    <div className="text-white/70 text-[6px] font-bold leading-tight ml-0.5">
                      ({platform.rating.toFixed(1)})
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pup角标 */}
              {platform.key === 'pup' && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 
                  bg-gradient-to-br from-primary-600 to-accent-600 
                  rounded-full flex items-center justify-center
                  text-white text-[6px] font-black
                  border border-white/60
                  shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)]">
                  pup
                </div>
              )}
              
              {/* 金属光泽动画 */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-10">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {/* 悬停放大效果 */}
              <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              
              {/* 雕刻深度效果 */}
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-30"></div>
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"></div>
            </div>
          )
        })}
      </div>
      
      {/* 数据来源提示 */}
      <div className="text-center mt-1">
        <div className="text-slate-500 text-[9px] font-medium tracking-tight">
          {isZh ? '6大平台综合评分 · 金属雕刻质感' : '6 platforms · Metal carved texture'}
        </div>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 金属雕刻动画 */
        @keyframes metalShine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        .group:hover::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: metalShine 1.5s infinite;
        }
        
        /* 雕刻深度效果增强 */
        .group::after {
          box-shadow: 
            inset 0 3px 6px rgba(0, 0, 0, 0.4),
            inset 0 -2px 4px rgba(255, 255, 255, 0.15),
            0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        /* 确保字体加粗 */
        @font-face {
          font-family: 'CarvedFont';
          src: local('Arial Black'), local('Helvetica Neue Bold'), local('SF Pro Display Bold');
          font-weight: 900;
        }
        
        .carved-text {
          font-family: 'CarvedFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}