'use client'

import { useState, useEffect } from 'react'
import { Hotel } from '@/data/hotels100'
import { calculateWeightedScore } from '@/lib/rating-converter'
import { Star, ChevronRight, TrendingUp, Award, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface RecommendedHotelBubblesProps {
  hotels: Hotel[]
  onHotelSelect?: (hotel: Hotel) => void
  selectedHotelId?: string
}

export default function RecommendedHotelBubbles({ 
  hotels, 
  onHotelSelect,
  selectedHotelId 
}: RecommendedHotelBubblesProps) {
  const { isZh } = useI18n()
  const [selectedId, setSelectedId] = useState<string | null>(selectedHotelId || null)
  
  // 推荐酒店：按综合评分排序，取前8个
  const recommendedHotels = [...hotels]
    .sort((a, b) => calculateWeightedScore(b) - calculateWeightedScore(a))
    .slice(0, 8)
  
  // 处理酒店选择
  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedId(hotel.id)
    if (onHotelSelect) {
      onHotelSelect(hotel)
    }
  }
  
  // 如果没有传入selectedHotelId，默认选择第一个
  useEffect(() => {
    if (!selectedId && recommendedHotels.length > 0) {
      setSelectedId(recommendedHotels[0].id)
      if (onHotelSelect) {
        onHotelSelect(recommendedHotels[0])
      }
    }
  }, [selectedId, recommendedHotels, onHotelSelect])
  
  // 获取当前选中的酒店
  const selectedHotel = recommendedHotels.find(h => h.id === selectedId) || recommendedHotels[0]
  
  return (
    <div className="space-y-6">
      {/* 标题和说明 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-black text-slate-900">
            {isZh ? "精选推荐酒店" : "Curated Hotel Recommendations"}
          </h3>
        </div>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          {isZh 
            ? "点击气泡查看酒店详情，首页背景将实时切换为对应酒店封面" 
            : "Click bubbles to view hotel details, homepage background updates in real-time"}
        </p>
      </div>
      
      {/* 推荐酒店气泡网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {recommendedHotels.map((hotel) => {
          const isSelected = hotel.id === selectedId
          const weightedScore = calculateWeightedScore(hotel)
          
          return (
            <button
              key={hotel.id}
              onClick={() => handleHotelSelect(hotel)}
              className={`
                relative group
                rounded-2xl p-4
                transition-all duration-500
                transform
                ${isSelected 
                  ? 'scale-105 z-10 shadow-2xl bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-300' 
                  : 'shadow-lg bg-white hover:scale-102 hover:shadow-xl border border-slate-200'
                }
                overflow-hidden
                
                /* 选中状态光效 */
                ${isSelected ? `
                  before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-br before:from-primary-500/10 before:to-accent-500/10
                  before:opacity-50
                ` : ''}
              `}
            >
              {/* 背景装饰 */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent"></div>
              </div>
              
              {/* 内容区域 */}
              <div className="relative z-10">
                {/* 酒店图片缩略图 */}
                <div className="w-full h-24 rounded-xl overflow-hidden mb-3 relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* 评分徽章 */}
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-amber-300" />
                      <span className="text-xs font-bold">{weightedScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                {/* 酒店信息 */}
                <div className="text-left">
                  {/* 酒店名称 - 显示全名 */}
                  <div className="font-black text-slate-900 text-sm leading-tight mb-1 line-clamp-2 h-10">
                    {isZh && hotel.nameZh ? hotel.nameZh : hotel.name}
                  </div>
                  
                  {/* 位置 */}
                  <div className="text-slate-500 text-xs mb-2 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-slate-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    </div>
                    <span className="truncate">
                      {isZh && hotel.locationZh ? hotel.locationZh : hotel.location}
                    </span>
                  </div>
                  
                  {/* 综合评分气泡 */}
                  <div className={`
                    inline-flex items-center justify-center
                    px-3 py-1.5 rounded-full
                    ${isSelected 
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' 
                      : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800'
                    }
                    transition-all duration-300
                    group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white
                  `}>
                    <div className="flex items-center gap-1.5">
                      <div className="text-xs font-medium">
                        {isZh ? "综合评分" : "Score"}
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <div className="font-black text-sm">{weightedScore.toFixed(1)}</div>
                        <div className="text-xs font-medium opacity-80">/10</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 选中指示器 */}
              {isSelected && (
                <div className="absolute top-3 left-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              
              {/* 悬浮效果 */}
              <div className={`
                absolute inset-0 rounded-2xl
                transition-opacity duration-300
                ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                bg-gradient-to-br from-primary-500/5 to-accent-500/5
              `}></div>
            </button>
          )
        })}
      </div>
      
      {/* 当前选中酒店信息 */}
      <div className={`
        rounded-2xl p-6
        bg-gradient-to-br from-slate-900 to-slate-800
        text-white
        transition-all duration-500
        transform
        ${selectedId ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h4 className="text-lg font-black">
                {isZh ? "当前选中酒店" : "Currently Selected Hotel"}
              </h4>
            </div>
            
            <h3 className="text-2xl font-black mb-2">
              {isZh && selectedHotel.nameZh ? selectedHotel.nameZh : selectedHotel.name}
            </h3>
            
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>{isZh && selectedHotel.locationZh ? selectedHotel.locationZh : selectedHotel.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-amber-300">
                  {calculateWeightedScore(selectedHotel).toFixed(1)}/10
                </span>
                <span className="text-white/60">综合评分</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black text-amber-300 mb-1">
              {calculateWeightedScore(selectedHotel).toFixed(1)}
            </div>
            <div className="text-white/60 text-sm">综合评分</div>
          </div>
        </div>
        
        {/* 酒店描述预览 */}
        <div className="mt-4">
          <p className="text-white/80 text-sm line-clamp-2">
            {isZh && selectedHotel.descriptionZh 
              ? selectedHotel.descriptionZh.substring(0, 120) + '...'
              : selectedHotel.description?.substring(0, 120) + '...'
            }
          </p>
        </div>
        
        {/* 查看详情按钮 */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => window.open(`/hotels/${selectedHotel.slug}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            {isZh ? "查看完整详情" : "View Full Details"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 气泡悬浮动画 */
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .group:hover {
          animation: bubbleFloat 2s ease-in-out infinite;
        }
        
        /* 选中状态光效动画 */
        @keyframes selectedGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        button[data-selected="true"]::before {
          animation: selectedGlow 2s ease-in-out infinite;
        }
        
        /* 图片加载动画 */
        img {
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}