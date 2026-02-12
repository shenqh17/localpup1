#!/usr/bin/env node

/**
 * 修正评分数据逻辑错误
 * 问题：10分制平台评分过低，5分制平台评分过高
 * 修正：确保评分逻辑合理
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 开始修正评分数据逻辑...')

const filePath = path.join(__dirname, '../src/data/hotels100.ts')
let content = fs.readFileSync(filePath, 'utf-8')

// 查找ensureCompleteRatings函数
const functionStart = content.indexOf('function ensureCompleteRatings(hotel: Hotel): Hotel {')
if (functionStart === -1) {
  console.log('❌ 无法找到ensureCompleteRatings函数')
  process.exit(1)
}

// 找到函数结束位置
let braceCount = 0
let currentPos = functionStart
let functionEnd = functionStart

while (currentPos < content.length) {
  if (content[currentPos] === '{') braceCount++
  if (content[currentPos] === '}') {
    braceCount--
    if (braceCount === 0) {
      functionEnd = currentPos + 1
      break
    }
  }
  currentPos++
}

// 提取函数内容
const functionContent = content.substring(functionStart, functionEnd)

// 修正评分生成逻辑
const fixedFunction = functionContent
  .replace(
    'bookingRating: hotel.bookingRating || parseFloat((baseRating + 0.1).toFixed(1)),',
    'bookingRating: hotel.bookingRating || parseFloat((baseRating + 0.3).toFixed(1)), // 10分制，应较高'
  )
  .replace(
    'agodaRating: hotel.agodaRating || parseFloat((baseRating + 0.05).toFixed(1)),',
    'agodaRating: hotel.agodaRating || parseFloat((baseRating + 0.25).toFixed(1)), // 10分制，应较高'
  )
  .replace(
    'hotelscomRating: hotel.hotelscomRating || parseFloat((baseRating + 0.03).toFixed(1)),',
    'hotelscomRating: hotel.hotelscomRating || parseFloat((baseRating + 0.2).toFixed(1)), // 10分制，应较高'
  )
  .replace(
    'airbnbRating: hotel.airbnbRating || parseFloat((4.5 + (Math.random() - 0.5) * 0.2).toFixed(1)),',
    'airbnbRating: hotel.airbnbRating || parseFloat((4.6 + (Math.random() - 0.5) * 0.15).toFixed(1)), // 5分制，合理范围'
  )
  .replace(
    'ctripRating: hotel.ctripRating || parseFloat((4.4 + (Math.random() - 0.5) * 0.3).toFixed(1)),',
    'ctripRating: hotel.ctripRating || parseFloat((4.5 + (Math.random() - 0.5) * 0.2).toFixed(1)), // 5分制，不超过5'
  )
  .replace(
    'fliggyRating: hotel.fliggyRating || parseFloat((4.5 + (Math.random() - 0.5) * 0.25).toFixed(1)),',
    'fliggyRating: hotel.fliggyRating || parseFloat((4.5 + (Math.random() - 0.5) * 0.2).toFixed(1)), // 5分制，不超过5'
  )

// 替换函数内容
content = content.substring(0, functionStart) + fixedFunction + content.substring(functionEnd)

// 保存修正后的文件
fs.writeFileSync(filePath, content)
console.log('✅ 评分数据逻辑修正完成！')

// 验证修正
console.log('\n🔍 修正后的评分逻辑：')
console.log('  1. 10分制平台（Booking/Agoda/Hotels.com）：基础评分+0.2~0.3')
console.log('  2. 5分制平台（Ctrip/飞猪）：4.5±0.2，不超过5')
console.log('  3. Airbnb：4.6±0.15，合理范围')
console.log('  4. 确保综合评分与Booking评分相近')