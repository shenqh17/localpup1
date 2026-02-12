#!/usr/bin/env node

/**
 * 每周自动更新酒店评分数据
 * 运行频率：每周一凌晨2点
 * 功能：从各平台API获取最新评分，更新hotels100.ts数据
 */

const fs = require('fs').promises
const path = require('path')
const { hotels } = require('../src/data/hotels100.ts')

console.log('🔄 开始每周评分数据更新...')
console.log(`📊 处理酒店数量: ${hotels.length}`)

// 模拟API响应数据（实际使用时替换为真实API调用）
const mockApiResponses = {
  // Booking.com API模拟
  booking: async (hotelId) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 模拟评分变化（±0.1范围内随机波动）
    const baseRating = 8.5 + Math.random() * 1.0
    const change = (Math.random() - 0.5) * 0.2
    const newRating = Math.min(10, Math.max(0, baseRating + change))
    
    // 模拟评论数量增长
    const baseReviews = 500 + Math.floor(Math.random() * 1000)
    const newReviews = baseReviews + Math.floor(Math.random() * 50)
    
    return {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: newReviews,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Agoda API模拟
  agoda: async (hotelId) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const baseRating = 8.3 + Math.random() * 1.2
    const change = (Math.random() - 0.5) * 0.15
    const newRating = Math.min(10, Math.max(0, baseRating + change))
    
    const baseReviews = 300 + Math.floor(Math.random() * 800)
    const newReviews = baseReviews + Math.floor(Math.random() * 40)
    
    return {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: newReviews,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Airbnb API模拟
  airbnb: async (hotelId) => {
    await new Promise(resolve => setTimeout(resolve, 120))
    
    const baseRating = 4.6 + Math.random() * 0.6
    const change = (Math.random() - 0.5) * 0.1
    const newRating = Math.min(5, Math.max(0, baseRating + change))
    
    const baseReviews = 100 + Math.floor(Math.random() * 400)
    const newReviews = baseReviews + Math.floor(Math.random() * 30)
    
    return {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: newReviews,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // 携程API模拟
  ctrip: async (hotelId) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const baseRating = 4.4 + Math.random() * 0.8
    const change = (Math.random() - 0.5) * 0.08
    const newRating = Math.min(5, Math.max(0, baseRating + change))
    
    const baseReviews = 1000 + Math.floor(Math.random() * 5000)
    const newReviews = baseReviews + Math.floor(Math.random() * 100)
    
    return {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: newReviews,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // 飞猪API模拟
  fliggy: async (hotelId) => {
    await new Promise(resolve => setTimeout(resolve, 180))
    
    const baseRating = 4.5 + Math.random() * 0.7
    const change = (Math.random() - 0.5) * 0.07
    const newRating = Math.min(5, Math.max(0, baseRating + change))
    
    const baseReviews = 800 + Math.floor(Math.random() * 3000)
    const newReviews = baseReviews + Math.floor(Math.random() * 80)
    
    return {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: newReviews,
      lastUpdated: new Date().toISOString()
    }
  }
}

// 更新单个酒店的评分数据
async function updateHotelRatings(hotel) {
  console.log(`  更新酒店: ${hotel.name}`)
  
  const updates = {
    lastUpdated: new Date().toISOString(),
    updatedPlatforms: []
  }
  
  try {
    // 更新Booking.com评分
    if (hotel.bookingRating) {
      const bookingData = await mockApiResponses.booking(hotel.id)
      hotel.bookingRating = bookingData.rating
      hotel.bookingReviewCount = bookingData.reviewCount
      updates.updatedPlatforms.push('booking')
    }
    
    // 更新Agoda评分
    if (hotel.agodaRating) {
      const agodaData = await mockApiResponses.agoda(hotel.id)
      hotel.agodaRating = agodaData.rating
      hotel.agodaReviewCount = agodaData.reviewCount
      updates.updatedPlatforms.push('agoda')
    }
    
    // 更新Airbnb评分
    if (hotel.airbnbRating) {
      const airbnbData = await mockApiResponses.airbnb(hotel.id)
      hotel.airbnbRating = airbnbData.rating
      hotel.airbnbReviewCount = airbnbData.reviewCount
      updates.updatedPlatforms.push('airbnb')
    }
    
    // 更新携程评分
    if (hotel.ctripRating) {
      const ctripData = await mockApiResponses.ctrip(hotel.id)
      hotel.ctripRating = ctripData.rating
      hotel.ctripReviewCount = ctripData.reviewCount
      updates.updatedPlatforms.push('ctrip')
    }
    
    // 更新飞猪评分
    if (hotel.fliggyRating) {
      const fliggyData = await mockApiResponses.fliggy(hotel.id)
      hotel.fliggyRating = fliggyData.rating
      hotel.fliggyReviewCount = fliggyData.reviewCount
      updates.updatedPlatforms.push('fliggy')
    }
    
    console.log(`    ✅ 更新完成: ${updates.updatedPlatforms.length} 个平台`)
    return { success: true, hotel, updates }
    
  } catch (error) {
    console.error(`    ❌ 更新失败: ${error.message}`)
    return { success: false, hotel, error: error.message }
  }
}

// 生成更新报告
function generateUpdateReport(results) {
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  const totalPlatforms = results.reduce((sum, r) => sum + (r.updates?.updatedPlatforms.length || 0), 0)
  
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalHotels: results.length,
      successfulUpdates: successful,
      failedUpdates: failed,
      totalPlatformUpdates: totalPlatforms,
      successRate: (successful / results.length * 100).toFixed(1) + '%'
    },
    details: results.map(r => ({
      hotelId: r.hotel.id,
      hotelName: r.hotel.name,
      success: r.success,
      updatedPlatforms: r.updates?.updatedPlatforms || [],
      error: r.error
    }))
  }
}

// 主更新函数
async function main() {
  console.log('🚀 开始执行每周评分更新任务...')
  console.log('='.repeat(50))
  
  const startTime = Date.now()
  const results = []
  
  // 分批更新酒店数据（避免内存问题）
  const batchSize = 10
  for (let i = 0; i < hotels.length; i += batchSize) {
    const batch = hotels.slice(i, i + batchSize)
    console.log(`\n📦 处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(hotels.length/batchSize)}`)
    
    const batchPromises = batch.map(hotel => updateHotelRatings(hotel))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
    
    // 批次间延迟，避免API限制
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  
  // 生成报告
  const report = generateUpdateReport(results)
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 更新任务完成报告')
  console.log('='.repeat(50))
  console.log(`⏱️  总耗时: ${duration} 秒`)
  console.log(`🏨 处理酒店: ${report.summary.totalHotels}`)
  console.log(`✅ 成功更新: ${report.summary.successfulUpdates}`)
  console.log(`❌ 更新失败: ${report.summary.failedUpdates}`)
  console.log(`🔄 平台更新: ${report.summary.totalPlatformUpdates} 次`)
  console.log(`📈 成功率: ${report.summary.successRate}`)
  
  // 保存报告到文件
  const reportDir = path.join(__dirname, '../logs')
  await fs.mkdir(reportDir, { recursive: true })
  
  const reportFile = path.join(reportDir, `rating-update-${new Date().toISOString().split('T')[0]}.json`)
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2))
  
  console.log(`\n📄 详细报告已保存: ${reportFile}`)
  
  // 实际部署时，这里应该更新hotels100.ts文件
  // 由于这是模拟，我们只生成报告
  console.log('\n💡 注意: 这是模拟更新，实际部署时需要:')
  console.log('1. 替换mockApiResponses为真实API调用')
  console.log('2. 更新src/data/hotels100.ts文件')
  console.log('3. 配置cron job每周自动运行')
  console.log('4. 自动提交代码变更到GitHub')
  
  process.exit(0)
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的Promise拒绝:', error)
  process.exit(1)
})

// 运行主函数
main().catch(error => {
  console.error('❌ 更新任务失败:', error)
  process.exit(1)
})