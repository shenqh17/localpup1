import { NextRequest, NextResponse } from 'next/server'
import { hotels } from '@/data/hotels100'

// GET /api/v1/search - 搜索酒店
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const query = searchParams.get('q')?.toLowerCase() || ''
  const location = searchParams.get('location') || ''
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
  const sortBy = searchParams.get('sortBy') || 'recommended'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  let results = [...hotels]
  
  // 搜索过滤
  if (query) {
    results = results.filter(hotel => {
      const nameMatch = hotel.name?.toLowerCase().includes(query) || 
                        hotel.nameZh?.includes(query)
      const locationMatch = hotel.location?.toLowerCase().includes(query) ||
                           hotel.locationZh?.includes(query)
      const amenityMatch = hotel.amenities?.some(a => a.toLowerCase().includes(query))
      
      return nameMatch || locationMatch || amenityMatch
    })
  }
  
  // 位置过滤
  if (location) {
    results = results.filter(hotel => 
      hotel.location?.includes(location) || 
      hotel.locationZh?.includes(location)
    )
  }
  
  // 价格过滤
  if (minPrice !== undefined) {
    results = results.filter(hotel => hotel.price >= minPrice)
  }
  if (maxPrice !== undefined) {
    results = results.filter(hotel => hotel.price <= maxPrice)
  }
  
  // 评分过滤
  if (minRating !== undefined) {
    results = results.filter(hotel => hotel.rating >= minRating)
  }
  
  // 排序
  switch (sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      results.sort((a, b) => b.rating - a.rating)
      break
    default:
      // 推荐排序：精选优先，然后按评分
      results.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.rating - a.rating
      })
  }
  
  // 分页
  const total = results.length
  const startIndex = (page - 1) * limit
  const paginatedResults = results.slice(startIndex, startIndex + limit)
  
  // 格式化返回数据
  const formattedResults = paginatedResults.map(hotel => ({
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    nameZh: hotel.nameZh,
    image: hotel.image,
    rating: hotel.rating,
    bookingRating: hotel.bookingRating,
    ctripRating: hotel.ctripRating,
    price: hotel.price,
    location: hotel.location,
    locationZh: hotel.locationZh,
    amenities: hotel.amenities?.slice(0, 5) || [],
    featured: hotel.featured || false,
  }))
  
  return NextResponse.json({
    success: true,
    data: {
      results: formattedResults,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: startIndex + limit < total,
      },
      filters: {
        query,
        location,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
      }
    }
  })
}

// POST /api/v1/search - 高级搜索
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const {
    query,
    location,
    priceRange,
    rating,
    amenities,
    sortBy = 'recommended',
    page = 1,
    limit = 20,
  } = body
  
  let results = [...hotels]
  
  // 搜索词过滤
  if (query && typeof query === 'string') {
    const searchTerm = query.toLowerCase()
    results = results.filter(hotel => 
      hotel.name?.toLowerCase().includes(searchTerm) ||
      hotel.nameZh?.includes(searchTerm) ||
      hotel.location?.toLowerCase().includes(searchTerm) ||
      hotel.locationZh?.includes(searchTerm) ||
      hotel.description?.toLowerCase().includes(searchTerm) ||
      hotel.descriptionZh?.includes(searchTerm)
    )
  }
  
  // 位置过滤
  if (location && typeof location === 'string') {
    results = results.filter(hotel =>
      hotel.location?.includes(location) ||
      hotel.locationZh?.includes(location)
    )
  }
  
  // 价格区间过滤
  if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
    const [min, max] = priceRange
    results = results.filter(hotel => hotel.price >= min && hotel.price <= max)
  }
  
  // 评分过滤
  if (rating && typeof rating === 'number') {
    results = results.filter(hotel => hotel.rating >= rating)
  }
  
  // 设施过滤
  if (amenities && Array.isArray(amenities) && amenities.length > 0) {
    results = results.filter(hotel =>
      amenities.every(amenity => 
        hotel.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      )
    )
  }
  
  // 排序
  switch (sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'reviews-desc':
      results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      break
    default:
      results.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.rating - a.rating
      })
  }
  
  // 分页
  const total = results.length
  const startIndex = (page - 1) * limit
  const paginatedResults = results.slice(startIndex, startIndex + limit)
  
  return NextResponse.json({
    success: true,
    data: {
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }
  })
}
