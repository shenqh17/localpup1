'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Send, CheckCircle } from 'lucide-react'

export function Newsletter() {
  const { locale } = useI18n()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isZh = locale === 'zh'

  const t = {
    title: isZh ? '获取旅游贴士和独家优惠' : 'Get Travel Tips & Exclusive Deals',
    subtitle: isZh 
      ? '订阅我们的通讯，获取杭州酒店、景点和特别优惠的最新资讯'
      : 'Subscribe to our newsletter for the latest updates on Hangzhou hotels, attractions, and special offers',
    placeholder: isZh ? '输入您的邮箱' : 'Enter your email',
    button: isZh ? '订阅' : 'Subscribe',
    privacy: isZh ? '我们尊重您的隐私。可随时取消订阅。' : 'We respect your privacy. Unsubscribe anytime.',
    done: isZh ? '完成！' : 'Done!',
  }

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
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="section-padding max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {t.title}
        </h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 px-6 py-4 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-accent-400"
            required
          />
          <button
            type="submit"
            disabled={isSubmitted}
            className="px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                {t.done}
              </>
            ) : (
              <>
                {t.button}
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-primary-200 text-sm mt-4">
          {t.privacy}
        </p>
      </div>
    </section>
  )
}