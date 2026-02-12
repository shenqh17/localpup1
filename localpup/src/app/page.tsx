'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { hotels } from '@/data/hotels100'
import FunctionalSearchBox from '@/components/FunctionalSearchBox'
import RecommendedHotelBubbles from '@/components/RecommendedHotelBubbles'
import BackgroundCarousel from '@/components/BackgroundCarousel'
import { Hotel } from '@/data/hotels100'
import { useI18n } from '@/lib/i18n-context'

// 结构化数据
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LocalPup - 杭州酒店精选推荐平台",
  "url": "https://localpup.com",
  "description": "发现杭州最佳酒店，精选西湖、钱江新城、滨江、武林等区域优质住宿",
  "publisher": {
    "@type": "Organization",
    "name": "LocalPup",
    "logo": {
      "@type": "ImageObject",
      "url": "https://localpup.com/logo.png"
    }
  }
}

export default function Home() {
  const { isZh } = useI18n()
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  
  // 处理酒店选择
  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setBackgroundImage(hotel.image)
  }
  
  // 处理搜索
  const handleSearch = (query: string) => {
    console.log('搜索:', query)
    // 这里可以添加搜索逻辑
  }
  
  // 西湖断桥残雪背景图 - 真正的杭州断桥残雪
  const westLakeBackground = 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1920&q=80'
  
  // 初始化：默认使用西湖背景
  useEffect(() => {
    setBackgroundImage(westLakeBackground)
    
    if (hotels.length > 0 && !selectedHotel) {
      const firstHotel = hotels[0]
      setSelectedHotel(firstHotel)
    }
  }, [selectedHotel])
  
  return (
    <>
      {/* 结构化数据 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 杭州背景轮播 */}
      <BackgroundCarousel interval={10000} />
      
      {/* 主内容 */}
      <div className="relative min-h-screen">
        {/* 导航栏 */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 新Logo */}
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                    {/* 小狗Logo简化版 */}
                    <div className="relative w-6 h-6">
                      {/* 耳朵 */}
                      <div className="absolute top-0 left-1 w-2 h-2 bg-primary-700 rounded-tl-full"></div>
                      <div className="absolute top-0 right-1 w-2 h-2 bg-primary-700 rounded-tr-full"></div>
                      {/* 头部 */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-5 h-4 bg-white rounded-full"></div>
                      {/* 眼睛 */}
                      <div className="absolute top-3 left-2 w-1 h-1 bg-slate-800 rounded-full"></div>
                      <div className="absolute top-3 right-2 w-1 h-1 bg-slate-800 rounded-full"></div>
                      {/* 鼻子 */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  {/* 金属光泽 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xl flex items-center gap-1">
                    <span>LocalPup</span>
                    <span className="text-xs text-primary-600 font-normal">®</span>
                  </div>
                  <div className="text-slate-500 text-xs">{isZh ? "杭州酒店精选" : "Hangzhou Hotel Curator"}</div>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <a href="/hotels" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  {isZh ? "所有酒店" : "All Hotels"}
                </a>
                <a href="/regions" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  {isZh ? "区域指南" : "Regions"}
                </a>
                <a href="/about" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  {isZh ? "关于我们" : "About"}
                </a>
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold hover:from-primary-700 hover:to-accent-700 transition-all">
                  {isZh ? "开始预订" : "Book Now"}
                </button>
              </nav>
            </div>
          </div>
        </header>
        
        {/* 主标题区域 */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              {isZh ? "发现杭州" : "Discover Hangzhou"}
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {isZh ? "最佳住宿体验" : "Best Stays"}
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {isZh 
                ? "精选100+家杭州优质酒店，基于6大平台真实评分，为您提供最可靠的住宿推荐" 
                : "Curated 100+ premium hotels in Hangzhou, based on real ratings from 6 major platforms for reliable recommendations"
              }
            </p>
          </div>
          
          {/* 功能完整的搜索框 */}
          <div className="mb-16">
            <FunctionalSearchBox onSearch={handleSearch} />
          </div>
          
          {/* 推荐酒店气泡 */}
          <div className="mb-16">
            <RecommendedHotelBubbles 
              hotels={hotels}
              onHotelSelect={handleHotelSelect}
              selectedHotelId={selectedHotel?.id}
            />
          </div>
          
          {/* 特色区域 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                {isZh ? "探索杭州热门区域" : "Explore Popular Areas"}
              </h2>
              <p className="text-slate-600">
                {isZh ? "根据您的旅行需求选择最佳区域" : "Choose the best area for your travel needs"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  name: '西湖景区', 
                  nameEn: 'West Lake', 
                  desc: '风景优美，适合观光', 
                  descEn: 'Scenic area, perfect for sightseeing',
                  count: 28,
                  color: 'from-emerald-500 to-teal-600'
                },
                { 
                  name: '钱江新城', 
                  nameEn: 'Qianjiang New City', 
                  desc: '商务中心，现代设施', 
                  descEn: 'Business center, modern facilities',
                  count: 32,
                  color: 'from-blue-500 to-cyan-600'
                },
                { 
                  name: '武林商圈', 
                  nameEn: 'Wulin Business District', 
                  desc: '购物餐饮，交通便利', 
                  descEn: 'Shopping & dining, convenient transportation',
                  count: 24,
                  color: 'from-purple-500 to-violet-600'
                }
              ].map((region, index) => (
                <div 
                  key={index}
                  className="group relative rounded-xl p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-primary-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center text-white font-black text-lg`}>
                    {region.count}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {isZh ? region.name : region.nameEn}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {isZh ? region.desc : region.descEn}
                  </p>
                  
                  <div className="flex items-center text-primary-600 font-medium">
                    <span>{isZh ? "查看酒店" : "View Hotels"}</span>
                    <div className="ml-2 transform group-hover:translate-x-2 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 特色功能 */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-8">
              {isZh ? "为什么选择 LocalPup？" : "Why Choose LocalPup?"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  icon: '🏆', 
                  title: isZh ? '智能评分' : 'Smart Rating', 
                  desc: isZh ? '6大平台加权算法' : '6-platform weighted algorithm'
                },
                { 
                  icon: '🔍', 
                  title: isZh ? '真实评价' : 'Real Reviews', 
                  desc: isZh ? '基于真实用户反馈' : 'Based on real user feedback'
                },
                { 
                  icon: '💰', 
                  title: isZh ? '价格透明' : 'Transparent Pricing', 
                  desc: isZh ? '无隐藏费用' : 'No hidden fees'
                },
                { 
                  icon: '⚡', 
                  title: isZh ? '快速预订' : 'Fast Booking', 
                  desc: isZh ? '直达官方渠道' : 'Direct to official channels'
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* 页脚 */}
        <footer className="mt-20 py-8 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-9 h-9">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      {/* 小狗Logo简化版 */}
                      <div className="relative w-5 h-5">
                        {/* 耳朵 */}
                        <div className="absolute top-0 left-0.5 w-1.5 h-1.5 bg-primary-700 rounded-tl-full"></div>
                        <div className="absolute top-0 right-0.5 w-1.5 h-1.5 bg-primary-700 rounded-tr-full"></div>
                        {/* 头部 */}
                        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white rounded-full"></div>
                        {/* 眼睛 */}
                        <div className="absolute top-2 left-1 w-0.75 h-0.75 bg-slate-800 rounded-full"></div>
                        <div className="absolute top-2 right-1 w-0.75 h-0.75 bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-lg">LocalPup</div>
                    <div className="text-slate-500 text-xs">{isZh ? "杭州酒店精选" : "Hangzhou Hotel Curator"}</div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  {isZh ? "基于6大平台的智能酒店推荐平台" : "Intelligent hotel recommendation platform based on 6 major platforms"}
                </p>
              </div>
              
              <div className="text-slate-500 text-sm">
                © 2024 LocalPup. {isZh ? "保留所有权利" : "All rights reserved."}
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 背景切换动画 */
        @keyframes backgroundFade {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        
        .bg-cover {
          animation: backgroundFade 1s ease-out;
        }
        
        /* 标题渐变动画 */
        @keyframes titleGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .text-transparent {
          background-size: 200% 200%;
          animation: titleGradient 3s ease infinite;
        }
        
        /* 卡片悬浮效果 */
        .group:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </>
  )
}