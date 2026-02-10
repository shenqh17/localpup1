'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react'

const featuredHotels = [
  {
    id: '1',
    name: '杭州西子湖四季酒店',
    slug: 'four-seasons-hangzhou',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.9,
    reviewCount: 2847,
    price: 2800,
    location: '西湖区',
    area: '西湖',
    description: '坐落于西湖湖畔，融合传统园林与现代奢华，拥有私人码头和茶园。',
    amenities: ['免费WiFi', '泳池', 'SPA', '餐厅'],
    tags: ['湖景', '园林'],
  },
  {
    id: '2',
    name: '杭州柏悦酒店',
    slug: 'park-hyatt-hangzhou',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    rating: 4.8,
    reviewCount: 1923,
    price: 1800,
    location: '上城区',
    area: '钱江新城',
    description: '位于钱江新城CBD核心，尽享城市天际线与钱塘江美景。',
    amenities: ['免费WiFi', '健身房', '酒吧', '餐厅'],
    tags: ['城市景观', '商务首选'],
  },
  {
    id: '3',
    name: '法云安缦',
    slug: 'amanfayun-hangzhou',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.9,
    reviewCount: 892,
    price: 6500,
    location: '西湖区',
    area: '灵隐寺',
    description: '古村落改造而成的隐世桃源，被茶园与竹林环绕，毗邻灵隐寺。',
    amenities: ['免费WiFi', 'SPA', '餐厅', '花园'],
    tags: ['隐世', '禅意'],
  },
  {
    id: '4',
    name: '杭州康莱德酒店',
    slug: 'conrad-hangzhou',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.7,
    reviewCount: 1567,
    price: 1200,
    location: '滨江区',
    area: '滨江',
    description: '现代设计风格的奢华酒店，俯瞰钱塘江，毗邻杭州来福士中心。',
    amenities: ['免费WiFi', '泳池', '健身房', '餐厅'],
    tags: ['现代设计', '江景'],
  },
  {
    id: '5',
    name: '杭州香格里拉饭店',
    slug: 'shangri-la-hangzhou',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    rating: 4.6,
    reviewCount: 3241,
    price: 950,
    location: '西湖区',
    area: '西湖',
    description: '历史悠久的老牌奢华酒店，步行可达西湖，拥有传统中式园林。',
    amenities: ['免费WiFi', '泳池', '餐厅', '会议室'],
    tags: ['经典', '近西湖'],
  },
  {
    id: '6',
    name: '杭州JW万豪酒店',
    slug: 'jw-marriott-hangzhou',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    rating: 4.7,
    reviewCount: 2134,
    price: 1100,
    location: '拱墅区',
    area: '武林',
    description: '位于武林商圈核心位置，购物交通便利，商务休闲两相宜。',
    amenities: ['免费WiFi', '健身房', '餐厅', '行政酒廊'],
    tags: ['商务', '购物便利'],
  },
]

export function FeaturedHotels() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              精选推荐
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">特色酒店展示</h2>
            <p className="text-slate-600 mt-2 text-lg">为您精心挑选的杭州最佳住宿选择</p>
          </div>
          <Link href="/hotels" className="group flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            查看全部
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded-full">
                    精选
                  </span>
                  {hotel.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-black/60 text-white text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                  <Heart className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg flex-shrink-0">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span className="font-semibold text-green-700">{hotel.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{hotel.location} · {hotel.area}</span>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">¥{hotel.price.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm"> / 晚</span>
                  </div>
                  <span className="text-sm text-slate-400">{hotel.reviewCount}条评价</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            浏览更多酒店
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
