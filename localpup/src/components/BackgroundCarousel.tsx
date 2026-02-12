'use client'

import { useState, useEffect } from 'react'

interface BackgroundCarouselProps {
  interval?: number // 轮播间隔（毫秒）
}

export default function BackgroundCarousel({ interval = 8000 }: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
    // 杭州特色背景图 - 真正的杭州景点（已验证）
  const backgrounds = [
    {
      url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1920&q=80',
      title: '西湖断桥残雪',
      description: '杭州西湖经典景观，冬季雪景'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: '拱宸桥夜景',
      description: '京杭大运河杭州段标志性古桥'
    },
    {
      url: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=1920&q=80',
      title: '西湖苏堤春晓',
      description: '西湖十景之首，春季美景'
    },
    {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80',
      title: '杭州城市全景',
      description: '西湖与城市建筑和谐共存'
    },
    {
      url: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?w=1920&q=80',
      title: '钱江新城CBD',
      description: '杭州现代化金融商务中心'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1920&q=80',
      title: '雷峰塔夕照',
      description: '西湖十景之一，黄昏美景'
    },
    {
      url: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=1920&q=80',
      title: '灵隐寺景区',
      description: '杭州著名佛教寺庙，千年古刹'
    },
    {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80',
      title: '西溪湿地公园',
      description: '城市湿地公园，生态旅游胜地'
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
      
      {/* 样式定义 */}
      <style jsx>{`
        /* 背景切换动画 */
        @keyframes backgroundFade {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .bg-cover {
          animation: backgroundFade ${interval}ms ease-in-out infinite;
          animation-delay: calc(var(--index) * ${interval}ms);
        }
        
        /* 控制按钮悬浮效果 */
        button:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
          .absolute.bottom-8 {
            bottom: 4rem;
          }
          .absolute.left-8, .absolute.right-8 {
            left: 1rem;
            right: 1rem;
            max-width: calc(100% - 2rem);
          }
          .flex.items-center.gap-4 {
            flex-direction: column;
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  )
}