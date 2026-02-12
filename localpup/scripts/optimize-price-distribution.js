#!/usr/bin/env node

/**
 * 优化酒店价格分布脚本
 * 目标：确保不同价位都有酒店，从评分高开始选
 */

const fs = require('fs');
const path = require('path');

// 目标价格分布
const TARGET_DISTRIBUTION = {
  luxury: 20,     // ¥1500+ - 20%
  premium: 25,    // ¥800-1500 - 25%
  midscale: 30,   // ¥400-800 - 30%
  budget: 15,     // ¥200-400 - 15%
  homestay: 10    // ¥0-200 - 10%
};

// 价格范围定义
const PRICE_RANGES = {
  luxury: { min: 1500, max: 10000 },
  premium: { min: 800, max: 1500 },
  midscale: { min: 400, max: 800 },
  budget: { min: 200, max: 400 },
  homestay: { min: 0, max: 200 }
};

// 读取酒店数据
const hotelsFile = path.join(__dirname, '../src/data/hotels100.ts');
let content = fs.readFileSync(hotelsFile, 'utf8');

// 分析当前价格分布
function analyzeCurrentDistribution(content) {
  const lines = content.split('\n');
  const distribution = { luxury: 0, premium: 0, midscale: 0, budget: 0, homestay: 0 };
  const hotelsByPrice = { luxury: [], premium: [], midscale: [], budget: [], homestay: [] };
  
  let currentHotel = null;
  let inHotelObject = false;
  let hotelLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('{')) {
      inHotelObject = true;
      hotelLines = [line];
    } else if (inHotelObject) {
      hotelLines.push(line);
      
      if (line.startsWith('},') || line.startsWith('}')) {
        inHotelObject = false;
        const hotelText = hotelLines.join('\n');
        
        // 提取价格
        const priceMatch = hotelText.match(/price:\s*(\d+)/);
        if (priceMatch) {
          const price = parseInt(priceMatch[1]);
          
          // 提取评分（使用综合评分）
          const bookingMatch = hotelText.match(/bookingRating:\s*(\d+\.?\d*)/);
          const ctripMatch = hotelText.match(/ctripRating:\s*(\d+\.?\d*)/);
          const bookingRating = bookingMatch ? parseFloat(bookingMatch[1]) : 0;
          const ctripRating = ctripMatch ? parseFloat(ctripMatch[1]) : 0;
          const overallRating = (bookingRating * 0.6 + ctripRating * 0.4) * 2; // 转换为5分制
          
          // 提取ID和名称
          const idMatch = hotelText.match(/id:\s*'([^']+)'/);
          const nameMatch = hotelText.match(/name:\s*'([^']+)'/);
          
          const hotel = {
            id: idMatch ? idMatch[1] : 'unknown',
            name: nameMatch ? nameMatch[1] : 'Unknown',
            price,
            rating: overallRating,
            originalText: hotelText
          };
          
          // 分类
          if (price >= 1500) {
            distribution.luxury++;
            hotelsByPrice.luxury.push(hotel);
          } else if (price >= 800) {
            distribution.premium++;
            hotelsByPrice.premium.push(hotel);
          } else if (price >= 400) {
            distribution.midscale++;
            hotelsByPrice.midscale.push(hotel);
          } else if (price >= 200) {
            distribution.budget++;
            hotelsByPrice.budget.push(hotel);
          } else {
            distribution.homestay++;
            hotelsByPrice.homestay.push(hotel);
          }
        }
      }
    }
  }
  
  return { distribution, hotelsByPrice };
}

// 生成优化报告
function generateOptimizationReport(current, target, hotelsByPrice) {
  console.log('📊 价格分布优化报告');
  console.log('==================');
  console.log('当前分布:');
  Object.entries(current).forEach(([category, count]) => {
    const percentage = ((count / 100) * 100).toFixed(1);
    console.log(`  ${category}: ${count}家 (${percentage}%)`);
  });
  
  console.log('\n目标分布:');
  Object.entries(target).forEach(([category, count]) => {
    const percentage = ((count / 100) * 100).toFixed(1);
    console.log(`  ${category}: ${count}家 (${percentage}%)`);
  });
  
  console.log('\n需要调整:');
  Object.entries(target).forEach(([category, targetCount]) => {
    const currentCount = current[category] || 0;
    const diff = targetCount - currentCount;
    if (diff > 0) {
      console.log(`  ${category}: 需要增加 ${diff}家`);
    } else if (diff < 0) {
      console.log(`  ${category}: 需要减少 ${-diff}家`);
    }
  });
  
  // 显示每个类别的顶级酒店（按评分排序）
  console.log('\n🏆 各价位顶级酒店（按评分排序）:');
  Object.entries(hotelsByPrice).forEach(([category, hotels]) => {
    const sorted = [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 3);
    console.log(`\n  ${category}:`);
    sorted.forEach((hotel, index) => {
      console.log(`    ${index + 1}. ${hotel.name} - ¥${hotel.price} (评分: ${hotel.rating.toFixed(1)})`);
    });
  });
}

// 主函数
function main() {
  console.log('🔍 开始分析酒店价格分布...\n');
  
  const { distribution, hotelsByPrice } = analyzeCurrentDistribution(content);
  
  // 生成报告
  generateOptimizationReport(distribution, TARGET_DISTRIBUTION, hotelsByPrice);
  
  console.log('\n💡 优化建议:');
  console.log('1. 调整部分豪华酒店价格为中端价位（¥400-800）');
  console.log('2. 增加一些经济型酒店（¥200-400）');
  console.log('3. 确保每个价位都有高评分酒店');
  console.log('4. 保持总数为100家不变');
  
  // 计算需要调整的数量
  const adjustments = {};
  Object.entries(TARGET_DISTRIBUTION).forEach(([category, targetCount]) => {
    const currentCount = distribution[category] || 0;
    adjustments[category] = targetCount - currentCount;
  });
  
  console.log('\n⚙️ 具体调整方案:');
  Object.entries(adjustments).forEach(([category, diff]) => {
    if (diff > 0) {
      console.log(`  ${category}: 从其他类别转移 ${diff}家高评分酒店`);
    } else if (diff < 0) {
      console.log(`  ${category}: 转移 ${-diff}家到其他类别`);
    }
  });
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { analyzeCurrentDistribution, generateOptimizationReport };