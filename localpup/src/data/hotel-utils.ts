import { Hotel } from './hotels100'

// 5分制转10分制（使用智能转换，考虑平台评分特性）
const convert5to10Point = (rating5: number): number => {
  if (rating5 <= 0) return 0
  return rating5 * 2
}

// 获取各平台评分（统一10分制返回，供其他组件使用）
export function getPlatformRatings(hotel: Hotel) {
  return {
    booking: hotel.bookingRating,  // 已经是10分制
    agoda: hotel.agodaRating || 0,  // 10分制
    airbnb: hotel.airbnbRating || 0,  // 10分制
    ctrip: convert5to10Point(hotel.ctripRating),  // 5分制转10分制
    fliggy: convert5to10Point(hotel.fliggyRating || 0)  // 5分制转10分制
  }
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
    // 携程和飞猪是5分制，转换为10分制统计
    ctrip: calculateStats(hotels.map(h => convertTo10Point(h.ctripRating))),
    fliggy: calculateStats(hotels.map(h => convertTo10Point(h.fliggyRating || 0)))
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