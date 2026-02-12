#!/usr/bin/env node

/**
 * 调整酒店价格分布脚本
 * 目标：优化价格分布，增加中端和经济型酒店
 */

const fs = require('fs');
const path = require('path');

// 目标价格分布（百分比）
const TARGET_DISTRIBUTION = {
  luxury: 20,     // ¥1500+ - 20家
  premium: 25,    // ¥800-1500 - 25家
  midscale: 30,   // ¥400-800 - 30家
  budget: 15,     // ¥200-400 - 15家
  homestay: 10    // ¥0-200 - 10家
};

// 价格调整映射（从高价位调整到低价位）
const ADJUSTMENT_MAP = {
  // 从豪华调整到高端
  'luxury_to_premium': {
    count: 5,
    sourcePrice: { min: 1500, max: 3000 },
    targetPrice: { min: 800, max: 1500 }
  },
  // 从高端调整到中端
  'premium_to_midscale': {
    count: 8,
    sourcePrice: { min: 800, max: 1500 },
    targetPrice: { min: 400, max: 800 }
  },
  // 从中端调整到经济
  'midscale_to_budget': {
    count: 10,
    sourcePrice: { min: 400, max: 800 },
    targetPrice: { min: 200, max: 400 }
  },
  // 从经济调整到民宿
  'budget_to_homestay': {
    count: 3,
    sourcePrice: { min: 200, max: 400 },
    targetPrice: { min: 0, max: 200 }
  }
};

// 读取酒店数据文件
const hotelsFile = path.join(__dirname, '../src/data/hotels100.ts');
let content = fs.readFileSync(hotelsFile, 'utf8');

// 分析当前价格分布
function analyzeDistribution(content) {
  const lines = content.split('\n');
  const hotels = [];
  let currentHotel = null;
  let inHotelObject = false;
  let hotelLines = [];
  let hotelIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('{')) {
      inHotelObject = true;
      hotelLines = [line];
      hotelIndex = i;
    } else if (inHotelObject) {
      hotelLines.push(line);
      
      if (line.startsWith('},') || line.startsWith('}')) {
        inHotelObject = false;
        const hotelText = hotelLines.join('\n');
        
        // 提取酒店信息
        const idMatch = hotelText.match(/id:\s*'([^']+)'/);
        const priceMatch = hotelText.match(/price:\s*(\d+)/);
        const nameMatch = hotelText.match(/name:\s*'([^']+)'/);
        const nameZhMatch = hotelText.match(/nameZh:\s*'([^']+)'/);
        
        if (idMatch && priceMatch) {
          const hotel = {
            id: idMatch[1],
            name: nameMatch ? nameMatch[1] : 'Unknown',
            nameZh: nameZhMatch ? nameZhMatch[1] : '未知',
            price: parseInt(priceMatch[1]),
            startLine: hotelIndex,
            endLine: i,
            originalText: hotelText,
            lines: hotelLines
          };
          
          // 分类
          if (hotel.price >= 1500) {
            hotel.category = 'luxury';
          } else if (hotel.price >= 800) {
            hotel.category = 'premium';
          } else if (hotel.price >= 400) {
            hotel.category = 'midscale';
          } else if (hotel.price >= 200) {
            hotel.category = 'budget';
          } else {
            hotel.category = 'homestay';
          }
          
          hotels.push(hotel);
        }
      }
    }
  }
  
  return hotels;
}

// 调整酒店价格
function adjustHotelPrice(hotel, targetCategory) {
  const priceRanges = {
    luxury: { min: 1500, max: 10000 },
    premium: { min: 800, max: 1500 },
    midscale: { min: 400, max: 800 },
    budget: { min: 200, max: 400 },
    homestay: { min: 0, max: 200 }
  };
  
  const targetRange = priceRanges[targetCategory];
  if (!targetRange) return hotel;
  
  // 生成新价格（在目标范围内随机）
  const newPrice = Math.floor(
    targetRange.min + Math.random() * (targetRange.max - targetRange.min)
  );
  
  // 取整到50的倍数
  const roundedPrice = Math.round(newPrice / 50) * 50;
  
  // 更新酒店文本
  const updatedText = hotel.originalText.replace(
    /price:\s*\d+/,
    `price: ${roundedPrice}`
  );
  
  return {
    ...hotel,
    price: roundedPrice,
    category: targetCategory,
    updatedText: updatedText
  };
}

// 主函数
function main() {
  console.log('🔧 开始优化酒店价格分布...\n');
  
  // 分析当前分布
  const hotels = analyzeDistribution(content);
  console.log(`📊 分析完成，共 ${hotels.length} 家酒店`);
  
  // 统计当前分布
  const currentDist = { luxury: 0, premium: 0, midscale: 0, budget: 0, homestay: 0 };
  hotels.forEach(h => currentDist[h.category]++);
  
  console.log('\n当前价格分布:');
  Object.entries(currentDist).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}家 (${((count/100)*100).toFixed(1)}%)`);
  });
  
  console.log('\n目标价格分布:');
  Object.entries(TARGET_DISTRIBUTION).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}家 (${count}%)`);
  });
  
  // 执行调整
  console.log('\n🔄 执行价格调整...');
  const adjustedHotels = [...hotels];
  let adjustmentsMade = 0;
  
  // 按调整映射执行
  Object.entries(ADJUSTMENT_MAP).forEach(([adjustment, config]) => {
    const [sourceCat, targetCat] = adjustment.split('_to_');
    
    // 找到符合条件的源酒店
    const sourceHotels = adjustedHotels.filter(h => 
      h.category === sourceCat && 
      h.price >= config.sourcePrice.min && 
      h.price <= config.sourcePrice.max
    );
    
    // 随机选择需要调整的酒店
    const hotelsToAdjust = sourceHotels
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(config.count, sourceHotels.length));
    
    console.log(`  ${sourceCat} → ${targetCat}: 调整 ${hotelsToAdjust.length} 家`);
    
    // 调整价格
    hotelsToAdjust.forEach((hotel, index) => {
      const adjusted = adjustHotelPrice(hotel, targetCat);
      adjustedHotels[adjustedHotels.findIndex(h => h.id === hotel.id)] = adjusted;
      adjustmentsMade++;
    });
  });
  
  // 生成新的文件内容
  console.log('\n📝 生成优化后的数据文件...');
  const lines = content.split('\n');
  const newLines = [...lines];
  
  // 反向更新，避免行号变化影响
  adjustedHotels
    .filter(h => h.updatedText)
    .sort((a, b) => b.startLine - a.startLine) // 反向排序
    .forEach(hotel => {
      // 替换酒店文本
      for (let i = hotel.startLine; i <= hotel.endLine; i++) {
        newLines[i] = '';
      }
      newLines[hotel.startLine] = hotel.updatedText;
    });
  
  // 清理空行
  const finalContent = newLines.filter(line => line !== '').join('\n');
  
  // 备份原文件
  const backupFile = hotelsFile + '.backup-' + Date.now();
  fs.writeFileSync(backupFile, content);
  console.log(`  ✅ 原文件已备份: ${backupFile}`);
  
  // 写入新文件
  fs.writeFileSync(hotelsFile, finalContent);
  console.log(`  ✅ 新文件已写入: ${hotelsFile}`);
  
  // 验证调整结果
  const finalHotels = analyzeDistribution(finalContent);
  const finalDist = { luxury: 0, premium: 0, midscale: 0, budget: 0, homestay: 0 };
  finalHotels.forEach(h => finalDist[h.category]++);
  
  console.log('\n🎯 调整完成！');
  console.log(`  共调整 ${adjustmentsMade} 家酒店价格`);
  
  console.log('\n优化后价格分布:');
  Object.entries(finalDist).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}家 (${((count/100)*100).toFixed(1)}%)`);
  });
  
  // 检查是否接近目标
  console.log('\n📈 分布优化效果:');
  Object.entries(TARGET_DISTRIBUTION).forEach(([cat, target]) => {
    const current = finalDist[cat] || 0;
    const diff = target - current;
    const status = Math.abs(diff) <= 2 ? '✅' : '⚠️';
    console.log(`  ${cat}: 目标${target}家，实际${current}家，差异${diff}家 ${status}`);
  });
  
  console.log('\n💡 建议:');
  console.log('  1. 运行网站测试，确保价格调整不影响显示');
  console.log('  2. 检查手机端价格显示是否正常');
  console.log('  3. 验证排序功能仍然按评分排序');
}

// 执行
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ 调整失败:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeDistribution, adjustHotelPrice };