'use client'

import { useState } from 'react'
import { Star, TrendingUp, Award, Zap, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, convert5To10, getRatingStats } from '@/lib/rating-converter'
import { Hotel } from '@/data/hotels100'

interface PremiumRatingModulesProps {
  hotel: Hotel
}

export default function PremiumRatingModules({ hotel }: PremiumRatingModulesProps) {
  const { isZh } = useI18n()
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)
  
  // 计算评分统计
  const ratingStats = getRatingStats(hotel)
  const weightedScore = ratingStats.weightedScore
  
  // 高饱和度半透明颜色配置
  const platformConfigs = [
    {
      key: 'pup',
      name: 'Pup Score',
      nameZh: 'Pup综合评分',
      rating: weightedScore,
      color: 'rgba(245, 158, 11, 0.85)', // 琥珀色高饱和
      lightColor: 'rgba(251, 191, 36, 0.95)',
      icon: <Award className="w-4 h-4" />,
      scale: '10',
      description: isZh ? '智能加权综合评分' : 'Intelligently Weighted Composite Score',
      weight: 1.0
    },
    {
      key: 'booking',
      name: 'Booking.com',
      nameZh: 'Booking.com',
      rating: hotel.bookingRating || 8.5,
      color: 'rgba(59, 130, 246, 0.85)', // 蓝色高饱和
      lightColor: 'rgba(96, 165, 250, 0.95)',
      icon: <Star className="w-4 h-4" />,
      scale: '10',
      description: isZh ? '国际酒店预订平台' : 'International Hotel Booking Platform',
      weight: 1.0
    },
    {
      key: 'agoda',
      name: 'Agoda',
      nameZh: 'Agoda',
      rating: hotel.agodaRating || 8.3,
      color: 'rgba(239, 68, 68, 0.85)', // 红色高饱和
      lightColor: 'rgba(248, 113, 113, 0.95)',
      icon: <TrendingUp className="w-4 h-4" />,
      scale: '10',
      description: isZh ? '亚洲领先预订平台' : 'Asia Leading Booking Platform',
      weight: 0.9
    },
    {
      key: 'hotelscom',
      name: 'Hotels.com',
      nameZh: 'Hotels.com',
      rating: hotel.hotelscomRating || 8.2,
      color: 'rgba(34, 197, 94, 0.85)', // 绿色高饱和
      lightColor: 'rgba(74, 222, 128, 0.95)',
      icon: <Zap className="w-4 h-4" />,
      scale: '10',
      description: isZh ? '全球酒店预订专家' : 'Global Hotel Booking Expert',
      weight: 0.85
    },
    {
      key: 'ctrip',
      name: 'Ctrip',
      nameZh: '携程',
      rating: hotel.ctripRating || 4.4,
      convertedRating: hotel.ctripRating ? convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount) : 8.8,
      color: 'rgba(249, 115, 22, 0.85)', // 橙色高饱和
      lightColor: 'rgba(251, 146, 60, 0.95)',
      icon: <Sparkles className="w-4 h-4" />,
      scale: '5',
      description: isZh ? '中国领先旅游平台' : 'China Leading Travel Platform',
      weight: 1.1
    },
    {
      key: 'fliggy',
      name: 'Fliggy',
      nameZh: '飞猪',
      rating: hotel.fliggyRating || 4.5,
      convertedRating: hotel.fliggyRating ? convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount) : 9.0,
      color: 'rgba(168, 85, 247, 0.85)', // 紫色高饱和
      lightColor: 'rgba(192, 132, 252, 0.95)',
      icon: <Star className="w-4 h-4" />,
      scale: '5',
      description: isZh ? '阿里旗下旅游平台' : 'Alibaba Travel Platform',
      weight: 1.0
    }
  ]
  
  return (
    <div className="space-y-4">
      {/* 模块标题 */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {isZh ? '多平台评分分析' : 'Multi-Platform Rating Analysis'}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {isZh ? '基于6大平台的智能加权评分系统' : 'Intelligent weighted scoring system based on 6 major platforms'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2 rounded-full">
          <div className="text-lg font-black">{weightedScore.toFixed(1)}</div>
          <div className="text-sm font-medium opacity-90">/10</div>
        </div>
      </div>
      
      {/* 高饱和度半透明模块网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platformConfigs.map((platform) => {
          const displayRating = platform.scale === '5' && platform.convertedRating 
            ? platform.convertedRating 
            : platform.rating
          
          const isHovered = hoveredPlatform === platform.key
          
          return (
            <div
              key={platform.key}
              className={`
                relative rounded-xl p-4
                transition-all duration-500
                transform
                ${isHovered ? 'scale-105 z-10 shadow-2xl' : 'shadow-lg'}
                backdrop-blur-sm
                border border-white/20
                overflow-hidden
                
                /* 光影效果 */
                before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-br before:from-white/10 before:to-transparent
                before:opacity-30
                
                /* 悬浮效果 */
                hover:shadow-2xl hover:border-white/40
                cursor-pointer
              `}
              style={{
                backgroundColor: platform.color,
                boxShadow: isHovered 
                  ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px ${platform.lightColor}`
                  : `0 10px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
              }}
              onMouseEnter={() => setHoveredPlatform(platform.key)}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              {/* 背景光效 */}
              <div 
                className="absolute inset-0 rounded-xl opacity-20"
                style={{
                  background: `radial-gradient(circle at ${isHovered ? '70%' : '30%'} 30%, ${platform.lightColor}, transparent 70%)`
                }}
              />
              
              {/* 内容区域 */}
              <div className="relative z-10">
                {/* 平台标题行 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-white">
                      {platform.icon}
                    </div>
                    <div>
                      <div className="text-white font-black text-sm tracking-tight">
                        {isZh ? platform.nameZh : platform.name}
                      </div>
                      <div className="text-white/80 text-xs font-medium mt-0.5">
                        {platform.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* 平台权重 */}
                  <div className="text-white/90 text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                    {platform.weight.toFixed(2)}
                  </div>
                </div>
                
                {/* 评分显示区域 */}
                <div className="mt-4">
                  {/* 主评分 - 大字体，粗体 */}
                  <div className="flex items-baseline justify-center gap-1">
                    <div className="text-white font-black text-2xl tracking-tight">
                      {displayRating ? displayRating.toFixed(1) : 'N/A'}
                    </div>
                    
                    {/* 5分制平台显示原始评分 */}
                    {platform.scale === '5' && platform.rating && (
                      <div className="text-white/70 text-sm font-bold ml-1">
                        ({platform.rating.toFixed(1)})
                      </div>
                    )}
                  </div>
                  
                  {/* 评分制式 - 下部居中 */}
                  <div className="text-center mt-2">
                    <div className="text-white/90 text-xs font-black tracking-wider">
                      {platform.scale === '5' ? '5-POINT SCALE' : '10-POINT SCALE'}
                    </div>
                  </div>
                </div>
                
                {/* 权重指示器 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>{isZh ? '算法权重' : 'Algorithm Weight'}</span>
                    <span className="font-bold">{platform.weight.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${platform.weight * 100}%`,
                        background: `linear-gradient(90deg, ${platform.lightColor}, white)`
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* 悬浮光效 */}
              {isHovered && (
                <div className="absolute inset-0 rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* 算法说明 */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <div className="text-white font-bold text-sm">
            {isZh ? '智能评分算法' : 'Intelligent Rating Algorithm'}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-white font-black text-lg">{ratingStats.availablePlatforms}</div>
            <div className="text-white/80 text-xs mt-1">{isZh ? '数据平台' : 'Platforms'}</div>
          </div>
          <div className="text-center">
            <div className="text-white font-black text-lg">{ratingStats.totalReviews.toLocaleString()}</div>
            <div className="text-white/80 text-xs mt-1">{isZh ? '总评论数' : 'Total Reviews'}</div>
          </div>
          <div className="text-center">
            <div className="text-white font-black text-lg">v2.1</div>
            <div className="text-white/80 text-xs mt-1">{isZh ? '算法版本' : 'Algorithm Version'}</div>
          </div>
          <div className="text-center">
            <div className="text-emerald-400 font-black text-lg">{isZh ? '每周更新' : 'Weekly'}</div>
            <div className="text-white/80 text-xs mt-1">{isZh ? '更新频率' : 'Update Frequency'}</div>
          </div>
        </div>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 简约美观的粗体字体 */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&display=swap');
        
        .premium-font {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 800;
        }
        
        /* 悬浮动画 */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .hover-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* 光效动画 */
        @keyframes shine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shine-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shine 2s infinite;
        }
      `}</style>
    </div>
  )
}