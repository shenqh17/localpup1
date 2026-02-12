'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface PremiumSearchBoxProps {
  onSearch?: (query: string) => void
  className?: string
}

export default function PremiumSearchBox({ onSearch, className = '' }: PremiumSearchBoxProps) {
  const { isZh } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [location, setLocation] = useState('')
  const [dates, setDates] = useState('')
  const [guests, setGuests] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* 搜索框主容器 */}
      <div className={`
        relative rounded-2xl p-1
        bg-gradient-to-br from-slate-900/95 to-slate-800/95
        backdrop-blur-xl
        border border-white/10
        shadow-2xl shadow-black/30
        transition-all duration-500
        ${isFocused ? 'ring-2 ring-primary-500/30 ring-offset-2 ring-offset-slate-900' : ''}
        
        /* 金属质感边框 */
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/5 before:to-transparent
        before:opacity-50
        before:border before:border-white/20
        
        /* 光效 */
        after:absolute after:inset-0 after:rounded-2xl
        after:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]
        after:opacity-30
      `}>
        <form onSubmit={handleSearch} className="relative z-10">
          {/* 搜索输入行 */}
          <div className="flex items-center p-4">
            {/* 搜索图标 */}
            <div className="mr-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* 主搜索输入 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isZh ? "搜索酒店、目的地或特色..." : "Search hotels, destinations, or features..."}
                  className="w-full bg-transparent border-none text-white text-lg placeholder:text-white/60 focus:outline-none focus:ring-0 py-3 px-0 font-medium"
                />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0"></div>
              </div>
            </div>
            
            {/* 搜索按钮 */}
            <button
              type="submit"
              className="ml-4 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-sm tracking-wide hover:from-primary-700 hover:to-accent-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isZh ? "搜索" : "Search"}
            </button>
          </div>
          
          {/* 高级筛选栏 */}
          <div className="border-t border-white/10 pt-4 px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 位置筛选 */}
              <div className="relative group">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "位置" : "Location"}
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={isZh ? "杭州、西湖..." : "Hangzhou, West Lake..."}
                      className="w-full bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* 日期筛选 */}
              <div className="relative group">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "日期" : "Dates"}
                    </div>
                    <input
                      type="text"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      placeholder={isZh ? "选择入住日期" : "Select dates"}
                      className="w-full bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* 客人筛选 */}
              <div className="relative group">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "客人" : "Guests"}
                    </div>
                    <input
                      type="text"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder={isZh ? "2位成人" : "2 adults"}
                      className="w-full bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 高级筛选按钮 */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm"
              >
                <Filter className="w-4 h-4" />
                {isZh ? "更多筛选" : "More filters"}
                <span className="ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">+3</span>
              </button>
              
              <div className="text-white/50 text-xs">
                {isZh ? "100+ 家精选酒店" : "100+ curated hotels"}
              </div>
            </div>
          </div>
        </form>
        
        {/* 装饰元素 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent rounded-full"></div>
        </div>
        
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-500/20 to-transparent rounded-full"></div>
        </div>
      </div>
      
      {/* 搜索提示 */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-4 text-white/60 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            {isZh ? "热门搜索：" : "Popular:"}
          </span>
          <button className="hover:text-white transition-colors duration-300">西湖酒店</button>
          <button className="hover:text-white transition-colors duration-300">商务酒店</button>
          <button className="hover:text-white transition-colors duration-300">亲子酒店</button>
          <button className="hover:text-white transition-colors duration-300">豪华度假</button>
        </div>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 输入框光效动画 */
        @keyframes inputShine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        input:focus {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: inputShine 2s infinite;
        }
        
        /* 按钮悬浮效果 */
        button[type="submit"] {
          position: relative;
          overflow: hidden;
        }
        
        button[type="submit"]::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.1),
            transparent,
            rgba(255, 255, 255, 0.1)
          );
          transform: rotate(30deg);
          transition: transform 0.5s;
        }
        
        button[type="submit"]:hover::after {
          transform: rotate(30deg) translate(10%, 10%);
        }
      `}</style>
    </div>
  )
}