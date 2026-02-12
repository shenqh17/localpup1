import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface APIContext {
  prisma: PrismaClient
}

// API Key 验证中间件
export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; keyId?: string; error?: NextResponse }> {
  const apiKey = request.headers.get('X-API-Key') || request.nextUrl.searchParams.get('api_key')

  if (!apiKey) {
    return { valid: false, error: NextResponse.json(
      { error: 'API key is required', code: 'MISSING_API_KEY' },
      { status: 401 }
    )}
  }

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey }
    })

    if (!keyRecord) {
      return { valid: false, error: NextResponse.json(
        { error: 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      )}
    }

    if (!keyRecord.isActive) {
      return { valid: false, error: NextResponse.json(
        { error: 'API key is inactive', code: 'INACTIVE_API_KEY' },
        { status: 403 }
      )}
    }

    // 检查每日请求限制
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (keyRecord.lastResetAt < today) {
      // 重置计数
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { requestsToday: 0, lastResetAt: today }
      })
    } else if (keyRecord.requestsToday >= keyRecord.rateLimit) {
      return { valid: false, error: NextResponse.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED', retryAfter: '明天' },
        { status: 429 }
      )}
    }

    // 更新请求计数
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { requestsToday: { increment: 1 } }
    })

    return { valid: true, keyId: keyRecord.id }
  } catch (error) {
    console.error('API Key validation error:', error)
    return { valid: false, error: NextResponse.json(
      { error: 'Internal server error during validation', code: 'VALIDATION_ERROR' },
      { status: 500 }
    )}
  }
}

// 参数验证函数
export function validateSearchParams(params: {
  page?: string
  limit?: string
  minPrice?: string
  maxPrice?: string
  minRating?: string
}): { page: number; limit: number; minPrice?: number; maxPrice?: number; minRating?: number } | NextResponse {
  const page = parseInt(params.page || '1')
  const limit = Math.min(parseInt(params.limit || '20'), 100) // 限制最大100条
  const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined
  const minRating = params.minRating ? parseFloat(params.minRating) : undefined

  // 验证
  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: 'Invalid page parameter', code: 'INVALID_PAGE' },
      { status: 400 }
    )
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Limit must be between 1 and 100', code: 'INVALID_LIMIT' },
      { status: 400 }
    )
  }

  if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
    return NextResponse.json(
      { error: 'Invalid minPrice parameter', code: 'INVALID_MIN_PRICE' },
      { status: 400 }
    )
  }

  if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
    return NextResponse.json(
      { error: 'Invalid maxPrice parameter', code: 'INVALID_MAX_PRICE' },
      { status: 400 }
    )
  }

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return NextResponse.json(
      { error: 'minPrice cannot be greater than maxPrice', code: 'INVALID_PRICE_RANGE' },
      { status: 400 }
    )
  }

  if (minRating !== undefined && (isNaN(minRating) || minRating < 0 || minRating > 5)) {
    return NextResponse.json(
      { error: 'minRating must be between 0 and 5', code: 'INVALID_MIN_RATING' },
      { status: 400 }
    )
  }

  return { page, limit, minPrice, maxPrice, minRating }
}

// 格式化 API 响应
export function formatResponse<T>(
  success: boolean,
  data: T,
  meta?: { pagination?: Record<string, any>; filters?: Record<string, any> }
): NextResponse {
  const response: Record<string, any> = { success, data }

  if (meta?.pagination) {
    response.pagination = meta.pagination
  }
  if (meta?.filters) {
    response.filters = meta.filters
  }

  return NextResponse.json(response)
}

// 速率限制缓存（内存存储，生产环境建议用 Redis）
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } | NextResponse {
  const now = Date.now()
  const existing = rateLimitCache.get(identifier)

  if (!existing || now > existing.resetTime) {
    // 新窗口
    const resetTime = now + windowMs
    rateLimitCache.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }

  if (existing.count >= limit) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((existing.resetTime - now) / 1000)
      },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((existing.resetTime - now) / 1000)) } }
    )
  }

  existing.count++
  return { allowed: true, remaining: limit - existing.count, resetTime: existing.resetTime }
}
