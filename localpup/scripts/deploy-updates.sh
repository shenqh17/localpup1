#!/bin/bash

# LocalPup评分系统升级部署脚本
# 执行顺序：1.构建检查 2.测试验证 3.部署上线

set -e  # 遇到错误立即退出

echo "🚀 开始部署LocalPup评分系统升级..."
echo "="*50

# 1. 检查环境
echo "🔍 检查环境..."
node --version
npm --version
git --version

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci --silent

# 3. 类型检查
echo "🔧 运行TypeScript检查..."
npx tsc --noEmit

# 4. 构建项目
echo "🏗️  构建项目..."
npm run build

# 5. 运行测试
echo "🧪 运行测试..."
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  npm test -- --passWithNoTests
else
  echo "⚠️  未找到测试配置，跳过测试"
fi

# 6. 检查新组件
echo "📁 检查新组件..."
COMPONENTS=(
  "src/components/MetalPupRating.tsx"
  "src/components/HotelRatingDisplay.tsx"
  "src/lib/rating-converter.ts"
  "scripts/update-ratings-weekly.js"
)

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "  ✅ $component 存在"
  else
    echo "  ❌ $component 缺失"
    exit 1
  fi
done

# 7. 验证数据文件
echo "📊 验证酒店数据..."
node -e "
  const hotels = require('./src/data/hotels100.ts').hotels;
  console.log('  酒店数量:', hotels.length);
  
  // 检查评分字段
  const hotelWithRatings = hotels.filter(h => 
    h.bookingRating || h.agodaRating || h.airbnbRating || h.ctripRating || h.fliggyRating
  );
  console.log('  有评分的酒店:', hotelWithRatings.length);
  
  // 检查新字段
  const hotelsWithNewFields = hotels.filter(h => h.agodaRating || h.airbnbRating);
  console.log('  包含Agoda/Airbnb评分的酒店:', hotelsWithNewFields.length);
"

# 8. 提交代码变更
echo "📝 提交代码变更..."
if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "升级：高级评分系统 - 金属质感Pup评分、7平台显示、智能10分制算法、每周自动更新"
  echo "  ✅ 代码变更已提交"
else
  echo "  ℹ️  无代码变更需要提交"
fi

# 9. 推送到GitHub（触发Vercel部署）
echo "🚀 推送到GitHub..."
if git push origin main; then
  echo "  ✅ 代码推送成功，Vercel部署已触发"
else
  echo "  ⚠️  代码推送失败，请检查网络连接"
  echo "  💡 提示: 可以手动推送到GitHub触发部署"
fi

# 10. 部署完成提示
echo ""
echo "="*50
echo "🎉 部署准备完成！"
echo "="*50
echo ""
echo "📋 本次升级包含："
echo "  1. 🏆 金属质感Pup评分气泡（勋章风格）"
echo "  2. 🔢 智能10分制算法（携程/飞猪5分制智能换算）"
echo "  3. 📊 7平台评分显示（新增Agoda和Airbnb）"
echo "  4. 🔄 每周自动更新机制"
echo "  5. 🎨 高级UI视觉效果"
echo ""
echo "⏰ Vercel部署时间线："
echo "  - 立即：GitHub接收代码"
echo "  - 2-3分钟：Vercel构建开始"
echo "  - 5-7分钟：构建完成，部署到CDN"
echo "  - 8-10分钟：CDN传播完成，网站更新"
echo ""
echo "🔍 验证步骤："
echo "  1. 访问 https://www.localpup.online/hotels"
echo "  2. 检查金属质感Pup评分气泡"
echo "  3. 验证7平台评分显示"
echo "  4. 测试中英文切换"
echo "  5. 确认所有功能正常"
echo ""
echo "📞 如有问题，请立即反馈！"

exit 0