/**
 * 评分自动更新 API
 * 支持手动触发和定时任务调用
 * 自动重新计算所有酒店的综合评分
 */

import { NextRequest, NextResponse } from 'next/server'
import { calculateWeightedScore } from '@/lib/rating-converter'

// API配置
const API_KEY = process.env.RATING_UPDATE_API_KEY || 'your-secret-api-key'

// 模拟酒店数据源（实际应从数据库获取）
interface HotelData {
  id: string
  name: string
  nameZh: string
  bookingRating?: number
  bookingReviewCount?: number
  agodaRating?: number
  agodaReviewCount?: number
  hotelscomRating?: number
  hotelscomReviewCount?: number
  airbnbRating?: number
  airbnbReviewCount?: number
  ctripRating?: number
  ctripReviewCount?: number
  fliggyRating?: number
  fliggyReviewCount?: number
  lastUpdatedAt?: string
}

// 更新日志记录
interface UpdateLog {
  timestamp: string
  hotelId: string
  hotelName: string
  oldScore?: number
  newScore?: number
  change?: number
  status: 'success' | 'skipped' | 'error'
  error?: string
}

// 验证API密钥
function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key')
  return apiKey === API_KEY
}

// 从数据库获取酒店数据（示例函数）
async function getHotelsFromDb(): Promise<HotelData[]> {
  // TODO: 从Prisma数据库获取真实数据
  // 实际实现：
  // return await prisma.hotel.findMany({
  //   include: { reviews: true }
  // })

  // 返回模拟数据
  return []
}

// 保存更新后的评分到数据库（示例函数）
async function saveRatingToDb(hotelId: string, newScore: number): Promise<boolean> {
  // TODO: 更新Prisma数据库
  // 实际实现：
  // await prisma.hotel.update({
  //   where: { id: hotelId },
  //   data: {
  //     pupRating: newScore,
  //     lastRatingUpdate: new Date()
  //   }
  // })

  return true
}

// 计算评分并返回变化
function calculateRatingChange(hotel: HotelData): {
  oldScore: number | undefined
  newScore: number
  change: number | undefined
} {
  const oldScore = hotel.lastUpdatedAt ? undefined : undefined // 从数据库获取旧评分
  const newScore = calculateWeightedScore(hotel)
  const change = oldScore ? newScore - oldScore : undefined

  return { oldScore, newScore, change }
}

// POST - 触发评分更新
export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    if (!verifyApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hotelIds, forceUpdate } = body

    // 获取酒店数据
    const hotels = await getHotelsFromDb()

    // 过滤需要更新的酒店
    let hotelsToUpdate = hotels
    if (hotelIds && hotelIds.length > 0) {
      hotelsToUpdate = hotels.filter(h => hotelIds.includes(h.id))
    }

    // 如果指定了forceUpdate但没有指定hotelIds，返回错误
    if (forceUpdate && (!hotelIds || hotelIds.length === 0)) {
      return NextResponse.json(
        { error: 'Bad Request - hotelIds required when forceUpdate is true' },
        { status: 400 }
      )
    }

    // 执行更新
    const results: UpdateLog[] = []
    const now = new Date().toISOString()

    for (const hotel of hotelsToUpdate) {
      const { oldScore, newScore, change } = calculateRatingChange(hotel)

      // 检查是否需要更新（评分变化大于阈值或强制更新）
      const shouldUpdate = forceUpdate ||
        !hotel.lastUpdatedAt ||
        change === undefined ||
        Math.abs(change) >= 0.1

      if (shouldUpdate) {
        const success = await saveRatingToDb(hotel.id, newScore)

        results.push({
          timestamp: now,
          hotelId: hotel.id,
          hotelName: hotel.nameZh || hotel.name,
          oldScore,
          newScore,
          change,
          status: success ? 'success' : 'error'
        })
      } else {
        results.push({
          timestamp: now,
          hotelId: hotel.id,
          hotelName: hotel.nameZh || hotel.name,
          oldScore,
          newScore,
          change: 0,
          status: 'skipped'
        })
      }
    }

    const successCount = results.filter(r => r.status === 'success').length
    const skippedCount = results.filter(r => r.status === 'skipped').length
    const errorCount = results.filter(r => r.status === 'error').length

    return NextResponse.json({
      success: true,
      message: `更新完成: ${successCount}成功, ${skippedCount}跳过, ${errorCount}失败`,
      summary: {
        total: results.length,
        success: successCount,
        skipped: skippedCount,
        error: errorCount
      },
      results,
      updatedAt: now
    })

  } catch (error) {
    console.error('评分更新错误:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET - 获取更新状态和统计
export async function GET(request: NextRequest) {
  try {
    // 验证API密钥
    if (!verifyApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      )
    }

    // 返回当前评分系统状态
    return NextResponse.json({
      status: 'active',
      algorithm: {
        version: '2.1',
        platforms: ['Booking.com', 'Agoda', 'Hotels.com', 'Airbnb', 'Ctrip', 'Fliggy'],
        factors: ['platformWeight', 'reviewCount', 'timeDecay']
      },
      updateSchedule: {
        frequency: 'weekly',
        day: 'Monday',
        time: '03:00 UTC'
      },
      lastUpdate: null, // 从数据库获取
      nextUpdate: null // 计算下次更新时间
    })

  } catch (error) {
    console.error('获取状态错误:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
