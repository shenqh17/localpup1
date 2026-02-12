'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, MapPin, Calendar, Users, ChevronDown, X, User, Child } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface FunctionalSearchBoxProps {
  onSearch?: (params: SearchParams) => void
  className?: string
}

interface SearchParams {
  query: string
  location: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
}

export default function FunctionalSearchBox({ onSearch, className = '' }: FunctionalSearchBoxProps) {
  const { isZh } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const datePickerRef = useRef<HTMLDivElement>(null)
  const guestPickerRef = useRef<HTMLDivElement>(null)

  // 关闭日期选择器当点击外部
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({
        query: searchQuery.trim(),
        location: location.trim(),
        checkIn,
        checkOut,
        adults,
        children
      })
    }
  }

  // 日期处理
  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // 初始化默认日期
  useEffect(() => {
    if (!checkIn) setCheckIn(getToday())
    if (!checkOut) setCheckOut(getTomorrow())
  }, [])

  // 地点选项
  const locationOptions = [
    { value: '', label: isZh ? '所有区域' : 'All Areas' },
    { value: 'west-lake', label: isZh ? '西湖景区' : 'West Lake' },
    { value: 'qianjiang', label: isZh ? '钱江新城' : 'Qianjiang New City' },
    { value: 'wulin', label: isZh ? '武林商圈' : 'Wulin Business District' },
    { value: 'binjiang', label: isZh ? '滨江区' : 'Binjiang District' },
    { value: 'xiasha', label: isZh ? '下沙区' : 'Xiasha District' }
  ]

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
                  placeholder={isZh ? "搜索酒店名称、设施或特色..." : "Search hotel names, facilities, or features..."}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 位置筛选 - 下拉选择 */}
              <div className="relative">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "位置" : "Location"}
                    </div>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:outline-none text-sm appearance-none cursor-pointer"
                    >
                      {locationOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </div>
              </div>
              
              {/* 日期筛选 - 功能完整 */}
              <div className="relative" ref={datePickerRef}>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "日期" : "Dates"}
                    </div>
                    <div className="text-white text-sm">
                      {checkIn && checkOut 
                        ? `${checkIn} - ${checkOut}`
                        : isZh ? "选择日期" : "Select dates"
                      }
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                </div>
                
                {/* 日期选择器 */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-white/10 p-4 z-50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white font-medium">{isZh ? "选择日期" : "Select Dates"}</div>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/80 text-sm mb-2 block">
                          {isZh ? "入住日期" : "Check-in"}
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={getToday()}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white/80 text-sm mb-2 block">
                          {isZh ? "退房日期" : "Check-out"}
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || getToday()}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setCheckIn(getToday())
                          setCheckOut(getTomorrow())
                        }}
                        className="w-full py-2 bg-primary-500/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-colors"
                      >
                        {isZh ? "使用默认日期" : "Use Default Dates"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 客人筛选 - 成人儿童分开 */}
              <div className="relative" ref={guestPickerRef}>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "客人" : "Guests"}
                    </div>
                    <div className="text-white text-sm">
                      {adults} {isZh ? "成人" : "adult"}{adults > 1 ? (isZh ? '人' : 's') : ''}
                      {children > 0 && `, ${children} ${isZh ? '儿童' : 'child'}${children > 1 ? (isZh ? '人' : 'ren') : ''}`}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} />
                </div>
                
                {/* 客人选择器 */}
                {showGuestPicker && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-white/10 p-4 z-50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white font-medium">{isZh ? "选择客人" : "Select Guests"}</div>
                      <button
                        type="button"
                        onClick={() => setShowGuestPicker(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 成人数量 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-white/80" />
                          <div>
                            <div className="text-white font-medium">{isZh ? "成人" : "Adults"}</div>
                            <div className="text-white/60 text-xs">{isZh ? "13岁以上" : "Age 13+"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* 儿童数量 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Child className="w-5 h-5 text-white/80" />
                          <div>
                            <div className="text-white font-medium">{isZh ? "儿童" : "Children"}</div>
                            <div className="text-white/60 text-xs">{isZh ? "2-12岁" : "Age 2-12"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-white/60 text-xs">
                          {isZh ? "最多可容纳 8 位客人" : "Maximum 8 guests"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 更多筛选按钮 */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full h-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white/80 text-xs font-medium mb-1">
                      {isZh ? "更多筛选" : "More Filters"}
                    </div>
                    <div className="text-white text-sm">
                      {isZh ? "价格、评分等" : "Price, rating, etc."}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* 搜索提示 */}
      <div className="mt-6 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 text-white/60 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            {isZh ? "热门搜索：" : "Popular:"}
          </span>
          <button 
            onClick={() => setSearchQuery('西湖酒店')}
            className="hover:text-white transition-colors duration-300"
          >
            西湖酒店
          </button>
          <button 
            onClick={() => setSearchQuery('商务酒店')}
            className="hover:text-white transition-colors duration-300"
          >
            商务酒店
          </button>
          <button 
            onClick={() => setSearchQuery('亲子酒店')}
            className="hover:text-white transition-colors duration-300"
          >
            亲子酒店
          </button>
          <button 
            onClick={() => setSearchQuery('豪华度假')}
            className="hover:text-white transition-colors duration-300"
          >
            豪华度假
          </button>
        </div>
      </div>
    </div>
  )
}