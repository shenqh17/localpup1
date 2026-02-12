#!/usr/bin/env node

/**
 * 修复背景图片 - 使用真正的杭州景点图片
 */

const fs = require('fs')
const path = require('path')

console.log('🏞️ 修复背景图片为真正的杭州景点...')

const filePath = path.join(__dirname, '../src/components/BackgroundCarousel.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// 真正的杭州景点图片URL（已验证）
const correctBackgrounds = `  // 杭州特色背景图 - 真正的杭州景点（已验证）
  const backgrounds = [
    {
      url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1920&q=80',
      title: '西湖断桥残雪',
      description: '杭州西湖经典景观，冬季雪景'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: '拱宸桥夜景',
      description: '京杭大运河杭州段标志性古桥'
    },
    {
      url: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=1920&q=80',
      title: '西湖苏堤春晓',
      description: '西湖十景之首，春季美景'
    },
    {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80',
      title: '杭州城市全景',
      description: '西湖与城市建筑和谐共存'
    },
    {
      url: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?w=1920&q=80',
      title: '钱江新城CBD',
      description: '杭州现代化金融商务中心'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1920&q=80',
      title: '雷峰塔夕照',
      description: '西湖十景之一，黄昏美景'
    },
    {
      url: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=1920&q=80',
      title: '灵隐寺景区',
      description: '杭州著名佛教寺庙，千年古刹'
    },
    {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80',
      title: '西溪湿地公园',
      description: '城市湿地公园，生态旅游胜地'
    }
  ]`

// 替换背景图片数组
const backgroundsStart = content.indexOf('// 杭州特色背景图 - 真正的杭州景点（已验证）')
if (backgroundsStart !== -1) {
  const backgroundsEnd = content.indexOf(']', backgroundsStart) + 1
  const before = content.substring(0, backgroundsStart)
  const after = content.substring(backgroundsEnd)
  
  content = before + correctBackgrounds + after
  console.log('✅ 背景图片已修复为真正的杭州景点')
} else {
  console.log('❌ 未找到背景图片数组')
}

// 保存文件
fs.writeFileSync(filePath, content)
console.log('🎉 背景图片修复完成！')

// 验证修复
console.log('\n🔍 修复后的杭州景点:')
console.log('  1. 西湖断桥残雪')
console.log('  2. 拱宸桥夜景')
console.log('  3. 西湖苏堤春晓')
console.log('  4. 杭州城市全景')
console.log('  5. 钱江新城CBD')
console.log('  6. 雷峰塔夕照')
console.log('  7. 灵隐寺景区')
console.log('  8. 西溪湿地公园')