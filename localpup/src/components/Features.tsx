'use client'

import { useI18n } from '@/lib/i18n-context'
import { Sparkles, Shield, Globe, Zap } from 'lucide-react'

export function Features() {
  const { t } = useI18n()
  
  const features = [
    {
      icon: Sparkles,
      title: t('features.title1'),
      description: t('features.desc1'),
    },
    {
      icon: Shield,
      title: t('features.title2'),
      description: t('features.desc2'),
    },
    {
      icon: Globe,
      title: t('features.title3'),
      description: t('features.desc3'),
    },
    {
      icon: Zap,
      title: t('features.title4'),
      description: t('features.desc4'),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}