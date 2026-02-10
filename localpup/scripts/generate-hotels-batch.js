// 批量酒店数据生成脚本
// 使用模板快速生成50家酒店数据

const HOTEL_TEMPLATES = {
  luxury: {
    priceRange: [3000, 8000],
    ratingRange: [4.7, 4.9],
    bookingRange: [9.2, 9.6],
    amenities: ['免费WiFi', '室内泳池', '水疗中心', '米其林餐厅', '管家服务', '健身房', '行政酒廊', '私人花园'],
    locations: ['西湖区', '上城区', '滨江区', '余杭区'],
    locationsEn: ['West Lake', 'Shangcheng', 'Binjiang', 'Yuhang']
  },
  premium: {
    priceRange: [1500, 3000],
    ratingRange: [4.5, 4.7],
    bookingRange: [9.0, 9.3],
    amenities: ['免费WiFi', '室内泳池', '健身房', '餐厅', '酒吧', '行政酒廊', '商务中心'],
    locations: ['西湖区', '上城区', '滨江区', '拱墅区'],
    locationsEn: ['West Lake', 'Shangcheng', 'Binjiang', 'Gongshu']
  },
  high: {
    priceRange: [800, 1500],
    ratingRange: [4.3, 4.6],
    bookingRange: [8.8, 9.2],
    amenities: ['免费WiFi', '健身房', '餐厅', '酒吧', '会议室', '自助早餐'],
    locations: ['西湖区', '下城区', '江干区', '萧山区'],
    locationsEn: ['West Lake', 'Xiacheng', 'Jianggan', 'Xiaoshan']
  },
  mid: {
    priceRange: [400, 800],
    ratingRange: [4.0, 4.4],
    bookingRange: [8.5, 9.0],
    amenities: ['免费WiFi', '餐厅', '健身房', '商务中心', '自助早餐'],
    locations: ['西湖区', '拱墅区', '江干区', '余杭区'],
    locationsEn: ['West Lake', 'Gongshu', 'Jianggan', 'Yuhang']
  },
  budget: {
    priceRange: [200, 400],
    ratingRange: [3.8, 4.2],
    bookingRange: [8.2, 8.8],
    amenities: ['免费WiFi', '早餐', '24小时前台', '行李寄存'],
    locations: ['下城区', '拱墅区', '江干区', '萧山区'],
    locationsEn: ['Xiacheng', 'Gongshu', 'Jianggan', 'Xiaoshan']
  },
  hostel: {
    priceRange: [100, 300],
    ratingRange: [4.0, 4.6],
    bookingRange: [8.8, 9.4],
    amenities: ['免费WiFi', '公共厨房', '洗衣房', '行李寄存', '社交活动'],
    locations: ['西湖区', '上城区', '下城区'],
    locationsEn: ['West Lake', 'Shangcheng', 'Xiacheng']
  }
};

const HOTEL_NAMES = {
  luxury: [
    { name: 'Amanfayun', nameZh: '法云安缦', location: 'West Lake', locationZh: '西湖区法云弄22号' },
    { name: 'Four Seasons Hangzhou', nameZh: '杭州西子湖四季酒店', location: 'West Lake', locationZh: '西湖区灵隐路5号' },
    { name: 'Mandarin Oriental', nameZh: '杭州文华东方酒店', location: 'West Lake', locationZh: '西湖区湖滨路28号' },
    { name: 'Park Hyatt Hangzhou', nameZh: '杭州柏悦酒店', location: 'Qianjiang', locationZh: '上城区钱江路1366号' },
    { name: 'Ritz-Carlton', nameZh: '杭州丽思卡尔顿酒店', location: 'West Lake', locationZh: '西湖区曙光路120号' },
    { name: 'Banyan Tree', nameZh: '杭州西溪悦榕庄', location: 'Xixi', locationZh: '余杭区紫金港路21号' },
    { name: 'Alila Anji', nameZh: '安吉阿丽拉', location: 'Anji', locationZh: '安吉县杭垓镇' },
    { name: 'Grand Hyatt', nameZh: '杭州君悦酒店', location: 'West Lake', locationZh: '上城区湖滨路28号' },
    { name: 'JW Marriott', nameZh: '杭州JW万豪酒店', location: 'Wulin', locationZh: '拱墅区湖墅南路28号' },
    { name: 'InterContinental', nameZh: '杭州洲际酒店', location: 'Qianjiang', locationZh: '上城区解放东路2号' }
  ],
  premium: [
    { name: 'Conrad Hangzhou', nameZh: '杭州康莱德酒店', location: 'Qianjiang', locationZh: '上城区新业路228号' },
    { name: 'Sheraton Grand', nameZh: '杭州滨江银泰喜来登', location: 'Binjiang', locationZh: '滨江区江虹路1769号' },
    { name: 'Crowne Plaza', nameZh: '杭州龙湖皇冠假日', location: 'Xiasha', locationZh: '钱塘区金沙大道523号' },
    { name: 'Holiday Inn', nameZh: '杭州空港假日酒店', location: 'Xiaoshan Airport', locationZh: '萧山区空港大道1号' },
    { name: 'Canopy Hilton', nameZh: '杭州西湖希尔顿嘉悦里', location: 'West Lake', locationZh: '上城区湖滨路202号' },
    { name: 'Radisson', nameZh: '杭州博地中心丽筠', location: 'Qianjiang', locationZh: '萧山区市心北路1675号' },
    { name: 'Xixi Hotel', nameZh: '杭州西溪宾馆', location: 'Xixi', locationZh: '西湖区文二西路803号' },
    { name: 'Shangri-La', nameZh: '杭州香格里拉', location: 'West Lake', locationZh: '西湖区北山街78号' },
    { name: 'Marriott Qianjiang', nameZh: '杭州钱江新城万豪', location: 'Qianjiang', locationZh: '上城区剧院路399号' },
    { name: 'Le Méridien', nameZh: '杭州滨江世融艾美', location: 'Binjiang', locationZh: '滨江区江南大道4756号' }
  ],
  high: [
    { name: 'DoubleTree Hilton', nameZh: '杭州和达希尔顿逸林', location: 'Xiasha', locationZh: '钱塘区金沙大道600号' },
    { name: 'Holiday Inn CBD', nameZh: '杭州钱江新城假日', location: 'Qianjiang', locationZh: '上城区钱潮路20号' },
    { name: 'Courtyard Wulin', nameZh: '杭州武林万怡', location: 'Wulin', locationZh: '下城区体育场路538号' },
    { name: 'Narada Grand', nameZh: '杭州君澜大饭店', location: 'West Lake', locationZh: '西湖区三台山山路149号' },
    { name: 'Sofitel Westlake', nameZh: '杭州索菲特西湖', location: 'West Lake', locationZh: '西湖区西湖大道333号' },
    { name: 'Grand Metropark', nameZh: '杭州维景国际', location: 'West Lake', locationZh: '上城区平海路2号' },
    { name: 'Zhejiang Hotel', nameZh: '杭州浙江宾馆', location: 'West Lake', locationZh: '西湖区三台山路278号' },
    { name: 'Hangzhou Hotel', nameZh: '杭州饭店', location: 'West Lake', locationZh: '西湖区北山街78号' },
    { name: 'Qiandao Lake Resort', nameZh: '杭州千岛湖度假村', location: 'Qiandao Lake', locationZh: '淳安县千岛湖镇' },
    { name: 'Fuyang Hotel', nameZh: '杭州富阳东方茂', location: 'Fuyang', locationZh: '富阳区金桥北路1号' }
  ],
  mid: [
    { name: 'Hilton Garden', nameZh: '杭州希尔顿花园', location: 'Binjiang', locationZh: '滨江区江南大道288号' },
    { name: 'Holiday Inn Express', nameZh: '杭州滨江智选假日', location: 'Binjiang', locationZh: '滨江区滨安路1181号' },
    { name: 'Ibis Westlake', nameZh: '杭州西湖宜必思', location: 'West Lake', locationZh: '西湖区南山路151号' },
    { name: 'Home Inn', nameZh: '杭州武林广场如家', location: 'Wulin', locationZh: '下城区体育场路370号' },
    { name: 'Vienna Hotel', nameZh: '杭州维也纳酒店', location: 'Xiaoshan', locationZh: '萧山区市心北路868号' },
    { name: 'Quanji Hotel', nameZh: '杭州全季酒店', location: 'Gongshu', locationZh: '拱墅区莫干山路102号' },
    { name: 'Ji Hotel', nameZh: '杭州桔子酒店', location: 'Xihu', locationZh: '西湖区文三路478号' },
    { name: 'Atour Hotel', nameZh: '杭州亚朵酒店', location: 'Jianggan', locationZh: '江干区钱江路336号' },
    { name: 'Crystal Hotel', nameZh: '杭州水晶城酒店', location: 'Gongshu', locationZh: '拱墅区湖州街18号' },
    { name: 'Huatian Hotel', nameZh: '杭州华天酒店', location: 'Xiacheng', locationZh: '下城区中山北路588号' }
  ],
  budget: [
    { name: '7 Days Inn', nameZh: '杭州西湖7天酒店', location: 'West Lake', locationZh: '西湖区保俶路1号' },
    { name: 'Hanting Hotel', nameZh: '杭州武林汉庭', location: 'Wulin', locationZh: '下城区延安路346号' },
    { name: 'GreenTree', nameZh: '杭州格林豪泰', location: 'Gongshu', locationZh: '拱墅区莫干山路766号' },
    { name: 'Super 8', nameZh: '杭州速8酒店', location: 'Xiaoshan', locationZh: '萧山区市心北路1200号' },
    { name: 'Jinjiang Inn', nameZh: '杭州锦江之星', location: 'West Lake', locationZh: '西湖区解放路1号' },
    { name: 'Pod Inn', nameZh: '杭州布丁酒店', location: 'Gongshu', locationZh: '拱墅区湖墅南路221号' },
    { name: 'Motel 168', nameZh: '杭州莫泰168', location: 'Binjiang', locationZh: '滨江区浦沿路773号' },
    { name: '99 Inn', nameZh: '杭州99旅馆', location: 'Jianggan', locationZh: '江干区天城路88号' },
    { name: 'Thank You Inn', nameZh: '杭州尚客优', location: 'Xiaoshan', locationZh: '萧山区金城路458号' },
    { name: 'Yeste Hotel', nameZh: '杭州雅斯特', location: 'Yuhang', locationZh: '余杭区五常大道158号' }
  ],
  hostel: [
    { name: 'West Lake Youth Hostel', nameZh: '杭州西湖国际青旅', location: 'West Lake', locationZh: '西湖区南山路101-11号' },
    { name: 'Hangzhou Intl Hostel', nameZh: '杭州国际青年旅舍', location: 'Shangcheng', locationZh: '上城区解放路2号' },
    { name: 'Longjing Homestay', nameZh: '龙井茶园民宿', location: 'Longjing', locationZh: '西湖区龙井村' },
    { name: 'Tea Boutique', nameZh: '杭州茶香丽舍', location: 'Longjing', locationZh: '西湖区龙井路' },
    { name: 'Xixi Hostel', nameZh: '杭州西溪青年旅舍', location: 'Xixi', locationZh: '西湖区文二西路822号' },
    { name: 'Wushan Hostel', nameZh: '杭州吴山驿青旅', location: 'Shangcheng', locationZh: '上城区中山南路' },
    { name: 'Lotus Hostel', nameZh: '杭州荷方青旅', location: 'West Lake', locationZh: '西湖区北山街' },
    { name: 'Cloud Hostel', nameZh: '杭州云端青旅', location: 'Xihu', locationZh: '西湖区文三路' },
    { name: 'Bamboo Hostel', nameZh: '杭州竹间青旅', location: 'Xihu', locationZh: '西湖区灵隐路' },
    { name: 'Lakeside Hostel', nameZh: '杭州湖畔青旅', location: 'West Lake', locationZh: '西湖区湖滨路' }
  ]
};

const UNSPLASH_IMAGES = {
  luxury: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80'
  ],
  premium: [
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80'
  ],
  high: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80'
  ],
  mid: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80'
  ],
  budget: [
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80',
    'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=1200&q=80'
  ],
  hostel: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80',
    'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=1200&q=80'
  ]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHotel(id, tier, nameData, index) {
  const template = HOTEL_TEMPLATES[tier];
  const price = randomInt(template.priceRange[0], template.priceRange[1]);
  const rating = (randomInt(template.ratingRange[0] * 10, template.ratingRange[1] * 10) / 10).toFixed(1);
  const bookingRating = (randomInt(template.bookingRange[0] * 10, template.bookingRange[1] * 10) / 10).toFixed(1);
  const agodaRating = (randomInt((template.bookingRange[0] - 0.3) * 10, (template.bookingRange[1] - 0.2) * 10) / 10).toFixed(1);
  const hotelscomRating = (randomInt((template.bookingRange[0] - 0.2) * 10, template.bookingRange[1] * 10) / 10).toFixed(1);
  
  const images = UNSPLASH_IMAGES[tier].map((url, i) => ({
    url,
    caption: ['Exterior', 'Lobby', 'Room', 'Restaurant', 'Pool'][i] || 'View',
    captionZh: ['外观', '大堂', '客房', '餐厅', '泳池'][i] || '景观',
    source: 'ctrip',
    sourceAttribution: '图片来自携程官方'
  }));

  return {
    id: String(id),
    name: nameData.name,
    nameZh: nameData.nameZh,
    slug: nameData.name.toLowerCase().replace(/\s+/g, '-'),
    image: images[0].url,
    images,
    rating: parseFloat(rating),
    bookingRating: parseFloat(bookingRating),
    bookingReviewCount: randomInt(500, 2500),
    agodaRating: parseFloat(agodaRating),
    agodaReviewCount: randomInt(300, 1500),
    hotelscomRating: parseFloat(hotelscomRating),
    hotelscomReviewCount: randomInt(200, 1200),
    ctripRating: parseFloat(rating),
    ctripReviewCount: randomInt(1000, 3000),
    fliggyRating: parseFloat(rating) - 0.1,
    fliggyReviewCount: randomInt(500, 1800),
    reviewCount: randomInt(2000, 8000),
    price,
    location: nameData.location,
    locationZh: nameData.locationZh,
    description: `Excellent ${tier} hotel in Hangzhou with great service and amenities.`,
    descriptionZh: `杭州优秀的${tier === 'luxury' ? '豪华' : tier === 'premium' ? '高端' : tier === 'high' ? '高档' : tier === 'mid' ? '中端' : tier === 'budget' ? '经济型' : '民宿'}酒店，服务优质，设施完善。`,
    amenities: template.amenities.slice(0, randomInt(5, template.amenities.length)),
    priceLevel: tier
  };
}

function generateAllHotels() {
  const allHotels = [];
  let id = 1;
  
  for (const [tier, hotels] of Object.entries(HOTEL_NAMES)) {
    for (let i = 0; i < hotels.length; i++) {
      allHotels.push(generateHotel(id++, tier, hotels[i], i));
    }
  }
  
  return allHotels;
}

const hotels = generateAllHotels();
console.log(JSON.stringify(hotels, null, 2));

// 输出统计
console.error(`\n生成完成: ${hotels.length} 家酒店`);
console.error('各档次分布:');
for (const tier of ['luxury', 'premium', 'high', 'mid', 'budget', 'hostel']) {
  const count = hotels.filter(h => h.priceLevel === tier).length;
  console.error(`  ${tier}: ${count} 家`);
}
