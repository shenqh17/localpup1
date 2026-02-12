'use client'

import { Trophy, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'
import { calculateWeightedScore, getRatingStats } from '@/lib/rating-converter'

interface MetalPupRatingProps {
  hotel: {
    bookingRating?: number
    agodaRating?: number
    hotelscomRating?: number
    airbnbRating?: number
    ctripRating?: number
    fliggyRating?: number
    bookingReviewCount?: number
    agodaReviewCount?: number
    hotelscomReviewCount?: number
    airbnbReviewCount?: number
    ctripReviewCount?: number
    fliggyReviewCount?: number
  }
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export default function MetalPupRating({ hotel, size = 'md', showDetails = false }: MetalPupRatingProps) {
  const { isZh } = useI18n()
  
  // 计算加权综合评分
  const ratingStats = getRatingStats(hotel)
  const weightedScore = ratingStats.weightedScore
  const availablePlatforms = ratingStats.availablePlatforms
  const totalReviews = ratingStats.totalReviews
  
  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'w-16 h-16',
      score: 'text-2xl',
      label: 'text-xs',
      icon: 'w-6 h-6',
      badge: 'w-5 h-5 text-[10px]'
    },
    md: {
      container: 'w-20 h-20',
      score: 'text-3xl',
      label: 'text-sm',
      icon: 'w-8 h-8',
      badge: 'w-6 h-6 text-xs'
    },
    lg: {
      container: 'w-24 h-24',
      score: 'text-4xl',
      label: 'text-base',
      icon: 'w-10 h-10',
      badge: 'w-7 h-7 text-sm'
    }
  }
  
  const config = sizeConfig[size]
  
  // 根据评分确定金属颜色
  const getMetalColor = (score: number) => {
    if (score >= 9.0) {
      return {
        gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
        shadow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]',
        glow: 'shadow-[inset_0_0_20px_rgba(250,204,21,0.2)]',
        border: 'border-yellow-500/30'
      }
    } else if (score >= 8.0) {
      return {
        gradient: 'from-slate-300 via-slate-400 to-slate-500',
        shadow: 'shadow-[0_0_25px_rgba(148,163,184,0.3)]',
        glow: 'shadow-[inset_0_0_15px_rgba(148,163,184,0.2)]',
        border: 'border-slate-400/30'
      }
    } else if (score >= 7.0) {
      return {
        gradient: 'from-amber-700 via-amber-800 to-amber-900',
        shadow: 'shadow-[0_0_20px_rgba(180,83,9,0.3)]',
        glow: 'shadow-[inset_0_0_12px_rgba(180,83,9,0.2)]',
        border: 'border-amber-700/30'
      }
    } else {
      return {
        gradient: 'from-stone-500 via-stone-600 to-stone-700',
        shadow: 'shadow-[0_0_15px_rgba(120,113,108,0.3)]',
        glow: 'shadow-[inset_0_0_10px_rgba(120,113,108,0.2)]',
        border: 'border-stone-500/30'
      }
    }
  }
  
  const metalColor = getMetalColor(weightedScore)
  
  // 评分等级徽章
  const getRatingBadge = (score: number) => {
    if (score >= 9.5) return { text: 'S+', color: 'bg-gradient-to-br from-purple-600 to-pink-600' }
    if (score >= 9.0) return { text: 'S', color: 'bg-gradient-to-br from-yellow-500 to-amber-600' }
    if (score >= 8.5) return { text: 'A+', color: 'bg-gradient-to-br from-emerald-500 to-teal-600' }
    if (score >= 8.0) return { text: 'A', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' }
    if (score >= 7.5) return { text: 'B+', color: 'bg-gradient-to-br from-green-500 to-emerald-600' }
    if (score >= 7.0) return { text: 'B', color: 'bg-gradient-to-br from-amber-500 to-orange-600' }
    if (score >= 6.0) return { text: 'C', color: 'bg-gradient-to-br from-orange-500 to-red-500' }
    return { text: 'D', color: 'bg-gradient-to-br from-red-500 to-rose-600' }
  }
  
  const ratingBadge = getRatingBadge(weightedScore)
  
  return (
    <div className="relative group">
      {/* 金属质感主气泡 */}
      <div className={`relative ${config.container} rounded-2xl flex flex-col items-center justify-center
        bg-gradient-to-br ${metalColor.gradient}
        ${metalColor.shadow} ${metalColor.glow}
        border ${metalColor.border}
        transform transition-all duration-300
        group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(250,204,21,0.4)]
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/10 before:to-transparent
        before:opacity-50 before:pointer-events-none
        after:absolute after:inset-0 after:rounded-2xl
        after:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_70%)]
        after:opacity-40 after:pointer-events-none`}>
        
        {/* 金属纹理效果 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>
        
        {/* 评分等级徽章 */}
        <div className={`absolute -top-2 -right-2 ${config.badge} rounded-full flex items-center justify-center
          ${ratingBadge.color} text-white font-bold z-10
          shadow-lg border-2 border-white/50`}>
          {ratingBadge.text}
        </div>
        
        {/* Pup角标 */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 
          rounded-full flex items-center justify-center text-white font-bold text-xs
          shadow-lg border-2 border-white/50 z-10">
          pup
        </div>
        
        {/* 主评分 */}
        <div className="relative z-10 text-center">
          <div className={`${config.score} font-bold text-white drop-shadow-lg`}>
            {weightedScore.toFixed(1)}
          </div>
          <div className={`${config.label} text-white/90 font-medium mt-1`}>
            /10
          </div>
        </div>
        
        {/* 平台数量徽章 */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-medium
          px-3 py-1 rounded-full border border-slate-700/50 shadow-lg
          flex items-center gap-1.5 z-10">
          <Shield className="w-3 h-3" />
          <span>{availablePlatforms} {isZh ? '平台' : 'platforms'}</span>
        </div>
        
        {/* 金属光泽动画 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* 详细信息卡片（悬停显示） */}
      {showDetails && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64
          bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4
          shadow-2xl border border-slate-700/50 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-bold">Pup Score</span>
            </div>
            <div className="text-sm text-slate-300">
              {isZh ? '加权综合评分' : 'Weighted Score'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{isZh ? '算法版本' : 'Algorithm'}</span>
              <span className="text-sm font-medium">v2.1</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{isZh ? '数据平台' : 'Platforms'}</span>
              <span className="text-sm font-medium">{availablePlatforms}/7</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{isZh ? '总评论数' : 'Total Reviews'}</span>
              <span className="text-sm font-medium">{totalReviews.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{isZh ? '更新频率' : 'Update Frequency'}</span>
              <span className="text-sm font-medium text-emerald-400">
                {isZh ? '每周自动' : 'Weekly Auto'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-xs text-slate-400">
              {isZh 
                ? '基于7大平台评分智能加权计算，考虑平台权威性、评论数量和评分新鲜度'
                : 'Intelligently weighted from 7 platforms, considering authority, review count, and freshness'
              }
            </div>
          </div>
        </div>
      )}
      
      {/* 样式定义 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}