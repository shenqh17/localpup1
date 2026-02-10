import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 查询参数
    const city = searchParams.get('city') || 'Hangzhou'
    const ratingMin = parseFloat(searchParams.get('rating_min') || '0')
    const priceMin = parseInt(searchParams.get('price_min') || '0')
    const priceMax = parseInt(searchParams.get('price_max') || '999999')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sort') || 'overallRating'
    const order = searchParams.get('order') || 'desc'
    
    const skip = (page - 1) * limit
    
    // 构建查询条件
    const where = {
      city,
      isActive: true,
      overallRating: { gte: ratingMin },
      AND: [
        {
          OR: [
            { priceRangeMin: { gte: priceMin, lte: priceMax } },
            { priceRangeMax: { gte: priceMin, lte: priceMax } },
          ],
        },
      ],
    }
    
    // 获取酒店列表
    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        images: {
          where: { isOfficial: true },
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    })
    
    // 获取总数
    const total = await prisma.hotel.count({ where })
    
    return NextResponse.json({
      success: true,
      data: hotels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}
