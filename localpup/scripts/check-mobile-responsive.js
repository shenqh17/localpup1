#!/usr/bin/env node

/**
 * 检查手机端自适应配置
 * 确保网站在移动设备上表现良好
 */

const fs = require('fs');
const path = require('path');

// 需要检查的关键文件
const FILES_TO_CHECK = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/hotels/page.tsx',
  'src/app/hotels/[slug]/page.tsx',
  'tailwind.config.ts',
  'next.config.js'
];

// 移动端最佳实践检查项
const MOBILE_CHECKS = {
  viewport: {
    pattern: /viewport.*content.*width.*device-width/i,
    required: true,
    message: '必须设置viewport为device-width'
  },
  touchAction: {
    pattern: /-webkit-tap-highlight-color|touch-action/i,
    recommended: true,
    message: '建议设置触摸优化样式'
  },
  fontSize: {
    pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g,
    minSize: 'text-sm',
    message: '字体大小应适合移动端阅读'
  },
  spacing: {
    pattern: /p-\d+|m-\d+|gap-\d+/g,
    check: '合理',
    message: '间距应适应移动端屏幕'
  },
  grid: {
    pattern: /grid-cols-\d+/g,
    check: 'responsive',
    message: '网格布局应响应式'
  },
  images: {
    pattern: /Image.*layout=.*responsive|fill|intrinsic/,
    recommended: true,
    message: '图片应使用响应式布局'
  }
};

// 检查文件
function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, issues: [`文件不存在: ${filePath}`] };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const recommendations = [];
  
  // 检查各项
  Object.entries(MOBILE_CHECKS).forEach(([checkName, checkConfig]) => {
    const matches = content.match(checkConfig.pattern);
    
    if (checkConfig.required && !matches) {
      issues.push(`❌ ${checkConfig.message} (${checkName})`);
    } else if (checkConfig.recommended && !matches) {
      recommendations.push(`💡 ${checkConfig.message} (${checkName})`);
    } else if (matches) {
      // 检查具体值
      if (checkName === 'grid') {
        const hasResponsive = content.includes('grid-cols-1') || 
                             content.includes('md:grid-cols') ||
                             content.includes('sm:grid-cols');
        if (!hasResponsive) {
          issues.push(`❌ 网格布局缺少响应式设计 (${checkName})`);
        }
      }
    }
  });
  
  // 检查Tailwind响应式前缀
  const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
  const hasResponsiveClasses = responsiveClasses.some(prefix => content.includes(prefix));
  
  if (!hasResponsiveClasses && filePath.includes('.tsx')) {
    recommendations.push('💡 考虑添加响应式CSS类前缀 (sm:, md:, lg:)');
  }
  
  // 检查容器宽度
  const hasMaxWidth = content.includes('max-w-') || 
                     content.includes('container') ||
                     content.includes('mx-auto');
  
  if (!hasMaxWidth && filePath.includes('page.tsx')) {
    recommendations.push('💡 考虑添加最大宽度限制，避免在宽屏上过宽');
  }
  
  return {
    exists: true,
    lines: content.split('\n').length,
    issues,
    recommendations
  };
}

// 生成报告
function generateReport(results) {
  console.log('📱 手机端自适应配置检查报告');
  console.log('==============================\n');
  
  let totalIssues = 0;
  let totalRecommendations = 0;
  
  Object.entries(results).forEach(([filePath, result]) => {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`📄 ${relativePath}`);
    
    if (!result.exists) {
      console.log('   ❌ 文件不存在\n');
      return;
    }
    
    console.log(`   行数: ${result.lines}`);
    
    if (result.issues.length > 0) {
      console.log('   ⚠️  发现问题:');
      result.issues.forEach(issue => {
        console.log(`     ${issue}`);
        totalIssues++;
      });
    }
    
    if (result.recommendations.length > 0) {
      console.log('   💡 优化建议:');
      result.recommendations.forEach(rec => {
        console.log(`     ${rec}`);
        totalRecommendations++;
      });
    }
    
    if (result.issues.length === 0 && result.recommendations.length === 0) {
      console.log('   ✅ 通过检查');
    }
    
    console.log();
  });
  
  console.log('📊 检查总结:');
  console.log(`   总文件数: ${Object.keys(results).length}`);
  console.log(`   发现问题: ${totalIssues} 个`);
  console.log(`   优化建议: ${totalRecommendations} 个`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 恭喜！手机端自适应配置良好');
  } else {
    console.log('\n🔧 需要修复的问题请优先处理');
  }
}

// 主函数
function main() {
  console.log('🔍 开始检查手机端自适应配置...\n');
  
  const results = {};
  
  FILES_TO_CHECK.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    results[fullPath] = checkFile(fullPath);
  });
  
  // 额外检查组件目录
  const componentsDir = path.join(__dirname, '..', 'src/components');
  if (fs.existsSync(componentsDir)) {
    const componentFiles = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
      .slice(0, 5); // 检查前5个组件
    
    componentFiles.forEach(file => {
      const fullPath = path.join(componentsDir, file);
      results[fullPath] = checkFile(fullPath);
    });
  }
  
  generateReport(results);
  
  // 生成优化建议
  console.log('\n🚀 手机端优化建议:');
  console.log('1. 确保所有页面都有正确的viewport设置');
  console.log('2. 使用Tailwind响应式前缀 (sm:, md:, lg:)');
  console.log('3. 图片使用Next.js Image组件并设置响应式布局');
  console.log('4. 字体大小在移动端至少使用text-sm');
  console.log('5. 触摸元素添加适当的反馈样式');
  console.log('6. 测试在320px-414px屏幕宽度的显示效果');
}

// 执行
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    process.exit(1);
  }
}

module.exports = { checkFile, generateReport };