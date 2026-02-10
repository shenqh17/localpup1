import { NextResponse } from 'next/server'

// 模拟景点数据
const attractions = [
  {
    id: '1',
    name: 'West Lake',
    nameZh: '西湖',
    slug: 'west-lake',
    description: 'UNESCO World Heritage Site, famous for its scenic beauty',
    descriptionZh: '世界文化遗产，以其美丽的风景闻名',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.9,
    reviewCount: 12580,
    isFree: true,
    isUnesco: true,
    category: 'Nature',
    city: 'Hangzhou'
  },
  {
    id: '2',
    name: 'Lingyin Temple',
    nameZh: '灵隐寺',
    slug: 'lingyin-temple',
    description: 'Ancient Buddhist temple with over 1600 years of history',
    descriptionZh: '拥有1600多年历史的古老佛教寺庙',
    image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80',
    rating: 4.7,
    reviewCount: 8560,
    isFree: false,
    isUnesco: false,
    category: 'Culture',
    city: 'Hangzhou'
  },
  {
    id: '3',
    name: 'Xixi Wetland',
    nameZh: '西溪湿地',
    slug: 'xixi-wetland',
    description: 'National wetland park with rich biodiversity',
    descriptionZh: '国家湿地公园，生物多样性丰富',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    rating: 4.6,
    reviewCount: 6230,
    isFree: false,
    isUnesco: false,
    category: 'Nature',
    city: 'Hangzhou'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city') || 'Hangzhou'
    const category = searchParams.get('category')
    const isFree = searchParams.get('free') === 'true'
    const isUnesco = searchParams.get('unesco') === 'true'
    
    // 过滤数据
    let filtered = attractions.filter(a => a.city === city)
    
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category === category)
    }
    
    if (isFree) {
      filtered = filtered.filter(a => a.isFree)
    }
    
    if (isUnesco) {
      filtered = filtered.filter(a => a.isUnesco)
    }
    
    return NextResponse.json({
      attractions: filtered,
      total: filtered.length
    })
  } catch (error) {
    console.error('Attractions API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attractions', attractions: [], total: 0 },
      { status: 500 }
    )
  }
}
