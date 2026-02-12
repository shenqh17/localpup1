#!/usr/bin/env node

/**
 * 测试酒店筛选功能
 */

console.log('🔍 开始测试酒店筛选功能...\n');

// 模拟测试数据
const testHotels = [
  { id: '1', location: 'West Lake, Hangzhou', locationZh: '杭州西湖', price: 1200, rating: 9.2, featured: true },
  { id: '2', location: 'Qianjiang New City, Hangzhou', locationZh: '杭州钱江新城', price: 800, rating: 8.7, featured: false },
  { id: '3', location: 'Binjiang District, Hangzhou', locationZh: '杭州滨江区', price: 450, rating: 8.3, featured: true },
  { id: '4', location: 'Wulin Square, Hangzhou', locationZh: '杭州武林广场', price: 350, rating: 8.0, featured: false },
  { id: '5', location: 'Xixi Wetland, Hangzhou', locationZh: '杭州西溪湿地', price: 280, rating: 7.8, featured: false }
];

// 地点筛选测试
console.log('1. 地点筛选测试:');
const locationTests = [
  { input: '西湖', expected: [0] },
  { input: '钱江新城', expected: [1] },
  { input: '滨江', expected: [2] },
  { input: '武林', expected: [3] },
  { input: '其他', expected: [4] }
];

locationTests.forEach(test => {
  const results = testHotels.filter(hotel => {
    const hotelLocation = hotel.locationZh;
    if (test.input === '其他') {
      const knownLocations = ['西湖', '钱江新城', '滨江', '武林'];
      return !knownLocations.some(loc => hotelLocation.includes(loc));
    }
    return hotelLocation.includes(test.input);
  });
  
  console.log(`  "${test.input}": 找到 ${results.length} 家酒店 ${results.length === test.expected.length ? '✅' : '❌'}`);
});

// 价格筛选测试
console.log('\n2. 价格筛选测试:');
const priceRanges = [
  { label: '豪华', min: 1500, max: Infinity, expected: [] },
  { label: '高端', min: 800, max: 1500, expected: [0, 1] },
  { label: '中端', min: 400, max: 800, expected: [2] },
  { label: '经济', min: 200, max: 400, expected: [3, 4] },
  { label: '民宿', min: 0, max: 200, expected: [] }
];

priceRanges.forEach(range => {
  const results = testHotels.filter(hotel => hotel.price >= range.min && hotel.price < range.max);
  console.log(`  ${range.label} (¥${range.min}+): 找到 ${results.length} 家酒店 ${results.length === range.expected.length ? '✅' : '❌'}`);
});

// 评分筛选测试
console.log('\n3. 评分筛选测试:');
const ratingThresholds = [
  { threshold: 9.0, expected: [0] },
  { threshold: 8.5, expected: [0] },
  { threshold: 8.0, expected: [0, 1, 2, 3] },
  { threshold: 7.5, expected: [0, 1, 2, 3, 4] }
];

ratingThresholds.forEach(test => {
  const results = testHotels.filter(hotel => hotel.rating >= test.threshold);
  console.log(`  ${test.threshold}+: 找到 ${results.length} 家酒店 ${results.length === test.expected.length ? '✅' : '❌'}`);
});

// 排序测试
console.log('\n4. 排序功能测试:');

// 按价格升序
const priceAsc = [...testHotels].sort((a, b) => a.price - b.price);
console.log(`  价格升序: ${priceAsc[0].price} → ${priceAsc[priceAsc.length-1].price} ${priceAsc[0].price === 280 ? '✅' : '❌'}`);

// 按价格降序
const priceDesc = [...testHotels].sort((a, b) => b.price - a.price);
console.log(`  价格降序: ${priceDesc[0].price} → ${priceDesc[priceDesc.length-1].price} ${priceDesc[0].price === 1200 ? '✅' : '❌'}`);

// 按评分降序
const ratingDesc = [...testHotels].sort((a, b) => b.rating - a.rating);
console.log(`  评分降序: ${ratingDesc[0].rating} → ${ratingDesc[ratingDesc.length-1].rating} ${ratingDesc[0].rating === 9.2 ? '✅' : '❌'}`);

// 推荐排序（精选优先，然后评分）
const recommended = [...testHotels].sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return b.rating - a.rating;
});
console.log(`  推荐排序: 第一个${recommended[0].featured ? '精选' : '非精选'} ${recommended[0].featured ? '✅' : '❌'}`);

console.log('\n📊 测试总结:');
const totalTests = locationTests.length + priceRanges.length + ratingThresholds.length + 4;
console.log(`  总测试项: ${totalTests}`);
console.log(`  通过率: 需要实际运行页面测试确认`);

console.log('\n🔧 建议:');
console.log('1. 在浏览器中手动测试筛选功能');
console.log('2. 检查中英文地点名称匹配');
console.log('3. 验证筛选结果即时更新');
console.log('4. 测试移动端筛选体验');

process.exit(0);