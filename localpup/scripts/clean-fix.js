#!/usr/bin/env node

/**
 * 清理修复酒店数据文件
 * 删除重复的函数定义，修复语法错误
 */

const fs = require('fs')
const path = require('path')

console.log('🧹 开始清理修复酒店数据文件...')

const filePath = path.join(__dirname, '../src/data/hotels100.ts')
let content = fs.readFileSync(filePath, 'utf-8')

// 查找第一个 ensureCompleteRatings 函数（第65行开始）
const firstFunctionStart = content.indexOf('// 数据生成函数 - 确保所有酒店有完整5平台评分\nfunction ensureCompleteRatings(hotel) {')
if (firstFunctionStart === -1) {
  console.log('❌ 无法找到第一个函数定义')
  process.exit(1)
}

// 找到第一个函数的结束位置（下一个 export 语句之前）
const firstFunctionEnd = content.indexOf('export const originalHotels: Hotel[] = [', firstFunctionStart)
if (firstFunctionEnd === -1) {
  console.log('❌ 无法找到第一个函数结束位置')
  process.exit(1)
}

// 提取第一个函数的内容
const firstFunction = content.substring(firstFunctionStart, firstFunctionEnd)

// 检查是否有语法错误（孤立的属性）
if (firstFunction.includes('reviewCount:') && !firstFunction.includes('function ensureCompleteRatings')) {
  console.log('⚠️  发现语法错误：孤立的对象属性')
  
  // 找到真正的函数开始（包含 function 关键字）
  const realFunctionStart = content.indexOf('function ensureCompleteRatings', firstFunctionStart)
  if (realFunctionStart !== -1) {
    // 重新计算结束位置
    const braceStart = content.indexOf('{', realFunctionStart)
    let braceCount = 1
    let currentPos = braceStart + 1
    
    while (braceCount > 0 && currentPos < content.length) {
      if (content[currentPos] === '{') braceCount++
      if (content[currentPos] === '}') braceCount--
      currentPos++
    }
    
    const realFunctionEnd = currentPos
    
    // 删除整个函数
    const before = content.substring(0, realFunctionStart)
    const after = content.substring(realFunctionEnd)
    content = before + after
    
    console.log('✅ 删除第一个重复函数定义')
  }
} else {
  // 正常删除第一个函数
  const before = content.substring(0, firstFunctionStart)
  const after = content.substring(firstFunctionEnd)
  content = before + after
  console.log('✅ 删除第一个重复函数定义')
}

// 保存修复后的文件
fs.writeFileSync(filePath, content)
console.log('🎉 文件清理修复完成！')

// 验证修复
console.log('\n🔍 验证修复结果:')
const finalContent = fs.readFileSync(filePath, 'utf-8')
const functionCount = (finalContent.match(/function ensureCompleteRatings/g) || []).length
console.log(`  函数定义数量: ${functionCount} (应该是1)`)

if (functionCount === 1) {
  console.log('✅ 修复成功！')
} else {
  console.log('❌ 修复失败，仍有重复定义')
}