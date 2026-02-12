import type { Metadata } from 'next'
import Script from 'next/script'
import { Hero, RegionCards } from '@/components/Hero'
import { FeaturedHotels } from '@/components/FeaturedHotels'
import { Features } from '@/components/Features'
import { CityGuide } from '@/components/CityGuide'
import { PriceFilter } from '@/components/PriceFilter'
import { Newsletter } from '@/components/Newsletter'

// SEO 优化配置
export const metadata: Metadata = {
  title: '发现杭州最佳酒店 | LocalPup - 杭州酒店精选推荐平台',
  description: '发现杭州最佳酒店，精选西湖、钱江新城、滨江、武林等区域优质住宿。价格透明、真实评价、高分筛选，为您的杭州之旅找到完美住宿。',
  keywords: ['杭州酒店', '西湖酒店', '杭州住宿', '钱江新城酒店', '杭州旅游', '杭州酒店预订'],
  authors: [{ name: 'LocalPup' }],
  openGraph: {
    title: '发现杭州最佳酒店 | LocalPup',
    description: '精选杭州500+优质酒店，为您的杭州之旅找到完美住宿',
    url: 'https://localpup.com',
    siteName: 'LocalPup',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: '杭州西湖美景',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '发现杭州最佳酒店 | LocalPup',
    description: '精选杭州500+优质酒店，为您的杭州之旅找到完美住宿',
    images: ['https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://localpup.com',
  },
}

// 结构化数据 - JSON-LD
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://localpup.com/#website',
      url: 'https://localpup.com',
      name: 'LocalPup - 杭州酒店精选推荐',
      description: '发现杭州最佳酒店，精选西湖、钱江新城、滨江等区域优质住宿',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://localpup.com/hotels?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://localpup.com/#organization',
      name: 'LocalPup',
      url: 'https://localpup.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://localpup.com/logo.png',
      },
      sameAs: [
        'https://weibo.com/localpup',
        'https://twitter.com/localpup',
      ],
    },
    {
      '@type': 'TravelAgency',
      name: 'LocalPup 杭州酒店预订',
      description: '专业杭州酒店预订服务，精选高品质住宿',
      url: 'https://localpup.com',
      areaServed: {
        '@type': 'City',
        name: '杭州',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '杭州',
          addressRegion: '浙江',
          addressCountry: 'CN',
        },
      },
      priceRange: '¥¥',
    },
    {
      '@type': 'ItemList',
      name: '杭州热门酒店推荐',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'LodgingReservation',
            name: '杭州西子湖四季酒店',
            description: '西湖畔的奢华度假酒店，融合传统园林美学',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '杭州',
              addressRegion: '浙江',
              streetAddress: '西湖区灵隐路5号',
            },
            priceRange: '¥2800+',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '2847',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'LodgingReservation',
            name: '杭州柏悦酒店',
            description: '钱江新城CBD核心位置的现代奢华酒店',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '杭州',
              addressRegion: '浙江',
            },
            priceRange: '¥1800+',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '1923',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'LodgingReservation',
            name: '法云安缦',
            description: '灵隐寺旁的古村落隐世酒店',
            address: {
              '@type': 'PostalAddress',
              addressLocality: '杭州',
              addressRegion: '浙江',
            },
            priceRange: '¥6500+',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '892',
            },
          },
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      {/* 结构化数据 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 页面内容 */}
      <Hero />
      <RegionCards />
      <Features />
      <FeaturedHotels />
      <PriceFilter />
      <CityGuide />
      <Newsletter />
    </>
  )
}
