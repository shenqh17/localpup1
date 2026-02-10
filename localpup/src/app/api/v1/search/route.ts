import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 验证 API Key
async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false
  
  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey, isActive: true },
  })
  
  if (!key) return false
  
  // 检查速率限制
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (key.lastResetAt < today) {
    // 重置每日计数
    await prisma.apiKey.update({
      where: { id: key.id },
      data: { requestsToday: 0, lastResetAt: today },
    })
    key.requestsToday = 0
  }
  
  if (key.requestsToday >= key.rateLimit) {
    return false
  }
  
  // 增加请求计数
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { requestsToday: { increment: 1 } },
  })
  
  return true
}

export async function GET(request: Request) {
  try {
    // 获取 API Key
    const apiKey = request.headers.get('X-API-Key')
    
    if (!apiKey || !(await validateApiKey(apiKey))) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or missing API key',
          message: 'Please provide a valid API key in the X-API-Key header'
        },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    
    // 解析查询参数
    const query = searchParams.get('q') || ''
    const city = searchParams.get('city') || 'Hangzhou'
    const district = searchParams.get('district')
    const minRating = parseFloat(searchParams.get('min_rating') || '0')
    const maxPrice = parseInt(searchParams.get('max_price') || '999999')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const includeAiSummary = searchParams.get('ai_summary') === 'true'
    
    // 构建查询条件
    const where: any = {
      city,
      isActive: true,
      overallRating: { gte: minRating },
    }
    
    if (district) {
      where.district = district
    }
    
    if (maxPrice < 999999) {
      where.priceRangeMin = { lte: maxPrice }
    }
    
    // 如果有搜索查询，添加名称过滤
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { district: { contains: query, mode: 'insensitive' } },
      ]
    }
    
    // 查询酒店
    const hotels = await prisma.hotel.findMany({
      where,
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        address: true,
        district: true,
        latitude: true,
        longitude: true,
        description: includeAiSummary ? true : false,
        aiSummary: includeAiSummary ? true : false,
        overallRating: true,
        reviewCount: true,
        bookingRating: true,
        ctripRating: true,
        priceRangeMin: true,
        priceRangeMax: true,
        currency: true,
        amenities: true,
        bookingUrl: true,
        ctripUrl: true,
        images: {
          where: { isOfficial: true },
          orderBy: { order: 'asc' },
          take: 5,
          select: { url: true, caption: true },
        },
      },
      orderBy: { overallRating: 'desc' },
      take: limit,
    })
    
    // 格式化响应
    const formattedHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      nameEn: hotel.nameEn,
      slug: hotel.slug,
      url: `https://localpup.com/hotels/${hotel.slug}`,
      location: {
        address: hotel.address,
        district: hotel.district,
        coordinates: hotel.latitude && hotel.longitude ? {
          lat: hotel.latitude,
          lng: hotel.longitude,
        } : null,
      },
      description: hotel.description,
      aiSummary: hotel.aiSummary,
      ratings: {
        overall: hotel.overallRating,
        reviewCount: hotel.reviewCount,
        booking: hotel.bookingRating,
        ctrip: hotel.ctripRating,
      },
      pricing: {
        min: hotel.priceRangeMin,
        max: hotel.priceRangeMax,
        currency: hotel.currency,
      },
      amenities: hotel.amenities,
      bookingLinks: {
        booking: hotel.bookingUrl,
        ctrip: hotel.ctripUrl,
      },
      images: hotel.images.map(img => img.url),
    }))
    
    return NextResponse.json({
      success: true,
      meta: {
        query,
        city,
        resultsCount: hotels.length,
        timestamp: new Date().toISOString(),
      },
      data: formattedHotels,
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 获取 API 使用信息
export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key')
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing API key' },
        { status: 401 }
      )
    }
    
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      select: {
        name: true,
        rateLimit: true,
        requestsToday: true,
        isActive: true,
      },
    })
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        keyName: key.name,
        isActive: key.isActive,
        rateLimit: key.rateLimit,
        requestsToday: key.requestsToday,
        requestsRemaining: key.rateLimit - key.requestsToday,
      },
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
