'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2, ArrowRight } from 'lucide-react'

const districts = [
  {
    id: 'xihu',
    name: '西湖',
    nameEn: 'West Lake',
    description: '杭州的灵魂所在，世界级文化遗产，湖畔酒店尽览湖光山色',
    image: 'https://images.unsplash.com/photo-1597743057129-30193259b26c?w=600&q=80',
    hotelCount: 156,
    highlights: ['湖景房', '古典园林', '步行至断桥'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'qianjiang',
    name: '钱江新城',
    nameEn: 'Qianjiang New Town',
    description: '杭州CBD核心，现代化天际线与钱塘江景交相辉映',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    hotelCount: 89,
    highlights: ['城市景观', '商务首选', '钱塘江景'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'binjiang',
    name: '滨江',
    nameEn: 'Binjiang',
    description: '高新技术产业聚集地，现代设计与创新氛围完美融合',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    hotelCount: 67,
    highlights: ['现代设计', '科技企业', '江景房'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'wulin',
    name: '武林',
    nameEn: 'Wulin',
    description: '传统商业中心，购物美食娱乐一应俱全，交通便利',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    hotelCount: 124,
    highlights: ['购物便利', '美食天堂', '地铁枢纽'],
    color: 'from-orange-500 to-red-500',
  },
]

export function CityGuide() {
  return (
    <section className="py-20 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 text-sm font-semibold rounded-full mb-4">
            探索杭州
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            按区域浏览
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            根据您的出行目的和偏好，选择最适合的区域，发现理想住宿
          </p>
        </div>

        {/* District Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {districts.map((district) => (
            <Link
              key={district.id}
              href={`/hotels?district=${district.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/10]"
            >
              {/* Background Image */}
              <Image
                src={district.image}
                alt={district.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Color Accent */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${district.color}`} />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <span className="text-white/80 text-sm">{district.nameEn}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {district.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 max-w-md">
                      {district.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Building2 className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">{district.hotelCount}</span>
                      <span className="text-white/80 text-sm">家酒店</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {district.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 mt-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  查看酒店
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            查看完整杭州旅游指南
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
