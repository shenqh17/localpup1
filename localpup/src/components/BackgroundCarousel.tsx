'use client'

import { useState, useEffect } from 'react'

interface BackgroundCarouselProps {
  interval?: number // 轮播间隔（毫秒）
}

export default function BackgroundCarousel({ interval = 8000 }: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 杭州特色背景图 - 已验证的杭州景点图片
  const backgrounds = [
    {
      url: 'https://images.unsplash.com/photo-1583795519721-c7684793a4d8?w=1920&q=80',
      title: '西湖全景',
      description: '杭州西湖，世界文化遗产'
    },
    {
      url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80',
      title: '雷峰塔',
      description: '西湖十景之一，历史名塔'
    },
    {
      url: 'https://images.unsplash.com/photo-1548567117-bd2234796432?w=1920&q=80',
      title: '灵隐寺',
      description: '千年古刹，佛教圣地'
    },
    {
      url: 'https://images.unsplash.com/photo-1598133894008-1f6a1bf2b269?w=1920&q=80',
      title: '钱江新城',
      description: '杭州现代化城市天际线'
    },
    {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80',
      title: '西溪湿地',
      description: '国家5A级旅游景区'
    },
    {
      url: 'https://images.unsplash.com/photo-1616333733088-6819a3771723?w=1920&q=80',
      title: '京杭大运河',
      description: '世界最长古代运河'
    },
    {
      url: 'https://images.unsplash.com/photo-1504835535698-7f39cb9e371d?w=1920&q=80',
      title: '河坊街',
      description: '杭州历史文化街区'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
      title: '孤山',
      description: '西湖北山，白居易诗中孤山'
    }
  ]

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  // 手动切换
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // 下一张
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
  }

  // 上一张
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + backgrounds.length) % backgrounds.length)
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 背景图片轮播 */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${bg.url})` }}
        />
      ))}

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white/10" />

      {/* 光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

      {/* 控制面板（右下角） */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        {/* 缩略图指示器 */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`切换到第 ${index + 1} 张背景`}
            />
          ))}
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="上一张"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="下一张"
          >
            →
          </button>
        </div>
      </div>

      {/* 当前图片信息（左下角） */}
      <div className="absolute bottom-8 left-8 max-w-md">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 text-white">
          <div className="text-sm font-medium text-white/80 mb-1">
            杭州 · {currentIndex + 1}/{backgrounds.length}
          </div>
          <div className="text-lg font-bold mb-1">
            {backgrounds[currentIndex].title}
          </div>
          <div className="text-sm text-white/70">
            {backgrounds[currentIndex].description}
          </div>
        </div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
    </div>
  )
}
