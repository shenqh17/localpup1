'use client'

import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1920&q=80)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding text-center text-white max-w-5xl mx-auto pt-24">
        <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/20">
          ✨ 杭州最佳酒店精选
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          发现杭州最佳酒店
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          精选杭州顶级酒店，从西湖畔的传统园林到钱江新城的现代奢华，为您打造完美住宿体验
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-xs text-slate-500">目的地</p>
                <p className="font-medium text-slate-900 truncate">杭州市</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-xs text-slate-500">入住 - 退房</p>
                <p className="font-medium text-slate-900 truncate">添加日期</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              <Users className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-xs text-slate-500">住客</p>
                <p className="font-medium text-slate-900 truncate">2 位成人</p>
              </div>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 py-3 sm:py-0 px-8">
              <Search className="w-5 h-5" />
              搜索
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="text-white/70 text-sm">热门搜索：</span>
          {['西湖', '钱江新城', '武林广场', '滨江'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white hover:bg-white/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-16 mt-16">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">500+</p>
            <p className="text-white/80 text-sm">精选酒店</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">50K+</p>
            <p className="text-white/80 text-sm">满意住客</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold">4.9</p>
            <p className="text-white/80 text-sm">平均评分</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}
