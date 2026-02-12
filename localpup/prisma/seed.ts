import { PrismaClient } from '@prisma/client'
// import { hash } from 'bcryptjs' // 暂时不需要用户认证

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 创建示例酒店数据
  const hotel1 = await prisma.hotel.create({
    data: {
      name: '杭州西子湖四季酒店',
      nameEn: 'Four Seasons Hotel Hangzhou',
      slug: 'four-seasons-hangzhou',
      address: '杭州市西湖区灵隐路5号',
      city: 'Hangzhou',
      district: 'West Lake',
      latitude: 30.2435,
      longitude: 120.1456,
      description: '坐落于西湖畔的传统园林中，融合了中国古典建筑与现代奢华。',
      descriptionEn: 'Set amidst tranquil gardens by West Lake, blending traditional Chinese architecture with modern luxury.',
      aiSummary: '这家卓越的湖畔避世酒店完美融合了传统中式优雅与现代奢华。客人一致称赞精心设计的园林营造出远离喧嚣城市的宁静之所，而优越的地理位置让客人可以轻松抵达西湖最美的景点。宽敞的房间融入了地道的中国设计元素，配备高档床品和大理石浴室。屡获殊荣的水疗中心提供传统中式护理，多家餐饮场所供应卓越的地方和国际美食。',
      aiSummaryEn: 'This exceptional lakeside sanctuary offers an unparalleled blend of traditional Chinese elegance and modern luxury. Guests consistently praise the meticulously landscaped gardens that create a peaceful retreat from the bustling city, while the prime location provides easy access to West Lake\'s most scenic spots. The spacious rooms feature authentic Chinese design elements with contemporary comforts.',
      bookingRating: 4.9,
      bookingReviewCount: 1847,
      ctripRating: 4.8,
      ctripReviewCount: 2156,
      overallRating: 4.9,
      reviewCount: 2847,
      priceRangeMin: 2800,
      priceRangeMax: 4500,
      currency: 'CNY',
      amenities: ['Spa', 'Swimming Pool', 'Restaurant', 'Bar', 'Fitness Center', 'Garden', 'Concierge', 'Free WiFi'],
      bookingUrl: 'https://www.booking.com/hotel/cn/four-seasons-hangzhou.html',
      ctripUrl: 'https://hotels.ctrip.com/hotels/123456.html',
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
            caption: '酒店外观',
            captionEn: 'Hotel Exterior',
            isOfficial: true,
            order: 0,
            source: 'ctrip',
          },
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
            caption: '湖景客房',
            captionEn: 'Lake View Room',
            isOfficial: true,
            order: 1,
            source: 'ctrip',
          },
        ],
      },
    },
  })

  const hotel2 = await prisma.hotel.create({
    data: {
      name: '杭州柏悦酒店',
      nameEn: 'Park Hyatt Hangzhou',
      slug: 'park-hyatt-hangzhou',
      address: '杭州市江干区钱江路1366号',
      city: 'Hangzhou',
      district: 'CBD',
      latitude: 30.2556,
      longitude: 120.2156,
      description: '位于钱江新城CBD核心，拥有全景城市景观的现代化奢华酒店。',
      descriptionEn: 'Modern luxury hotel in Qianjiang New Town CBD with panoramic city views.',
      bookingRating: 4.8,
      bookingReviewCount: 1423,
      ctripRating: 4.9,
      ctripReviewCount: 1856,
      overallRating: 4.8,
      reviewCount: 1923,
      priceRangeMin: 1800,
      priceRangeMax: 3200,
      currency: 'CNY',
      amenities: ['Swimming Pool', 'Fitness Center', 'Restaurant', 'Bar', 'Business Center', 'Free WiFi'],
      bookingUrl: 'https://www.booking.com/hotel/cn/park-hyatt-hangzhou.html',
      ctripUrl: 'https://hotels.ctrip.com/hotels/234567.html',
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
            caption: '城市景观',
            captionEn: 'City View',
            isOfficial: true,
            order: 0,
            source: 'ctrip',
          },
        ],
      },
    },
  })

  const hotel3 = await prisma.hotel.create({
    data: {
      name: '法云安缦',
      nameEn: 'Amanfayun',
      slug: 'amanfayun-hangzhou',
      address: '杭州市西湖区法云弄22号',
      city: 'Hangzhou',
      district: 'Lingyin Temple',
      latitude: 30.2345,
      longitude: 120.1256,
      description: '古村庄改造而成的顶级避世度假村，被茶园环绕。',
      descriptionEn: 'Exclusive retreat in a restored ancient village surrounded by tea fields.',
      bookingRating: 5.0,
      bookingReviewCount: 567,
      ctripRating: 4.9,
      ctripReviewCount: 789,
      overallRating: 4.9,
      reviewCount: 892,
      priceRangeMin: 6500,
      priceRangeMax: 12000,
      currency: 'CNY',
      amenities: ['Spa', 'Restaurant', 'Cultural Activities', 'Library', 'Free WiFi'],
      bookingUrl: 'https://www.booking.com/hotel/cn/amanfayun.html',
      ctripUrl: 'https://hotels.ctrip.com/hotels/345678.html',
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
            caption: '古村落景观',
            captionEn: 'Ancient Village',
            isOfficial: true,
            order: 0,
            source: 'ctrip',
          },
        ],
      },
    },
  })

  // 创建示例评价
  await prisma.review.createMany({
    data: [
      {
        hotelId: hotel1.id,
        platform: 'booking',
        author: 'John Smith',
        rating: 5,
        content: 'Absolutely stunning property. The gardens are beautiful and the service is impeccable.',
        contentEn: 'Absolutely stunning property. The gardens are beautiful and the service is impeccable.',
        date: new Date('2026-01-15'),
        isUsedForAi: true,
      },
      {
        hotelId: hotel1.id,
        platform: 'ctrip',
        author: '张先生',
        rating: 5,
        content: '非常棒的酒店，园林设计一流，服务很贴心。',
        contentEn: 'Excellent hotel with top-notch garden design and thoughtful service.',
        date: new Date('2026-01-20'),
        isUsedForAi: true,
      },
      {
        hotelId: hotel2.id,
        platform: 'booking',
        author: 'Emma Wilson',
        rating: 5,
        content: 'Modern luxury at its finest. The views from the room are breathtaking.',
        contentEn: 'Modern luxury at its finest. The views from the room are breathtaking.',
        date: new Date('2026-02-01'),
        isUsedForAi: true,
      },
    ],
  })

  // 创建 API Key
  await prisma.apiKey.upsert({
    where: { key: 'lp_dev_demo_key_12345' },
    update: {},
    create: {
      key: 'lp_dev_demo_key_12345',
      name: 'Development Demo Key',
      isActive: true,
      rateLimit: 1000,
      requestsToday: 0,
      lastResetAt: new Date(),
    },
  })

  // 创建测试用户 (密码: password123) - 注释掉，因为当前项目不需要用户系统
  // const hashedPassword = await hash('password123', 12)
  // await prisma.user.upsert({
  //   where: { email: 'test@example.com' },
  //   update: {},
  //   create: {
  //     email: 'test@example.com',
  //     name: 'Test User',
  //     hashedPassword,
  //     role: 'user',
  //     isActive: true,
  //   },
  // })
  // console.log('Test user created: test@example.com / password123')

  // 创建示例景点
  await prisma.attraction.create({
    data: {
      name: '西湖',
      nameEn: 'West Lake',
      slug: 'west-lake',
      address: 'Xihu District, Hangzhou',
      city: 'Hangzhou',
      district: 'West Lake',
      latitude: 30.2435,
      longitude: 120.1456,
      description: 'West Lake is a freshwater lake in Hangzhou, China. It is divided into five sections by three causeways.',
      descriptionEn: 'West Lake is a freshwater lake in Hangzhou, China. It is divided into five sections by three causeways.',
      aiSummary: 'West Lake is undoubtedly the crown jewel of Hangzhou and a must-visit destination for any traveler.',
      category: 'Nature',
      visitDuration: '3-4 hours',
      bestTimeToVisit: 'Spring (March to May) and Autumn (September to November)',
      tips: 'Visit early morning to avoid crowds. Bring comfortable walking shoes.',
      isFree: true,
      ticketPrice: 0,
      openTime: 'Open 24 hours',
      openDays: 'Daily',
      overallRating: 4.9,
      reviewCount: 15890,
      googleRating: 4.8,
      ctripRating: 4.9,
      isUnesco: true,
      facilities: ['Boat Rental', 'Bicycle Rental', 'Restrooms', 'Restaurants'],
      activities: ['Boat Cruise', 'Cycling', 'Walking', 'Photography'],
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1597743057129-30193259b26c?w=1200&q=80',
            caption: '西湖全景',
            captionEn: 'West Lake Panorama',
            isOfficial: true,
            order: 0,
          },
        ],
      },
    },
  })

  await prisma.attraction.create({
    data: {
      name: '灵隐寺',
      nameEn: 'Lingyin Temple',
      slug: 'lingyin-temple',
      address: '1 Fayun Lane, Xihu District',
      city: 'Hangzhou',
      district: 'Lingyin Temple',
      latitude: 30.2345,
      longitude: 120.1256,
      description: 'One of the wealthiest and most famous Buddhist monasteries in China.',
      descriptionEn: 'One of the wealthiest and most famous Buddhist monasteries in China.',
      category: 'Historical',
      visitDuration: '2-3 hours',
      bestTimeToVisit: 'Early morning',
      ticketPrice: 75,
      openTime: '07:00-18:00',
      openDays: 'Daily',
      overallRating: 4.7,
      reviewCount: 8923,
      isUnesco: false,
      facilities: ['Parking', 'Restaurant', 'Shops'],
      activities: ['Temple Visit', 'Hiking', 'Photography'],
      isActive: true,
      isFeatured: true,
    },
  })

  // 创建示例餐厅
  await prisma.restaurant.create({
    data: {
      name: '楼外楼',
      nameEn: 'Lou Wai Lou',
      slug: 'lou-wai-lou',
      address: '30 Gushan Road, Xihu District',
      city: 'Hangzhou',
      district: 'West Lake',
      latitude: 30.2500,
      longitude: 120.1400,
      description: 'Founded in 1848, Lou Wai Lou is one of Hangzhou\'s most famous and historic restaurants.',
      descriptionEn: 'Founded in 1848, Lou Wai Lou is one of Hangzhou\'s most famous and historic restaurants.',
      aiSummary: 'Lou Wai Lou is not just a restaurant; it\'s a living piece of Hangzhou history.',
      cuisine: ['Hangzhou Cuisine', 'Chinese'],
      priceRange: '$$$',
      pricePerPerson: 280,
      openTime: '10:30-14:00, 16:30-21:00',
      openDays: 'Daily',
      specialties: ['西湖醋鱼', '东坡肉', '龙井虾仁'],
      features: ['Lake View', 'Historic', 'Private Rooms'],
      overallRating: 4.5,
      reviewCount: 5234,
      dianpingRating: 4.4,
      isMichelin: false,
      reservationRequired: true,
      reservationPhone: '+86 571 8796 9682',
      isActive: true,
      isFeatured: true,
    },
  })

  await prisma.restaurant.create({
    data: {
      name: '金沙厅',
      nameEn: 'Jin Sha',
      slug: 'jin-sha',
      address: '28 Huabin Road, Shangcheng District',
      city: 'Hangzhou',
      district: 'CBD',
      description: 'Michelin-starred Cantonese restaurant offering exquisite dim sum and traditional dishes.',
      descriptionEn: 'Michelin-starred Cantonese restaurant offering exquisite dim sum and traditional dishes.',
      cuisine: ['Cantonese', 'Chinese'],
      priceRange: '$$$$',
      pricePerPerson: 680,
      openTime: '11:30-14:30, 17:30-22:00',
      openDays: 'Daily',
      specialties: ['Dim Sum', 'Roasted Meats', 'Seafood'],
      features: ['Michelin Starred', 'Luxury', 'Private Dining'],
      overallRating: 4.8,
      reviewCount: 1892,
      isMichelin: true,
      michelinStars: 1,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
