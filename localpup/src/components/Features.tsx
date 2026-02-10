'use client'

import { Star, BadgeCheck, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: Star,
    title: '高分筛选',
    description: '我们只收录评分4.5以上的优质酒店，经过严格筛选确保品质，让您安心入住',
    stat: '4.9+',
    statLabel: '平均评分',
  },
  {
    icon: BadgeCheck,
    title: '价格透明',
    description: '实时比价，无隐藏费用，展示最真实的房价和优惠，预订前即可了解全部费用',
    stat: '100%',
    statLabel: '价格透明',
  },
  {
    icon: MessageCircle,
    title: '真实评价',
    description: '所有评价均来自真实住客，无刷单无造假，为您提供最可信的参考依据',
    stat: '50K+',
    statLabel: '真实评价',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full mb-4">
            我们的优势
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            为什么选择我们
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            我们致力于为每一位旅行者提供最优质的酒店预订体验
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative text-center p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>

              {/* Stat Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {feature.stat}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Stat Label */}
              <p className="text-sm text-primary-600 font-medium">
                {feature.statLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t border-slate-100">
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm">官方认证</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm">品质保证</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">24小时客服</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
