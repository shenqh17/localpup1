import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city') || 'Hangzhou'
    const cuisine = searchParams.get('cuisine')
    const priceRange = searchParams.get('price_range')
    const isMichelin = searchParams.get('michelin') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const skip = (page - 1) * limit
    
    // 构建查询条件
    const where: any = {
      city,
      isActive: true,
    }
    
    if (cuisine && cuisine !== 'All') {
      where.cuisine = { has: cuisine }
    }
    
    if (priceRange && priceRange !== 'All') {
      where.priceRange = priceRange
    }
    
    if (isMichelin) {
      where.isMichelin = true
    }
    
    // 获取餐厅列表
    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        images: {
          where: { isOfficial: true },
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { overallRating: 'desc' },
      skip,
      take: limit,
    })
    
    // 获取总数
    const total = await prisma.restaurant.count({ where })
    
    return NextResponse.json({
      success: true,
      data: restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
