'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface I18nContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.attractions': 'Attractions',
    'nav.dining': 'Dining',
    'nav.videos': 'Videos',
    'nav.exploreHotels': 'Explore Hotels',
    'nav.search': 'Search',
    'nav.language': 'Language',
    
    // Hero
    'hero.title1': "Discover Hangzhou's",
    'hero.title2': 'Hidden Gems',
    'hero.subtitle': 'Curated hotels, attractions, and dining experiences for the discerning international traveler',
    'hero.location': 'Location',
    'hero.locationValue': 'Hangzhou, China',
    'hero.dates': 'Dates',
    'hero.addDates': 'Add dates',
    'hero.guests': 'Guests',
    'hero.guestsValue': '2 Adults',
    'hero.searchButton': 'Search Hotels',
    'hero.stats.hotels': 'Curated Hotels',
    'hero.stats.travelers': 'Happy Travelers',
    'hero.stats.rating': 'Average Rating',
    
    // Hotels
    'hotels.badge': 'Handpicked for You',
    'hotels.title': 'Featured Hotels in Hangzhou',
    'hotels.subtitle': 'Discover our curated selection of the finest accommodations, from luxury resorts to boutique hotels',
    'hotels.viewAll': 'View All Hotels',
    'hotels.featured': 'Featured',
    'hotels.perNight': 'per night',
    'hotels.reviews': 'reviews',
    'hotels.viewDetails': 'View Details',
    'hotels.bookingRating': 'Booking.com Rating',
    'hotels.agodaRating': 'Agoda Rating',
    'hotels.hotelscomRating': 'Hotels.com Rating',
    'hotels.ctripRating': 'Ctrip Rating',
    'hotels.fliggyRating': 'Fliggy Rating',
    'hotels.overallRating': 'Overall Rating',
    'hotels.globalPlatforms': 'Global Platforms',
    'hotels.domesticPlatforms': 'Domestic Platforms',
    'hotels.globalPlatformRatings': 'Global Platform Ratings',
    'hotels.domesticPlatformRatings': 'Domestic Platform Ratings',
    'hotels.basedOn': 'Based on',
    'hotels.outOf5Stars': 'out of 5 stars',
    'hotels.ratingExplanation': 'Rating Explanation',
    'hotels.ratingExplanationDetail': 'Ratings are aggregated from the top 3 global booking platforms (Booking.com, Agoda, Hotels.com) and top 2 domestic platforms (Ctrip, Fliggy). Each platform uses a 10-point scale converted to 5-star display.',
    'hotels.imageSource.ctrip': 'Images from Ctrip Official',
    'hotels.imageSource.booking': 'Images from Booking.com',
    'hotels.imageSource.official': 'Official Images',
    'hotels.amenities': 'Amenities',
    'hotels.priceRange': 'Price Range',
    'hotels.filter.rating': 'Rating',
    'hotels.filter.location': 'Location',
    'hotels.filter.price': 'Price Range',
    'hotels.filter.min': 'Min',
    'hotels.filter.max': 'Max',
    'hotels.filter.recommended': 'Recommended',
    'hotels.filter.priceLowHigh': 'Price: Low to High',
    'hotels.filter.priceHighLow': 'Price: High to Low',
    'hotels.filter.ratingHighLow': 'Rating: High to Low',
    'hotels.results': 'hotels found',
    'hotels.filters': 'Filters',
    
    // Features
    'features.title1': 'AI-Powered Curation',
    'features.desc1': 'Our intelligent system analyzes thousands of reviews to bring you only the best recommendations',
    'features.title2': 'Verified Reviews',
    'features.desc2': 'All ratings and reviews are aggregated from trusted platforms like Booking.com and Ctrip',
    'features.title3': 'Multi-Language Support',
    'features.desc3': 'Full English and Chinese support with more languages coming soon',
    'features.title4': 'Best Price Guarantee',
    'features.desc4': 'We compare prices across multiple platforms to ensure you get the best deal',
    
    // City Guide
    'guide.badge': 'Explore Hangzhou',
    'guide.title': 'Discover the City of Heaven',
    'guide.subtitle': 'Hangzhou, Marco Polo\'s "City of Heaven," offers a perfect blend of natural beauty and cultural heritage',
    'guide.readMore': 'Read Full Travel Guide',
    'guide.westLake.title': 'West Lake',
    'guide.westLake.desc': 'UNESCO World Heritage site, the soul of Hangzhou',
    'guide.lingyin.title': 'Lingyin Temple',
    'guide.lingyin.desc': 'Ancient Buddhist temple nestled in the mountains',
    'guide.xixi.title': 'Xixi Wetland',
    'guide.xixi.desc': 'China\'s first national wetland park',
    
    // Newsletter
    'newsletter.title': 'Get Travel Tips & Exclusive Deals',
    'newsletter.subtitle': 'Subscribe to our newsletter for the latest updates on Hangzhou hotels, attractions, and special offers',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.button': 'Subscribe',
    'newsletter.privacy': 'We respect your privacy. Unsubscribe anytime.',
    'newsletter.success': 'Thank you for subscribing!',
    
    // Footer
    'footer.description': 'Your trusted companion for discovering Hangzhou\'s finest hotels, attractions, and dining experiences.',
    'footer.explore': 'Explore',
    'footer.support': 'Support',
    'footer.contact': 'Contact Us',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Privacy Policy',
    'footer.stayUpdated': 'Stay Updated',
    'footer.subscribeText': 'Subscribe for travel tips and exclusive deals.',
    'footer.emailPlaceholder': 'Your email',
    'footer.subscribeBtn': 'Subscribe',
    'footer.copyright': '© 2026 LocalPup. All rights reserved.',
    
    // Videos
    'videos.title': 'Featured Videos',
    'videos.subtitle': 'Watch immersive videos showcasing the best hotels and experiences in Hangzhou',
    'videos.badge': 'Video Gallery',
    'videos.watchOn': 'Watch on',
    'videos.comingSoon': 'More Videos Coming Soon',
    'videos.comingSoonDesc': 'We are partnering with YouTube and TikTok creators to bring you more amazing Hangzhou hotel content.',
    'videos.contact': 'Want to feature your hotel? Contact contact@localpup.com',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.showMore': 'Show More',
    'common.showLess': 'Show Less',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.hotels': '酒店',
    'nav.attractions': '景点',
    'nav.dining': '美食',
    'nav.videos': '视频',
    'nav.exploreHotels': '探索酒店',
    'nav.search': '搜索',
    'nav.language': '语言',
    
    // Hero
    'hero.title1': '探索杭州的',
    'hero.title2': '隐藏瑰宝',
    'hero.subtitle': '为挑剔的国际旅行者精心挑选的酒店、景点和美食体验',
    'hero.location': '目的地',
    'hero.locationValue': '中国杭州',
    'hero.dates': '日期',
    'hero.addDates': '选择日期',
    'hero.guests': '入住人数',
    'hero.guestsValue': '2位成人',
    'hero.searchButton': '搜索酒店',
    'hero.stats.hotels': '精选酒店',
    'hero.stats.travelers': '满意旅客',
    'hero.stats.rating': '平均评分',
    
    // Hotels
    'hotels.badge': '为您精选',
    'hotels.title': '杭州精选酒店',
    'hotels.subtitle': '探索我们精心挑选的顶级住宿，从豪华度假村到精品酒店',
    'hotels.viewAll': '查看全部酒店',
    'hotels.featured': '精选',
    'hotels.perNight': '每晚',
    'hotels.reviews': '条评价',
    'hotels.viewDetails': '查看详情',
    'hotels.bookingRating': 'Booking.com评分',
    'hotels.agodaRating': 'Agoda评分',
    'hotels.hotelscomRating': 'Hotels.com评分',
    'hotels.ctripRating': '携程评分',
    'hotels.fliggyRating': '飞猪评分',
    'hotels.overallRating': '综合评分',
    'hotels.globalPlatforms': '全球平台',
    'hotels.domesticPlatforms': '国内平台',
    'hotels.globalPlatformRatings': '全球平台评分',
    'hotels.domesticPlatformRatings': '国内平台评分',
    'hotels.basedOn': '基于',
    'hotels.outOf5Stars': '（5星制）',
    'hotels.ratingExplanation': '评分说明',
    'hotels.ratingExplanationDetail': '评分聚合自全球前三预订平台（Booking.com、Agoda、Hotels.com）和国内前二平台（携程、飞猪）。各平台使用10分制转换为5星显示。',
    'hotels.imageSource.ctrip': '图片来自携程官方',
    'hotels.imageSource.booking': '图片来自Booking.com',
    'hotels.imageSource.official': '官方图片',
    'hotels.amenities': '设施',
    'hotels.priceRange': '价格范围',
    'hotels.filter.rating': '评分',
    'hotels.filter.location': '位置',
    'hotels.filter.price': '价格范围',
    'hotels.filter.min': '最低',
    'hotels.filter.max': '最高',
    'hotels.filter.recommended': '推荐',
    'hotels.filter.priceLowHigh': '价格：低到高',
    'hotels.filter.priceHighLow': '价格：高到低',
    'hotels.filter.ratingHighLow': '评分：高到低',
    'hotels.results': '家酒店',
    'hotels.filters': '筛选',
    
    // Features
    'features.title1': 'AI智能精选',
    'features.desc1': '我们的智能系统分析数千条评论，为您带来最佳推荐',
    'features.title2': '真实验证评价',
    'features.desc2': '所有评分和评价均来自Booking.com和携程等可信平台',
    'features.title3': '多语言支持',
    'features.desc3': '完整的中英文支持，更多语言即将推出',
    'features.title4': '最优价格保证',
    'features.desc4': '我们比较多个平台的价格，确保您获得最优惠的价格',
    
    // City Guide
    'guide.badge': '探索杭州',
    'guide.title': '发现天堂之城',
    'guide.subtitle': '杭州，马可波罗笔下的"天堂之城"，完美融合自然美景与文化遗产',
    'guide.readMore': '阅读完整旅游指南',
    'guide.westLake.title': '西湖',
    'guide.westLake.desc': '联合国教科文组织世界遗产，杭州的璀璨明珠',
    'guide.lingyin.title': '灵隐寺',
    'guide.lingyin.desc': ' nestled在群山中的古老佛教寺庙',
    'guide.xixi.title': '西溪湿地',
    'guide.xixi.desc': '中国第一个国家湿地公园',
    
    // Newsletter
    'newsletter.title': '获取旅游贴士和独家优惠',
    'newsletter.subtitle': '订阅我们的通讯，获取杭州酒店、景点和特别优惠的最新资讯',
    'newsletter.placeholder': '输入您的邮箱',
    'newsletter.button': '订阅',
    'newsletter.privacy': '我们尊重您的隐私。可随时取消订阅。',
    'newsletter.success': '感谢订阅！',
    
    // Footer
    'footer.description': '您探索杭州最佳酒店、景点和美食体验的可靠伙伴。',
    'footer.explore': '探索',
    'footer.support': '支持',
    'footer.contact': '联系我们',
    'footer.faq': '常见问题',
    'footer.privacy': '隐私政策',
    'footer.stayUpdated': '保持更新',
    'footer.subscribeText': '订阅获取旅游贴士和独家优惠。',
    'footer.emailPlaceholder': '您的邮箱',
    'footer.subscribeBtn': '订阅',
    'footer.copyright': '© 2026 LocalPup. 保留所有权利。',
    
    // Videos
    'videos.title': '精选视频',
    'videos.subtitle': '观看沉浸式视频，展示杭州最佳酒店和体验',
    'videos.badge': '视频库',
    'videos.watchOn': '在',
    'videos.comingSoon': '更多视频即将推出',
    'videos.comingSoonDesc': '我们正在与YouTube和TikTok创作者合作，为您带来更多精彩的杭州酒店内容。',
    'videos.contact': '想展示您的酒店？请联系 contact@localpup.com',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.close': '关闭',
    'common.open': '打开',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.showMore': '显示更多',
    'common.showLess': '显示更少',
  },
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en')

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations['en']?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}