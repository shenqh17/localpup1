import { Hotel } from '@/data/hotels100'

// 平台权重配置
export const PLATFORM_WEIGHTS = {
  booking: 1.2,    // Booking.com - 最高权重
  agoda: 1.0,      // Agoda - 重要参考
  hotelscom: 0.95, // Hotels.com - 重要参考
  airbnb: 0.85,    // Airbnb - 参考
  ctrip: 1.1,      // 携程 - 国内平台权重较高
  fliggy: 1.0      // 飞猪 - 国内平台
} as const

// 置信度因子：基于评论数量
export function getConfidenceFactor(reviewCount?: number): number {
  if (!reviewCount || reviewCount === 0) return 0.5
  if (reviewCount < 100) return 0.7
  if (reviewCount < 500) return 0.8
  if (reviewCount < 1000) return 0.9
  return 1.0
}

/**
 * 将5分制评分转换为10分制（非线性转换）
 * 考虑平台特点和评论数量
 */
export function convert5To10(
  rating5: number,
  platform: 'ctrip' | 'fliggy' | 'airbnb',
  reviewCount?: number
): number {
  // 确保评分在1-5范围内
  const clamped = Math.max(1, Math.min(5, rating5))
  
  // 基础转换：5分制 → 10分制
  let baseScore = (clamped / 5) * 10
  
  // 平台调整因子
  const platformAdjustment = platform === 'ctrip' ? 0.2 : platform === 'fliggy' ? 0.1 : 0
  
  // 评论数量调整（评论越多，可信度越高）
  const reviewAdjustment = getConfidenceFactor(reviewCount) * 0.15
  
  // 非线性转换：高分平台适当加分，低分平台适当减分
  let adjustedScore = baseScore
  if (clamped >= 4.5) {
    // 4.5分以上：转换为9.0-10.0分
    adjustedScore = 9.0 + ((clamped - 4.5) / 0.5) * 1.0
  } else if (clamped >= 4.0) {
    // 4.0-4.5分：转换为8.0-9.0分
    adjustedScore = 8.0 + ((clamped - 4.0) / 0.5) * 1.0
  } else if (clamped >= 3.5) {
    // 3.5-4.0分：转换为7.0-8.0分
    adjustedScore = 7.0 + ((clamped - 3.5) / 0.5) * 1.0
  } else {
    // 3.5分以下：转换为6.0-7.0分
    adjustedScore = 6.0 + ((clamped - 3.0) / 0.5) * 1.0
  }
  
  // 应用平台和评论调整
  adjustedScore += platformAdjustment + reviewAdjustment
  
  // 确保在合理范围内（6.0-10.0）
  return parseFloat(Math.max(6.0, Math.min(10.0, adjustedScore)).toFixed(1))
}

/**
 * 计算加权综合评分
 * 新算法：携程+飞猪的评分和除以4/2.5*10分为最后得分与 Booking.com、Agoda、Airbnb与Hotels.com的平均分
 * 目标：综合评分应与Booking评分相近
 */
export function calculateWeightedScore(hotel: Hotel): number {
  // 1. 计算5分制平台（携程+飞猪）的加权10分制得分
  let ctripScore = 0
  let fliggyScore = 0
  let domesticWeight = 0
  
  if (hotel.ctripRating && hotel.ctripRating > 0) {
    ctripScore = convert5To10(hotel.ctripRating, 'ctrip', hotel.ctripReviewCount)
    domesticWeight += PLATFORM_WEIGHTS.ctrip * getConfidenceFactor(hotel.ctripReviewCount)
  }
  
  if (hotel.fliggyRating && hotel.fliggyRating > 0) {
    fliggyScore = convert5To10(hotel.fliggyRating, 'fliggy', hotel.fliggyReviewCount)
    domesticWeight += PLATFORM_WEIGHTS.fliggy * getConfidenceFactor(hotel.fliggyReviewCount)
  }
  
  // 携程+飞猪的评分和除以4/2.5*10分
  const domesticTotal = ctripScore + fliggyScore
  const domesticAverage = domesticWeight > 0 ? domesticTotal / 2 : 0
  const domesticFinal = (domesticAverage / 4) * 2.5 * 10
  
  // 2. 计算国际平台（Booking.com、Agoda、Airbnb、Hotels.com）的平均分
  const internationalScores: number[] = []
  const internationalWeights: number[] = []
  
  // Booking.com - 主要参考，权重最高
  if (hotel.bookingRating && hotel.bookingRating > 0) {
    internationalScores.push(hotel.bookingRating)
    internationalWeights.push(PLATFORM_WEIGHTS.booking * getConfidenceFactor(hotel.bookingReviewCount))
  }
  
  // Agoda - 重要参考
  if (hotel.agodaRating && hotel.agodaRating > 0) {
    internationalScores.push(hotel.agodaRating)
    internationalWeights.push(PLATFORM_WEIGHTS.agoda * getConfidenceFactor(hotel.agodaReviewCount))
  }
  
  // Hotels.com - 重要参考
  if (hotel.hotelscomRating && hotel.hotelscomRating > 0) {
    internationalScores.push(hotel.hotelscomRating)
    internationalWeights.push(PLATFORM_WEIGHTS.hotelscom * getConfidenceFactor(hotel.hotelscomReviewCount))
  }
  
  // Airbnb - 参考（需要转换为10分制）
  if (hotel.airbnbRating && hotel.airbnbRating > 0) {
    const airbnb10 = convert5To10(hotel.airbnbRating, 'airbnb', hotel.airbnbReviewCount)
    internationalScores.push(airbnb10)
    internationalWeights.push(PLATFORM_WEIGHTS.airbnb * getConfidenceFactor(hotel.airbnbReviewCount))
  }
  
  // 计算国际平台加权平均
  let internationalFinal = 0
  if (internationalScores.length > 0) {
    const totalWeight = internationalWeights.reduce((sum, w) => sum + w, 0)
    const weightedSum = internationalScores.reduce((sum, score, i) => sum + score * internationalWeights[i], 0)
    internationalFinal = weightedSum / totalWeight
  }
  
  // 3. 综合计算：国内平台得分（40%） + 国际平台得分（60%）
  // 确保综合评分与Booking评分相近
  const bookingScore = hotel.bookingRating || 8.8
  let finalScore = 0
  
  if (domesticFinal > 0 && internationalFinal > 0) {
    // 双平台都有数据：40%国内 + 60%国际
    finalScore = (domesticFinal * 0.4) + (internationalFinal * 0.6)
  } else if (internationalFinal > 0) {
    // 只有国际平台数据
    finalScore = internationalFinal
  } else if (domesticFinal > 0) {
    // 只有国内平台数据
    finalScore = domesticFinal
  } else {
    // 无数据，返回默认值
    finalScore = 8.5
  }
  
  // 4. 确保综合评分与Booking评分相近（±0.3范围内）
  const bookingDiff = Math.abs(finalScore - bookingScore)
  if (bookingDiff > 0.3) {
    // 调整到与Booking评分相近
    finalScore = bookingScore + (finalScore > bookingScore ? -0.2 : 0.2)
  }
  
  // 确保评分在合理范围内（7.0-9.8）
  finalScore = Math.max(7.0, Math.min(9.8, finalScore))
  
  return parseFloat(finalScore.toFixed(1))
}

/**
 * 获取评分统计信息
 */
export function getRatingStats(hotel: Hotel) {
  const weightedScore = calculateWeightedScore(hotel)
  
  // 统计有效平台数量
  const availablePlatforms = [
    hotel.bookingRating,
    hotel.agodaRating,
    hotel.hotelscomRating,
    hotel.airbnbRating,
    hotel.ctripRating,
    hotel.fliggyRating
  ].filter(rating => rating && rating > 0).length
  
  // 统计总评论数
  const totalReviews = [
    hotel.bookingReviewCount || 0,
    hotel.agodaReviewCount || 0,
    hotel.hotelscomReviewCount || 0,
    hotel.airbnbReviewCount || 0,
    hotel.ctripReviewCount || 0,
    hotel.fliggyReviewCount || 0
  ].reduce((sum, count) => sum + count, 0)
  
  return {
    weightedScore,
    availablePlatforms,
    totalReviews,
    algorithmVersion: '2.2' // 新算法版本
  }
}