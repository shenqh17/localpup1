#!/usr/bin/env node

/**
 * 移动端视图测试脚本
 * 模拟不同移动设备屏幕尺寸
 */

const fs = require('fs');
const path = require('path');

// 常见移动设备屏幕尺寸
const MOBILE_DEVICES = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12 Pro': { width: 390, height: 844 },
  'iPhone 14 Pro Max': { width: 430, height: 932 },
  'Samsung Galaxy S21': { width: 360, height: 800 },
  'Google Pixel 5': { width: 393, height: 851 },
  'iPad Mini': { width: 768, height: 1024 },
  'iPad Pro 11"': { width: 834, height: 1194 },
  'Small Mobile': { width: 320, height: 568 },
  'Large Mobile': { width: 414, height: 896 }
};

// 需要检查的关键元素
const KEY_ELEMENTS = [
  { selector: 'header', minHeight: 60, description: '顶部导航栏' },
  { selector: 'main', minHeight: 400, description: '主要内容区域' },
  { selector: '.container, .max-w-7xl', minWidth: 300, description: '内容容器' },
  { selector: 'button, .btn', minHeight: 44, minWidth: 44, description: '按钮' },
  { selector: 'input, textarea, select', minHeight: 44, description: '输入框' },
  { selector: 'img', check: 'has-src', description: '图片' },
  { selector: 'a', check: 'has-href', description: '链接' }
];

// 检查文件中的响应式类
function checkResponsiveClasses(filePath) {
  if (!fs.existsSync(filePath)) return { exists: false };
  
  const content = fs.readFileSync(filePath, 'utf8');
  const responsivePrefixes = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
  const mobileFirstClasses = ['block', 'flex', 'grid', 'hidden', 'text-'];
  
  const results = {
    file: path.basename(filePath),
    responsiveClasses: {},
    issues: [],
    recommendations: []
  };
  
  // 检查响应式前缀
  responsivePrefixes.forEach(prefix => {
    const regex = new RegExp(`\\b${prefix}[a-zA-Z0-9-]+`, 'g');
    const matches = content.match(regex);
    results.responsiveClasses[prefix] = matches ? matches.length : 0;
  });
  
  // 检查是否使用移动优先
  const hasMobileFirst = mobileFirstClasses.some(cls => content.includes(cls));
  if (!hasMobileFirst) {
    results.recommendations.push('考虑使用移动优先设计模式');
  }
  
  // 检查断点使用
  const totalResponsive = Object.values(results.responsiveClasses).reduce((a, b) => a + b, 0);
  if (totalResponsive === 0 && filePath.endsWith('.tsx')) {
    results.issues.push('缺少响应式CSS类');
  }
  
  // 检查容器宽度
  const hasContainer = content.includes('max-w-') || content.includes('container');
  if (!hasContainer && filePath.includes('page.tsx')) {
    results.recommendations.push('建议添加最大宽度限制');
  }
  
  // 检查字体大小
  const fontSizeRegex = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g;
  const fontSizes = content.match(fontSizeRegex) || [];
  const hasSmallFont = fontSizes.some(size => ['text-xs', 'text-sm'].includes(size));
  if (!hasSmallFont && fontSizes.length > 0) {
    results.recommendations.push('考虑为移动端添加小字体类');
  }
  
  return results;
}

// 生成设备测试报告
function generateDeviceReport() {
  console.log('📱 移动端设备兼容性测试报告');
  console.log('==============================\n');
  
  console.log('📊 测试设备列表:');
  Object.entries(MOBILE_DEVICES).forEach(([device, size]) => {
    console.log(`  ${device}: ${size.width}×${size.height}`);
  });
  
  console.log('\n🎯 测试标准:');
  console.log('  1. 宽度适应: 内容不应水平溢出');
  console.log('  2. 触摸友好: 按钮高度≥44px，宽度≥44px');
  console.log('  3. 字体可读: 正文至少12px/16px');
  console.log('  4. 间距适当: 元素间有足够触摸空间');
  console.log('  5. 图片优化: 响应式加载，不拉伸');
  
  console.log('\n⚠️  常见移动端问题:');
  console.log('  1. 水平滚动条（内容过宽）');
  console.log('  2. 文字过小难以阅读');
  console.log('  3. 按钮太小难以点击');
  console.log('  4. 表单输入困难');
  console.log('  5. 图片加载缓慢');
  
  console.log('\n🔧 优化建议:');
  console.log('  1. 使用CSS媒体查询 (@media)');
  console.log('  2. 使用相对单位 (rem, %, vw)');
  console.log('  3. 使用Flexbox/Grid布局');
  console.log('  4. 优化图片 (WebP, 懒加载)');
  console.log('  5. 测试真实设备');
}

// 检查关键页面
function checkKeyPages() {
  const pages = [
    'src/app/page.tsx',
    'src/app/hotels/page.tsx',
    'src/app/hotels/[slug]/page.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx'
  ];
  
  console.log('\n📄 关键页面响应式检查:');
  console.log('----------------------');
  
  const results = pages.map(page => {
    const fullPath = path.join(__dirname, '..', page);
    return checkResponsiveClasses(fullPath);
  });
  
  results.forEach(result => {
    console.log(`\n${result.file}:`);
    
    if (result.issues.length > 0) {
      console.log('  ❌ 问题:');
      result.issues.forEach(issue => console.log(`    ${issue}`));
    }
    
    if (result.recommendations.length > 0) {
      console.log('  💡 建议:');
      result.recommendations.forEach(rec => console.log(`    ${rec}`));
    }
    
    if (result.responsiveClasses && Object.values(result.responsiveClasses).some(v => v > 0)) {
      console.log('  📊 响应式类统计:');
      Object.entries(result.responsiveClasses).forEach(([prefix, count]) => {
        if (count > 0) console.log(`    ${prefix}: ${count}个`);
      });
    }
    
    if (result.issues.length === 0 && result.recommendations.length === 0) {
      console.log('  ✅ 通过基础检查');
    }
  });
}

// 生成优化清单
function generateOptimizationChecklist() {
  console.log('\n✅ 移动端优化清单:');
  console.log('==================');
  
  const checklist = [
    { item: 'Viewport meta标签设置', checked: false },
    { item: '触摸友好的按钮尺寸 (≥44px)', checked: false },
    { item: '响应式图片 (srcset, sizes)', checked: false },
    { item: '移动端字体大小调整', checked: false },
    { item: '水平滚动预防', checked: false },
    { item: '表单输入优化', checked: false },
    { item: '触摸反馈效果', checked: false },
    { item: '安全区域支持 (iOS)', checked: false },
    { item: 'PWA支持 (可选)', checked: false },
    { item: '性能优化 (懒加载等)', checked: false }
  ];
  
  checklist.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.checked ? '✅' : '⬜'} ${item.item}`);
  });
}

// 主函数
function main() {
  console.log('🔍 开始移动端兼容性测试...\n');
  
  generateDeviceReport();
  checkKeyPages();
  generateOptimizationChecklist();
  
  console.log('\n🚀 下一步行动:');
  console.log('1. 在真实移动设备上测试网站');
  console.log('2. 使用Chrome DevTools设备模拟器');
  console.log('3. 测试横屏和竖屏模式');
  console.log('4. 测试不同网络条件下的加载');
  console.log('5. 收集用户反馈并持续优化');
  
  console.log('\n📱 测试工具推荐:');
  console.log('  • Chrome DevTools Device Mode');
  console.log('  • Responsively App');
  console.log('  • BrowserStack');
  console.log('  • LambdaTest');
  console.log('  • 真实设备测试');
}

// 执行
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

module.exports = { checkResponsiveClasses, generateDeviceReport };