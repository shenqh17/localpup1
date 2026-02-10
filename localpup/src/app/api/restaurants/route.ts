import { NextResponse } from 'next/server'

const restaurants = [
  {
    id: '1',
    name: 'Lou Wai Lou',
    nameZh: '楼外楼',
    slug: 'lou-wai-lou',
    description: 'Famous Hangzhou restaurant serving traditional West Lake fish',
    descriptionZh: '杭州著名餐厅，供应传统西湖醋鱼',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    rating: 4.5,
    reviewCount: 3240,
    cuisine: 'Hangzhou',
    priceLevel: '¥¥¥',
    city: 'Hangzhou'
  },
  {
    id: '2',
    name: 'Zhi Wei Guan',
    nameZh: '知味观',
    slug: 'zhi-wei-guan',
    description: 'Traditional restaurant famous for Xiaolongbao and Hangzhou snacks',
    descriptionZh: '传统餐厅，以小笼包和杭州小吃闻名',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    rating: 4.4,
    reviewCount: 2890,
    cuisine: 'Hangzhou',
    priceLevel: '¥¥',
    city: 'Hangzhou'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'Hangzhou'
    const cuisine = searchParams.get('cuisine')
    
    let filtered = restaurants.filter(r => r.city === city)
    
    if (cuisine && cuisine !== 'All') {
      filtered = filtered.filter(r => r.cuisine === cuisine)
    }
    
    return NextResponse.json({
      restaurants: filtered,
      total: filtered.length
    })
  } catch (error) {
    console.error('Restaurants API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants', restaurants: [], total: 0 },
      { status: 500 }
    )
  }
}
