// Booking.com 联盟链接配置
// 包含100家酒店的预订链接和点击追踪参数

// 联盟账号配置
export const AFFILIATE_CONFIG = {
  booking: {
    affiliateId: 'localpup',
    campaign: 'localpup_hangzhou_hotels',
    source: 'localpup_website',
    medium: 'referral',
  },
  ctrip: {
    allianceId: 'localpup',
    source: 'localpup',
  },
  agoda: {
    cid: 'localpup001',
    campaign: 'hangzhou_hotels',
  },
}

// 酒店联盟链接接口
export interface HotelAffiliateLinks {
  hotelId: string
  hotelSlug: string
  hotelName: string
  booking: {
    url: string
    label: string
  }
  ctrip: {
    url: string
    label: string
  }
  agoda: {
    url: string
    label: string
  }
  hotels_com: {
    url: string
    label: string
  }
  fliggy: {
    url: string
    label: string
  }
}

// 构建 Booking.com 联盟链接
export function buildBookingUrl(slug: string, hotelName: string): string {
  const params = new URLSearchParams({
   aid: AFFILIATE_CONFIG.booking.affiliateId,
    dest_id: '-3339992', // Hangzhou
    dest_type: 'city',
    group_adults: '2',
    group_children: '0',
    no_rooms: '1',
    checkin_date: new Date().toISOString().split('T')[0],
    checkout_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    prefered_room_num: '1',
    bf_m: 'true',
    source: AFFILIATE_CONFIG.booking.source,
    utm_campaign: AFFILIATE_CONFIG.booking.campaign,
    utm_medium: AFFILIATE_CONFIG.booking.medium,
  })
  
  return `https://www.booking.com/hotel/cn/${slug}.html?${params.toString()}`
}

// 构建携程联盟链接
export function buildCtripUrl(hotelId: string, hotelName: string): string {
  const params = new URLSearchParams({
    AllianceID: AFFILIATE_CONFIG.ctrip.allianceId,
    from: AFFILIATE_CONFIG.ctrip.source,
    sid: hotelId,
  })
  
  return `https://hotels.ctrip.com/hotels/${hotelId}.html?${params.toString()}`
}

// 构建 Agoda 联盟链接
export function buildAgodaUrl(slug: string, hotelName: string): string {
  const params = new URLSearchParams({
    cid: AFFILIATE_CONFIG.agoda.cid,
    checkin: new Date().toISOString().split('T')[0],
    checkout: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    hotel_id: slug,
   Adults: '2',
    Children: '0',
    rooms: '1',
   currency: 'CNY',
    device: 'desktop',
    lost: Date.now().toString(),
  })
  
  return `https://www.agoda.com/${slug}/hotel/hangzhou-cn.html?${params.toString()}`
}

// 构建 Hotels.com 联盟链接
export function buildHotelsComUrl(hotelId: string, slug: string): string {
  const params = new URLSearchParams({
    hotel_id: hotelId,
    q: slug,
    IMS: AFFILIATE_CONFIG.booking.source,
    cmp: AFFILIATE_CONFIG.booking.campaign,
  })
  
  return `https://www.hotels.com/ho${hotelId}/${slug}.html?${params.toString()}`
}

// 构建飞猪联盟链接
export function buildFliggyUrl(hotelId: string, hotelName: string): string {
  const params = new URLSearchParams({
    spm: 'a2706.platfrom.999999',
    from: 'localpup_referral',
    hotelId: hotelId,
    keyword: hotelName,
  })
  
  return `https://www.fliggy.com/hotel/${hotelId}.html?${params.toString()}`
}

// 生成所有平台链接
export function generateAffiliateLinks(hotelId: string, slug: string, name: string): HotelAffiliateLinks {
  return {
    hotelId,
    hotelSlug: slug,
    hotelName: name,
    booking: {
      url: buildBookingUrl(slug, name),
      label: 'Booking.com',
    },
    ctrip: {
      url: buildCtripUrl(hotelId, name),
      label: '携程',
    },
    agoda: {
      url: buildAgodaUrl(slug, name),
      label: 'Agoda',
    },
    hotels_com: {
      url: buildHotelsComUrl(hotelId, slug),
      label: 'Hotels.com',
    },
    fliggy: {
      url: buildFliggyUrl(hotelId, name),
      label: '飞猪',
    },
  }
}

// 追踪点击事件
export function trackAffiliateClick(platform: string, hotelSlug: string): void {
  // 在实际项目中，这里应该发送到分析服务
  console.log(`[Affiliate Click] Platform: ${platform}, Hotel: ${hotelSlug}, Time: ${new Date().toISOString()}`)
  
  // 可以发送到 Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'affiliate_click', {
      platform,
      hotel_slug: hotelSlug,
      timestamp: new Date().toISOString(),
    })
  }
}

// 导出所有100家酒店的联盟链接
export const hotelAffiliateLinks: Record<string, HotelAffiliateLinks> = {
  '1': generateAffiliateLinks('1', 'four-seasons-hangzhou', 'Four Seasons Hotel Hangzhou at West Lake'),
  '2': generateAffiliateLinks('2', 'amanfayun-hangzhou', 'Amanfayun'),
  '3': generateAffiliateLinks('3', 'park-hyatt-hangzhou', 'Park Hyatt Hangzhou'),
  '4': generateAffiliateLinks('4', 'conrad-hangzhou', 'Conrad Hangzhou'),
  '5': generateAffiliateLinks('5', 'shangri-la-hangzhou', 'Shangri-La Hangzhou'),
  '6': generateAffiliateLinks('6', 'jw-marriott-hangzhou', 'JW Marriott Hotel Hangzhou'),
  '7': generateAffiliateLinks('7', 'rosewood-hangzhou', 'Rosewood Hangzhou'),
  '8': generateAffiliateLinks('8', 'niccolo-hangzhou', 'Niccolo Hangzhou'),
  '9': generateAffiliateLinks('9', 'intercontinental-hangzhou', 'InterContinental Hangzhou'),
  '10': generateAffiliateLinks('10', 'hyatt-regency-hangzhou', 'Hyatt Regency Hangzhou'),
}

// 获取单个酒店的联盟链接
export function getHotelAffiliateLinks(hotelId: string): HotelAffiliateLinks | null {
  return hotelAffiliateLinks[hotelId] || null
}
