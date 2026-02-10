import { NextResponse } from 'next/server'
import { hotels } from '@/data/hotels100'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query
      })
    }
    
    const results: any[] = []
    const lowerQuery = query.toLowerCase()
    
    // 搜索酒店
    if (type === 'all' || type === 'hotels') {
      const matchedHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(lowerQuery) ||
        h.nameZh?.toLowerCase().includes(lowerQuery) ||
        h.location.toLowerCase().includes(lowerQuery) ||
        h.description.toLowerCase().includes(lowerQuery)
      ).slice(0, 10)
      
      results.push(...matchedHotels.map(h => ({
        ...h,
        type: 'hotel'
      })))
    }
    
    return NextResponse.json({
      results,
      total: results.length,
      query
    })
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [], total: 0, query: '' },
      { status: 500 }
    )
  }
}
