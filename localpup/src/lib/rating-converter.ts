/**
 * 智能评分换算算法
 * 将不同平台的评分统一换算为10分制
 */

// 平台权重配置（基于平台权威性和用户覆盖）
export const PLATFORM_WEIGHTS = {
  booking: 1.0,      // Booking.com - 国际权威
  agoda: 0.9,        // Agoda - 国际权威
  hotelscom: 0.85,   // Hotels.com - 国际权威
  airbnb: 0.8,       // Airbnb - 共享经济权威
  ctrip: 1.1,        // 携程 - 国内权威，权重稍高
  fliggy: 1.0,       // 飞猪 - 国内重要平台
} as const

// 置信度因子（基于评论数量）
export const CONFIDENCE_FACTORS = {
  high: 1.0,     // 1000+ 评论
  medium: 0.95,  // 100-999 评论
  low: 0.9,      // 10-99 评论
  veryLow: 0.85, // 1-9 评论
  none: 0.0,     // 无评论
} as const

// 时间衰减因子（评分新鲜度）
export const TIME_DECAY_FACTORS = {
  recent: 1.0,   // 最近30天
  month: 0.95,   // 1-3个月
  quarter: 0.9,  // 3-6个月
  halfYear: 0.85, // 6-12个月
  year: 0.8,     // 1年以上
} as const

/**
 * 获取置信度因子
 */
export function getConfidenceFactor(reviewCount?: number): number {
  if (!reviewCount || reviewCount === 0) return CONFIDENCE_FACTORS.none
  if (reviewCount >= 1000) return CONFIDENCE_FACTORS.high
  if (reviewCount >= 100) return CONFIDENCE_FACTORS.medium
  if (reviewCount >= 10) return CONFIDENCE_FACTORS.low
  return CONFIDENCE_FACTORS.veryLow
}

/**
 * 智能换算5分制到10分制
 * 考虑评分分布特性，不是简单乘以2
 */
export function convert5To10(
  rating5: number, 
  platform: 'ctrip' | 'fliggy',
  reviewCount?: number
): number {
  if (!rating5 || rating5 <= 0) return 0
  
  // 基础换算
  let rating10 = rating5 * 2
  
  // 平台特性调整
  if (platform === 'ctrip') {
    // 携程评分通常较严格，高分更有价值
    if (rating5 >= 4.8) rating10 += 0.3  // 4.8+ → 9.9+
    else if (rating5 >= 4.5) rating10 += 0.2  // 4.5+ → 9.2+
    else if (rating5 >= 4.0) rating10 += 0.1  // 4.0+ → 8.1+
  } else if (platform === 'fliggy') {
    // 飞猪评分相对宽松，适当调整
    if (rating5 >= 4.8) rating10 += 0.2  // 4.8+ → 9.8+
    else if (rating5 >= 4.5) rating10 += 0.1  // 4.5+ → 9.1+
  }
  
  // 置信度调整
  const confidence = getConfidenceFactor(reviewCount)
  rating10 *= confidence
  
  // 确保在0-10范围内
  return Math.min(10, Math.max(0, parseFloat(rating10.toFixed(1))))
}

/**
 * 计算加权综合评分（10分制）
 */
export function calculateWeightedScore(hotel: {
  bookingRating?: number
  agodaRating?: number
  hotelscomRating?: number
  airbnbRating?: number
  ctripRating?: number
  fliggyRating?: number
  bookingReviewCount?: number
  agodaReviewCount?: number
  hotelscomReviewCount?: number
  airbnbReviewCount?: number
  ctripReviewCount?: number
  fliggyReviewCount?: number
}): number {
  const scores: Array<{score: number, weight: number}> = []
  
  // Booking.com
  if (hotel.bookingRating && hotel.bookingRating > 0) {
    const confidence = getConfidenceFactor(hotel.bookingReviewCount)
    scores.push({
      score: hotel.bookingRating,
      weight: PLATFORM_WEIGHTS.booking * confidence
    })
  }
  
  // Agoda
  if (hotel.agodaRating && hotel.agodaRating > 0) {
    const confidence = getConfidenceFactor(hotel.agodaReviewCount)
    scores.push({
      score: hotel.agodaRating,
      weight: PLATFORM_WEIGHTS.agoda * confidence
    })
  }
  
  // Hotels.com
  if (hotel.hotelscomRating && hotel.hotelscomRating > 0) {
    const confidence = getConfidenceFactor(hotel.hotelscomReviewCount)
    scores.push({
      score: hotel.hotelscomRating,
      weight: PLATFORM_WEIGHTS.hotelscom * confidence
    })
  }
  
  // Airbnb
  if (hotel.airbnbRating && hotel.airbnbRating > 0) {
    const confidence = getConfidenceFactor(hotel.airbnbReviewCount)
    scores.push({
      score: hotel.airbnbRating,
      weight: PLATFORM_WEIGHTS.airbnb * confidence
    })
  }
  
  // 携程（需要换算）
  if (hotel.ctripRating && hotel.ctripRating > 0) {
    const score10 = convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount)
    const confidence = getConfidenceFactor(hotel.ctripReviewCount)
    scores.push({
      score: score10,
      weight: PLATFORM_WEIGHTS.ctrip * confidence
    })
  }
  
  // 飞猪（需要换算）
  if (hotel.fliggyRating && hotel.fliggyRating > 0) {
    const score10 = convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount)
    const confidence = getConfidenceFactor(hotel.fliggyReviewCount)
    scores.push({
      score: score10,
      weight: PLATFORM_WEIGHTS.fliggy * confidence
    })
  }
  
  // 如果没有有效评分，返回0
  if (scores.length === 0) return 0
  
  // 计算加权平均
  const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0)
  const weightedSum = scores.reduce((sum, item) => sum + (item.score * item.weight), 0)
  
  return parseFloat((weightedSum / totalWeight).toFixed(1))
}

/**
 * 获取可用的评分平台数量
 */
export function getAvailablePlatforms(hotel: {
  bookingRating?: number
  agodaRating?: number
  hotelscomRating?: number
  airbnbRating?: number
  ctripRating?: number
  fliggyRating?: number
}): number {
  let count = 0
  if (hotel.bookingRating && hotel.bookingRating > 0) count++
  if (hotel.agodaRating && hotel.agodaRating > 0) count++
  if (hotel.hotelscomRating && hotel.hotelscomRating > 0) count++
  if (hotel.airbnbRating && hotel.airbnbRating > 0) count++
  if (hotel.ctripRating && hotel.ctripRating > 0) count++
  if (hotel.fliggyRating && hotel.fliggyRating > 0) count++
  return count
}

/**
 * 获取评分统计信息
 */
export function getRatingStats(hotel: {
  bookingRating?: number
  agodaRating?: number
  hotelscomRating?: number
  airbnbRating?: number
  ctripRating?: number
  fliggyRating?: number
  bookingReviewCount?: number
  agodaReviewCount?: number
  hotelscomReviewCount?: number
  airbnbReviewCount?: number
  ctripReviewCount?: number
  fliggyReviewCount?: number
}): {
  weightedScore: number
  availablePlatforms: number
  totalReviews: number
  platformScores: Array<{platform: string, score: number, originalScore: number}>
} {
  const weightedScore = calculateWeightedScore(hotel)
  const availablePlatforms = getAvailablePlatforms(hotel)
  
  // 计算总评论数
  const totalReviews = 
    (hotel.bookingReviewCount || 0) +
    (hotel.agodaReviewCount || 0) +
    (hotel.hotelscomReviewCount || 0) +
    (hotel.airbnbReviewCount || 0) +
    (hotel.ctripReviewCount || 0) +
    (hotel.fliggyReviewCount || 0)
  
  // 各平台评分（换算后）
  const platformScores = []
  
  if (hotel.bookingRating && hotel.bookingRating > 0) {
    platformScores.push({
      platform: 'booking',
      score: hotel.bookingRating,
      originalScore: hotel.bookingRating
    })
  }
  
  if (hotel.agodaRating && hotel.agodaRating > 0) {
    platformScores.push({
      platform: 'agoda',
      score: hotel.agodaRating,
      originalScore: hotel.agodaRating
    })
  }
  
  if (hotel.hotelscomRating && hotel.hotelscomRating > 0) {
    platformScores.push({
      platform: 'hotelscom',
      score: hotel.hotelscomRating,
      originalScore: hotel.hotelscomRating
    })
  }
  
  if (hotel.airbnbRating && hotel.airbnbRating > 0) {
    platformScores.push({
      platform: 'airbnb',
      score: hotel.airbnbRating,
      originalScore: hotel.airbnbRating
    })
  }
  
  if (hotel.ctripRating && hotel.ctripRating > 0) {
    const score10 = convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount)
    platformScores.push({
      platform: 'ctrip',
      score: score10,
      originalScore: hotel.ctripRating
    })
  }
  
  if (hotel.fliggyRating && hotel.fliggyRating > 0) {
    const score10 = convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount)
    platformScores.push({
      platform: 'fliggy',
      score: score10,
      originalScore: hotel.fliggyRating
    })
  }
  
  return {
    weightedScore,
    availablePlatforms,
    totalReviews,
    platformScores
  }
}