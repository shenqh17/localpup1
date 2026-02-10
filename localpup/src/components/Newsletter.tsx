'use client'

import { useState } from 'react'
import { Send, CheckCircle, Mail, Gift, Bell } from 'lucide-react'

const benefits = [
  { icon: Gift, text: '独家优惠折扣' },
  { icon: Bell, text: '新酒店首发通知' },
  { icon: Mail, text: '旅行攻略推送' },
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="section-padding max-w-5xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          订阅我们的Newsletter
        </h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto text-lg">
          获取杭州酒店独家优惠、新开业酒店资讯和精选旅行攻略
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
              <benefit.icon className="w-4 h-4" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱地址"
              className="w-full pl-12 pr-6 py-4 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-accent-400 border-0"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitted}
            className="px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                订阅成功！
              </>
            ) : (
              <>
                立即订阅
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-primary-200 text-sm mt-6">
          我们尊重您的隐私，您可以随时取消订阅。不会发送垃圾邮件。
        </p>
      </div>
    </section>
  )
}
