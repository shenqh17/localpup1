import { Hotel } from './hotels100'

// 计算酒店综合评分（加权平均）
export function calculateOverallRating(hotel: Hotel): number {
  const weights = {
    bookingRating: 1.2,    // Booking.com权重最高
    agodaRating: 1.1,      // Agoda次之
    hotelscomRating: 1.0,  // Hotels.com
    ctripRating: 1.3,      // 携程权重较高（国内主要平台）
    fliggyRating: 1.2      // 飞猪权重较高
  }
  
  // 处理可选属性，如果不存在则使用0
  const agodaRating = hotel.agodaRating || 0
  const hotelscomRating = hotel.hotelscomRating || 0
  const fliggyRating = hotel.fliggyRating || 0
  
  const weightedSum = 
    hotel.bookingRating * weights.bookingRating +
    agodaRating * weights.agodaRating +
    hotelscomRating * weights.hotelscomRating +
    hotel.ctripRating * weights.ctripRating +
    fliggyRating * weights.fliggyRating
  
  const totalWeight = 
    weights.bookingRating + 
    weights.agodaRating + 
    weights.hotelscomRating + 
    weights.ctripRating + 
    weights.fliggyRating
  
  return weightedSum / totalWeight
}

// 按综合评分从高到低排序
export function sortHotelsByRating(hotels: Hotel[]): Hotel[] {
  return [...hotels].sort((a, b) => {
    const ratingA = calculateOverallRating(a)
    const ratingB = calculateOverallRating(b)
    return ratingB - ratingA // 降序排列
  })
}

// 按价格范围筛选
export function filterHotelsByPrice(hotels: Hotel[], minPrice: number, maxPrice: number): Hotel[] {
  return hotels.filter(hotel => hotel.price >= minPrice && hotel.price <= maxPrice)
}

// 按价格等级分组
export function groupHotelsByPriceLevel(hotels: Hotel[]): Record<string, Hotel[]> {
  const groups: Record<string, Hotel[]> = {
    luxury: [],    // ¥1500+
    premium: [],   // ¥800-1500
    midscale: [],  // ¥400-800
    budget: [],    // ¥200-400
    homestay: []   // ¥0-200
  }
  
  hotels.forEach(hotel => {
    if (hotel.price >= 1500) {
      groups.luxury.push(hotel)
    } else if (hotel.price >= 800) {
      groups.premium.push(hotel)
    } else if (hotel.price >= 400) {
      groups.midscale.push(hotel)
    } else if (hotel.price >= 200) {
      groups.budget.push(hotel)
    } else {
      groups.homestay.push(hotel)
    }
  })
  
  return groups
}

// 获取价格统计
export function getPriceStatistics(hotels: Hotel[]) {
  if (hotels.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 }
  }
  
  const prices = hotels.map(h => h.price).sort((a, b) => a - b)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const median = prices[Math.floor(prices.length / 2)]
  
  return { min, max, avg, median }
}

// 获取评分统计
export function getRatingStatistics(hotels: Hotel[]) {
  if (hotels.length === 0) {
    return { 
      overall: { min: 0, max: 0, avg: 0 },
      booking: { min: 0, max: 0, avg: 0 },
      agoda: { min: 0, max: 0, avg: 0 },
      hotelscom: { min: 0, max: 0, avg: 0 },
      ctrip: { min: 0, max: 0, avg: 0 },
      fliggy: { min: 0, max: 0, avg: 0 }
    }
  }
  
  const calculateStats = (ratings: number[]) => ({
    min: Math.min(...ratings),
    max: Math.max(...ratings),
    avg: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  })
  
  return {
    overall: calculateStats(hotels.map(h => calculateOverallRating(h))),
    booking: calculateStats(hotels.map(h => h.bookingRating)),
    agoda: calculateStats(hotels.map(h => h.agodaRating || 0)),
    hotelscom: calculateStats(hotels.map(h => h.hotelscomRating || 0)),
    ctrip: calculateStats(hotels.map(h => h.ctripRating)),
    fliggy: calculateStats(hotels.map(h => h.fliggyRating || 0))
  }
}

// 获取顶级酒店（评分前10%）
export function getTopRatedHotels(hotels: Hotel[], percentage: number = 10): Hotel[] {
  const sorted = sortHotelsByRating(hotels)
  const count = Math.max(1, Math.floor(sorted.length * (percentage / 100)))
  return sorted.slice(0, count)
}

// 获取各价位顶级酒店
export function getTopHotelsByPriceLevel(hotels: Hotel[], countPerLevel: number = 3): Record<string, Hotel[]> {
  const groups = groupHotelsByPriceLevel(hotels)
  const result: Record<string, Hotel[]> = {}
  
  Object.entries(groups).forEach(([level, levelHotels]) => {
    const sorted = sortHotelsByRating(levelHotels)
    result[level] = sorted.slice(0, countPerLevel)
  })
  
  return result
}

// 导出排序后的酒店数据
export function getSortedHotels(hotels: Hotel[]): Hotel[] {
  return sortHotelsByRating(hotels)
}