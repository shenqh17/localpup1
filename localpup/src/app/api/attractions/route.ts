import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city') || 'Hangzhou'
    const category = searchParams.get('category')
    const isFree = searchParams.get('free') === 'true'
    const isUnesco = searchParams.get('unesco') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const skip = (page - 1) * limit
    
    // 构建查询条件
    const where: any = {
      city,
      isActive: true,
    }
    
    if (category && category !== 'All') {
      where.category = category
    }
    
    if (isFree) {
      where.isFree = true
    }
    
    if (isUnesco) {
      where.isUnesco = true
    }
    
    // 获取景点列表
    const attractions = await prisma.attraction.findMany({
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
    const total = await prisma.attraction.count({ where })
    
    return NextResponse.json({
      success: true,
      data: attractions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching attractions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attractions' },
      { status: 500 }
    )
  }
}
