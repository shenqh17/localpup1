#!/usr/bin/env node

/**
 * 诊断酒店显示问题
 * 为什么网站只显示15家酒店
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始诊断酒店显示问题...\n');

// 1. 检查数据文件
console.log('1. 检查酒店数据文件...');
const hotelsFile = path.join(__dirname, '../src/data/hotels100.ts');
if (!fs.existsSync(hotelsFile)) {
  console.log('❌ hotels100.ts 文件不存在');
  process.exit(1);
}

const content = fs.readFileSync(hotelsFile, 'utf8');

// 统计酒店数量
const hotelCount = (content.match(/id:\s*'/g) || []).length;
console.log(`  数据文件包含 ${hotelCount} 家酒店`);

// 检查导出
const hasExport = content.includes('export { allHotels as hotels }');
console.log(`  导出语句: ${hasExport ? '✅ 存在' : '❌ 缺失'}`);

// 2. 检查页面导入
console.log('\n2. 检查页面导入...');
const pageFile = path.join(__dirname, '../src/app/hotels/page.tsx');
if (!fs.existsSync(pageFile)) {
  console.log('❌ 酒店页面文件不存在');
  process.exit(1);
}

const pageContent = fs.readFileSync(pageFile, 'utf8');
const importMatch = pageContent.match(/import.*from.*['"]@\/data\/hotels100['"]/);
console.log(`  导入语句: ${importMatch ? '✅ 存在' : '❌ 缺失'}`);

// 3. 检查构建输出
console.log('\n3. 检查构建输出...');
const nextDir = path.join(__dirname, '../.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ .next 构建文件夹不存在');
  console.log('  运行: npm run build');
} else {
  const buildTime = fs.statSync(nextDir).mtime;
  console.log(`  最后构建时间: ${buildTime.toLocaleString()}`);
  
  // 检查构建的JS文件
  const serverDir = path.join(nextDir, 'server');
  if (fs.existsSync(serverDir)) {
    const appFiles = fs.readdirSync(serverDir).filter(f => f.includes('app-hotels'));
    console.log(`  酒店页面构建文件: ${appFiles.length > 0 ? '✅ 存在' : '❌ 缺失'}`);
  }
}

// 4. 检查可能的显示限制
console.log('\n4. 检查显示限制...');
const sliceMatches = pageContent.match(/\.slice\([^)]*\)/g) || [];
const filterMatches = pageContent.match(/\.filter\([^)]*\)/g) || [];
const takeMatches = pageContent.match(/\.take\([^)]*\)/g) || [];

console.log(`  .slice() 调用: ${sliceMatches.length} 处`);
console.log(`  .filter() 调用: ${filterMatches.length} 处`);
console.log(`  .take() 调用: ${takeMatches.length} 处`);

// 检查是否有硬编码限制
const hardLimitMatches = pageContent.match(/15|fifteen|十五/g);
if (hardLimitMatches) {
  console.log(`  ⚠️  发现硬编码限制: ${hardLimitMatches.join(', ')}`);
}

// 5. 检查分页逻辑
console.log('\n5. 检查分页逻辑...');
const hasPagination = pageContent.includes('pagination') || 
                      pageContent.includes('Pagination') ||
                      pageContent.includes('pageSize') ||
                      pageContent.includes('currentPage');

console.log(`  分页逻辑: ${hasPagination ? '✅ 存在' : '❌ 不存在'}`);

// 6. 检查数据验证
console.log('\n6. 数据验证...');
// 提取前几个酒店ID
const idMatches = content.match(/id:\s*'([^']+)'/g) || [];
const sampleIds = idMatches.slice(0, 5).map(m => m.match(/'([^']+)'/)[1]);
console.log(`  样本酒店ID: ${sampleIds.join(', ')}`);

// 检查重复ID
const allIds = idMatches.map(m => m.match(/'([^']+)'/)[1]);
const uniqueIds = [...new Set(allIds)];
console.log(`  唯一ID数量: ${uniqueIds.length}/${allIds.length}`);
if (uniqueIds.length !== allIds.length) {
  console.log('  ⚠️  发现重复ID！');
}

// 7. 检查构建错误
console.log('\n7. 检查可能的构建错误...');
const buildLog = path.join(__dirname, '../.next/build.log');
if (fs.existsSync(buildLog)) {
  const logContent = fs.readFileSync(buildLog, 'utf8');
  const errorCount = (logContent.match(/error/gi) || []).length;
  const warningCount = (logContent.match(/warning/gi) || []).length;
  console.log(`  构建日志: ${errorCount} 个错误, ${warningCount} 个警告`);
} else {
  console.log('  构建日志: 未找到');
}

// 8. 生成诊断报告
console.log('\n📊 诊断报告:');
console.log('=' .repeat(40));

if (hotelCount === 100) {
  console.log('✅ 数据完整性: 100家酒店数据存在');
} else {
  console.log(`❌ 数据完整性: 只有 ${hotelCount}/100 家酒店`);
}

if (hasExport && importMatch) {
  console.log('✅ 导入导出: 正常');
} else {
  console.log('❌ 导入导出: 有问题');
}

// 建议
console.log('\n💡 建议解决方案:');
console.log('1. 清除构建缓存: rm -rf .next && npm run build');
console.log('2. 检查Vercel部署日志');
console.log('3. 本地测试: npm run dev 然后访问 http://localhost:3000/hotels');
console.log('4. 检查是否有环境变量限制显示数量');
console.log('5. 验证数据文件格式是否正确');

console.log('\n🔧 立即执行修复:');
console.log('cd /Users/mac/.openclaw/workspace/localpup');
console.log('rm -rf .next');
console.log('npm run build');
console.log('npm run start');

process.exit(hotelCount === 100 && hasExport && importMatch ? 0 : 1);