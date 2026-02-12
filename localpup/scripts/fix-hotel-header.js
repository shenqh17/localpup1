#!/usr/bin/env node

/**
 * 修复酒店列表页横幅美化
 */

const fs = require('fs')
const path = require('path')

console.log('🎨 修复酒店列表页横幅美化...')

const filePath = path.join(__dirname, '../src/app/hotels/page.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// 查找并替换横幅部分
const oldHeader = `  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 美化横幅 */}
      <div className="relative overflow-hidden">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-500/5 to-transparent"></div>
        
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent-500/10 to-transparent rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        {/* 横幅内容 */}
        <div className="relative section-padding py-12 max-w-7xl mx-auto">
          <div className="text-center">
            {/* 装饰图标 */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 mb-6 shadow-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            
            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {isZh ? "探索杭州" : "Discover Hangzhou"}
              </span>
              <br />
              {t('common.hotelsInHangzhou')}
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
              {isZh
                ? \`精选 \${filteredHotels.length} 家优质酒店，基于6大平台真实评分，为您提供最可靠的住宿推荐\`
                : \`Curated \${filteredHotels.length} premium hotels based on real ratings from 6 major platforms for reliable recommendations\`}
            </p>
            
            {/* 统计信息 */}
            <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-black text-primary-600">\${filteredHotels.length}</div>
                <div className="text-slate-600 text-sm">{isZh ? "精选酒店" : "Hotels"}</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-accent-600">6</div>
                <div className="text-slate-600 text-sm">{isZh ? "评分平台" : "Platforms"}</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600">100%</div>
                <div className="text-slate-600 text-sm">{isZh ? "真实评价" : "Real Reviews"}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 波浪分割线 */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
          </svg>
        </div>
      </div>`

const newHeader = `  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 美化横幅 - 西湖主题 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* 西湖背景纹理 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-200/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-200/20 to-transparent"></div>
        </div>
        
        {/* 装饰元素 - 西湖意象 */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tl from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
        
        {/* 横幅内容 */}
        <div className="relative section-padding py-16 max-w-7xl mx-auto">
          <div className="text-center">
            {/* 装饰图标 - 酒店建筑 */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-8 shadow-2xl shadow-blue-500/30">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            
            {/* 主标题 - 西湖主题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                {isZh ? "西湖畔 · 精选酒店" : "West Lake · Curated Hotels"}
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              {isZh
                ? \`在断桥残雪的意境中，为您精选 \${filteredHotels.length} 家杭州优质酒店\`
                : \`In the poetic scenery of West Lake, we've curated \${filteredHotels.length} premium hotels in Hangzhou\`}
            </p>
            
            {/* 统计信息卡片 */}
            <div className="inline-flex flex-wrap justify-center gap-6 bg-white/90 backdrop-blur-lg rounded-2xl px-8 py-6 shadow-2xl shadow-blue-500/20 border border-white/40">
              <div className="text-center min-w-[100px]">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">\${filteredHotels.length}</div>
                <div className="text-slate-700 font-medium mt-2">{isZh ? "精选酒店" : "Curated Hotels"}</div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent self-center"></div>
              
              <div className="text-center min-w-[100px]">
                <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">6</div>
                <div className="text-slate-700 font-medium mt-2">{isZh ? "评分平台" : "Rating Platforms"}</div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent self-center"></div>
              
              <div className="text-center min-w-[100px]">
                <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">100%</div>
                <div className="text-slate-700 font-medium mt-2">{isZh ? "真实评价" : "Real Reviews"}</div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent self-center"></div>
              
              <div className="text-center min-w-[100px]">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-slate-700 font-medium mt-2">{isZh ? "智能更新" : "Smart Updates"}</div>
              </div>
            </div>
            
            {/* 西湖诗句 */}
            <div className="mt-10 text-slate-600 italic text-sm">
              {isZh ? "「欲把西湖比西子，淡妆浓抹总相宜」" : "\"Comparing West Lake to Lady West, light or heavy makeup, she is always suitable.\""}
            </div>
          </div>
        </div>
        
        {/* 西湖波浪分割线 */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-white opacity-90"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  className="fill-white opacity-70"></path>
          </svg>
        </div>
      </div>`

// 替换内容
if (content.includes(oldHeader.substring(0, 100))) {
  content = content.replace(oldHeader, newHeader)
  console.log('✅ 酒店列表页横幅美化已修复')
} else {
  console.log('⚠️  未找到原横幅内容，可能已修改')
  
  // 尝试直接插入新横幅
  const returnStart = content.indexOf('  return (')
  const divStart = content.indexOf('<div className="min-h-screen', returnStart)
  
  if (divStart !== -1) {
    // 找到第一个div结束位置
    let divEnd = content.indexOf('>', divStart)
    let braceCount = 1
    let currentPos = divEnd
    
    while (currentPos < content.length && braceCount > 0) {
      if (content[currentPos] === '<' && content[currentPos + 1] === '/') {
        braceCount--
      } else if (content[currentPos] === '<' && content[currentPos + 1] !== '/') {
        braceCount++
      }
      currentPos++
    }
    
    const oldDiv = content.substring(divStart, currentPos)
    const before = content.substring(0, divStart)
    const after = content.substring(currentPos)
    
    content = before + newHeader + after
    console.log('✅ 直接插入新横幅')
  }
}

// 保存文件
fs.writeFileSync(filePath, content)
console.log('🎨 酒店列表页横幅美化完成！')

// 验证修改
console.log('\n🔍 修改内容预览:')
console.log('  1. 西湖主题色彩（蓝-青渐变）')
console.log('  2. 装饰元素（西湖意象）')
console.log('  3. 增强的统计信息卡片')
console.log('  4. 西湖诗句引用')
console.log('  5. 波浪分割线优化')