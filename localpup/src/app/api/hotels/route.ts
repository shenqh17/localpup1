import { NextResponse } from 'next/server'
import { hotels } from '@/data/hotels100'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const location = searchParams.get('location')
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '99999')
    const amenities = searchParams.get('amenities')?.split(',') || []
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let filtered = hotels
    
    if (location && location !== 'All') {
      filtered = filtered.filter(h => 
        h.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    filtered = filtered.filter(h => h.price >= minPrice && h.price <= maxPrice)
    
    if (amenities.length > 0 && amenities[0] !== '') {
      filtered = filtered.filter(h => 
        amenities.some(a => h.amenities.includes(a))
      )
    }
    
    const skip = (page - 1) * limit
    const paginated = filtered.slice(skip, skip + limit)
    
    return NextResponse.json({
      hotels: paginated,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit)
    })
  } catch (error) {
    console.error('Hotels API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels', hotels: [], total: 0, page: 1, totalPages: 0 },
      { status: 500 }
    )
  }
}
