#!/usr/bin/env node

/**
 * 检查部署状态和配置
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 检查LocalPup部署状态...\n');

// 1. 检查项目结构
console.log('1. 项目结构检查:');
const requiredFiles = [
  'package.json',
  'next.config.js',
  'src/data/hotels100.ts',
  'src/app/hotels/page.tsx',
  'src/app/test-hotels/page.tsx'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 2. 检查构建输出
console.log('\n2. 构建输出检查:');
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  const buildTime = fs.statSync(nextDir).mtime;
  console.log(`  ✅ .next 文件夹存在`);
  console.log(`     最后修改: ${buildTime.toLocaleString()}`);
  
  // 检查关键构建文件
  const buildFiles = [
    '.next/BUILD_ID',
    '.next/server/pages-manifest.json',
    '.next/static/chunks'
  ];
  
  buildFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
} else {
  console.log('  ❌ .next 文件夹不存在，需要构建');
}

// 3. 检查数据文件
console.log('\n3. 数据文件检查:');
const hotelsFile = path.join(__dirname, '..', 'src/data/hotels100.ts');
if (fs.existsSync(hotelsFile)) {
  const content = fs.readFileSync(hotelsFile, 'utf8');
  const hotelCount = (content.match(/id:\s*'/g) || []).length;
  console.log(`  ✅ hotels100.ts 包含 ${hotelCount} 家酒店`);
  
  // 检查导出
  const hasExport = content.includes('export { allHotels as hotels }');
  console.log(`  ${hasExport ? '✅' : '❌'} 正确导出 hotels 变量`);
} else {
  console.log('  ❌ hotels100.ts 文件不存在');
}

// 4. 检查页面导入
console.log('\n4. 页面导入检查:');
const pageFiles = [
  'src/app/hotels/page.tsx',
  'src/app/test-hotels/page.tsx'
];

pageFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importsHotels = content.includes("from '@/data/hotels100'");
    console.log(`  ${importsHotels ? '✅' : '❌'} ${file} 导入 hotels100`);
  } else {
    console.log(`  ❌ ${file} 不存在`);
  }
});

// 5. 检查Git状态
console.log('\n5. Git状态检查:');
try {
  const gitStatus = execSync('git status --short', { 
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8' 
  }).trim();
  
  if (gitStatus) {
    console.log('  ⚠️  有未提交的更改:');
    gitStatus.split('\n').forEach(line => {
      if (line) console.log(`     ${line}`);
    });
  } else {
    console.log('  ✅ 所有更改已提交');
  }
  
  const currentBranch = execSync('git branch --show-current', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  }).trim();
  console.log(`  当前分支: ${currentBranch}`);
  
} catch (error) {
  console.log('  ❌ 无法检查Git状态');
}

// 6. 检查依赖
console.log('\n6. 依赖检查:');
const packageJson = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'package.json'),
  'utf8'
));

console.log(`  项目名称: ${packageJson.name}`);
console.log(`  Next.js版本: ${packageJson.dependencies.next || '未找到'}`);
console.log(`  脚本命令: ${Object.keys(packageJson.scripts).join(', ')}`);

// 7. 建议
console.log('\n📋 建议操作:');
console.log('=' .repeat(40));

console.log('\nA. 本地测试:');
console.log('  1. 启动开发服务器: npm run dev');
console.log('  2. 访问 http://localhost:3000/test-hotels');
console.log('  3. 验证显示酒店数量');

console.log('\nB. 构建生产版本:');
console.log('  1. 清除缓存: rm -rf .next');
console.log('  2. 构建: npm run build');
console.log('  3. 启动: npm run start');
console.log('  4. 访问 http://localhost:3000:3000');

console.log('\nC. 部署到Vercel:');
console.log('  1. 确保所有更改已提交: git add . && git commit -m "更新"');
console.log('  2. 推送到GitHub: git push origin main');
console.log('  3. Vercel会自动构建部署');

console.log('\nD. 问题排查:');
console.log('  1. 检查Vercel构建日志');
console.log('  2. 验证环境变量配置');
console.log('  3. 检查Next.js配置 (next.config.js)');

console.log('\n🔧 立即执行命令:');
console.log('cd /Users/mac/.openclaw/workspace/localpup');
console.log('npm run dev &');
console.log('sleep 5 && curl http://localhost:3000/test-hotels');