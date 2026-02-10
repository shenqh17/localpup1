'use client'

import { DollarSign, Wallet, CreditCard, Banknote } from 'lucide-react'
import Link from 'next/link'

const priceRanges = [
  {
    id: 'luxury',
    name: '豪华',
    nameEn: 'Luxury',
    price: '¥2000+',
    description: '五星级奢华体验',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    href: '/hotels?price=luxury',
  },
  {
    id: 'premium',
    name: '高端',
    nameEn: 'Premium',
    price: '¥1000-2000',
    description: '高品质住宿选择',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    href: '/hotels?price=premium',
  },
  {
    id: 'mid',
    name: '中端',
    nameEn: 'Mid-range',
    price: '¥500-1000',
    description: '性价比优选酒店',
    icon: Wallet,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    href: '/hotels?price=mid',
  },
  {
    id: 'budget',
    name: '经济',
    nameEn: 'Budget',
    price: '¥500以下',
    description: '实惠舒适住宿',
    icon: Banknote,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    href: '/hotels?price=budget',
  },
]

export function PriceFilter() {
  return (
    <section className="py-16 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full mb-4">
            按预算筛选
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            价格区间快速入口
          </h2>
          <p className="text-slate-500 mt-2">
            根据您的预算快速找到合适的酒店
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {priceRanges.map((range) => (
            <Link
              key={range.id}
              href={range.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-200"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${range.color} opacity-10 rounded-bl-full`} />
              
              <div className={`w-12 h-12 ${range.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <range.icon className={`w-6 h-6 bg-gradient-to-br ${range.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{range.name}</h3>
                  <span className="text-xs text-slate-400">{range.nameEn}</span>
                </div>
                
                <p className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mt-1">
                  {range.price}
                </p>
                
                <p className="text-sm text-slate-500 mt-2">
                  {range.description}
                </p>
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${range.color} flex items-center justify-center`}>
                  <span className="text-white text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
