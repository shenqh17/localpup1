# LocalPup 联盟营销技术架构设计

## 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      前端展示层                                │
│  Next.js + React + Tailwind CSS                              │
│  - 酒店列表页                                                │
│  - 酒店详情页（含联盟链接）                                   │
│  - 价格对比组件                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      数据处理层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 官方 API 模块 │  │ 数据同步服务  │  │ 价格监控服务  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      数据存储层                                │
│  PostgreSQL + Prisma ORM                                     │
│  - hotels 表（酒店基础信息）                                   │
│  - prices 表（价格历史）                                       │
│  - affiliate_links 表（联盟链接）                              │
│  - sync_logs 表（同步日志）                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    第三方平台接口                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Booking  │ │  Agoda   │ │ Hotels   │ │  携程API  │       │
│  │   API    │ │   API    │ │   API    │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 数据库设计

### 1. 酒店基础表 (hotels)
```sql
model Hotel {
  id                String   @id @default(uuid())
  name              String
  nameEn            String?
  slug              String   @unique
  address           String
  city              String   @default("Hangzhou")
  district          String?
  latitude          Float?
  longitude         Float?
  description       String   @db.Text
  descriptionEn     String?  @db.Text
  
  // 平台ID（用于API对接）
  bookingId         String?
  agodaId           String?
  hotelscomId       String?
  ctripId           String?
  fliggyId          String?
  
  // 设施
  amenities         String[]
  
  // 图片
  images            HotelImage[]
  
  // 联盟链接
  affiliateLinks    AffiliateLink[]
  
  // 价格历史
  prices            PriceHistory[]
  
  // 状态
  isActive          Boolean  @default(true)
  isFeatured        Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastSyncedAt      DateTime?
}
```

### 2. 联盟链接表 (affiliate_links)
```sql
model AffiliateLink {
  id                String   @id @default(uuid())
  hotelId           String
  hotel             Hotel    @relation(fields: [hotelId], references: [id])
  
  platform          String   // booking, agoda, hotelscom, ctrip, fliggy
  affiliateId       String   // 联盟ID
  trackingUrl       String   // 追踪链接
  deepLink          String?  // 深度链接（直达酒店页面）
  
  commissionRate    Float    // 佣金比例
  cookieDuration    Int      // Cookie有效期（天）
  
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
}
```

### 3. 价格历史表 (price_history)
```sql
model PriceHistory {
  id                String   @id @default(uuid())
  hotelId           String
  hotel             Hotel    @relation(fields: [hotelId], references: [id])
  
  platform          String   // booking, agoda, hotelscom, ctrip, fliggy
  currency          String   @default("CNY")
  price             Int      // 价格（分）
  originalPrice     Int?     // 原价（用于显示折扣）
  
  checkInDate       DateTime // 入住日期
  checkOutDate      DateTime // 退房日期
  
  recordedAt        DateTime @default(now())
  
  @@index([hotelId, platform, recordedAt])
}
```

### 4. 同步日志表 (sync_logs)
```sql
model SyncLog {
  id                String   @id @default(uuid())
  platform          String   // booking, agoda, etc.
  syncType          String   // full, incremental, price_only
  status            String   // success, partial, failed
  itemsSynced       Int      @default(0)
  itemsFailed       Int      @default(0)
  message           String?
  startedAt         DateTime @default(now())
  completedAt       DateTime?
}
```

## 官方API对比

| 平台 | API可用性 | 数据获取 | 价格获取 | 申请难度 | 文档质量 |
|------|---------|---------|---------|---------|---------|
| **Booking.com** | ✅ 完善 | 完整 | 实时 | ⭐⭐ | 优秀 |
| **Agoda** | ✅ 完善 | 完整 | 实时 | ⭐⭐ | 良好 |
| **Hotels.com** | ⚠️ 有限 | 部分 | 延迟 | ⭐⭐⭐ | 一般 |
| **携程** | ⚠️ 需审批 | 完整 | 实时 | ⭐⭐⭐⭐ | 良好 |
| **飞猪** | ❌ 无公开API | - | - | - | - |

## 推荐技术方案

### 方案A：官方API对接（推荐）

**优点：**
- 合法合规，不会封号
- 数据稳定可靠
- 实时价格更新

**缺点：**
- 需要申请API权限
- 有调用频率限制
- 部分平台API功能有限

**实现步骤：**

1. **申请联盟账号和API**
```bash
# Booking.com
# 1. 注册 partner.booking.com
# 2. 申请 Content API 访问权限
# 3. 获取 affiliate_id 和 api_key

# Agoda
# 1. 注册 affiliates.agoda.com
# 2. 申请 API 访问
# 3. 获取 API key
```

2. **创建API客户端**
```typescript
// lib/api/booking.ts
export class BookingAPI {
  private apiKey: string
  private affiliateId: string
  
  async searchHotels(params: SearchParams) {
    const response = await fetch(
      `https://distribution-xml.booking.com/json/bookings.getHotels?` +
      `city_ids=${params.cityId}&` +
      `checkin=${params.checkIn}&` +
      `checkout=${params.checkOut}`
    )
    return response.json()
  }
  
  async getHotelPrices(hotelId: string) {
    // 获取实时价格
  }
  
  generateAffiliateLink(hotelId: string): string {
    return `https://www.booking.com/hotel/${hotelId}.html?aid=${this.affiliateId}`
  }
}
```

3. **数据同步服务**
```typescript
// services/sync-service.ts
export class HotelSyncService {
  async syncAllHotels() {
    // 1. 从 Booking.com API 获取酒店列表
    const bookingHotels = await bookingAPI.searchHotels({
      cityId: '3787', // 杭州
    })
    
    // 2. 更新数据库
    for (const hotel of bookingHotels) {
      await prisma.hotel.upsert({
        where: { bookingId: hotel.hotel_id },
        update: {
          nameEn: hotel.name,
          address: hotel.address,
          // ... 更新其他字段
        },
        create: {
          bookingId: hotel.hotel_id,
          nameEn: hotel.name,
          // ... 创建新记录
        }
      })
    }
  }
  
  async syncPrices() {
    // 定时同步价格
  }
}
```

4. **定时任务**
```typescript
// cron 定时同步
// 每天凌晨 2:00 同步全量数据
cron.schedule('0 2 * * *', async () => {
  await syncService.syncAllHotels()
})

// 每 30 分钟同步价格
cron.schedule('*/30 * * * *', async () => {
  await syncService.syncPrices()
})
```

### 方案B：混合模式（API + 手动维护）

**适用场景：**
- 部分平台没有API（如飞猪）
- 需要补充API之外的数据

**架构：**
```
官方API数据 ←→ 数据融合层 ←→ 手动补充数据
                    ↓
              统一数据库
                    ↓
               前端展示
```

## 数据更新流程

### 全量同步（每日1次）
```
1. 调用 Booking.com API 获取杭州所有酒店
2. 对比本地数据库，更新/新增/删除
3. 同步酒店图片、描述、设施
4. 生成/更新联盟链接
5. 记录同步日志
```

### 增量价格同步（每30分钟）
```
1. 获取活跃酒店的实时价格
2. 存储到 price_history 表
3. 更新酒店最低价格缓存
4. 触发价格变动通知（可选）
```

### 手动触发同步
```bash
# 通过管理后台手动触发
npm run sync:booking
npm run sync:agoda
npm run sync:all
```

## 联盟链接生成策略

### 1. 多平台价格对比
```typescript
// 组件：PriceComparison.tsx
export function PriceComparison({ hotel }: { hotel: Hotel }) {
  const prices = [
    { 
      platform: 'Booking.com', 
      price: hotel.bookingPrice,
      rating: hotel.bookingRating,
      url: hotel.affiliateLinks.find(l => l.platform === 'booking')?.trackingUrl
    },
    { 
      platform: 'Agoda', 
      price: hotel.agodaPrice,
      rating: hotel.agodaRating,
      url: hotel.affiliateLinks.find(l => l.platform === 'agoda')?.trackingUrl
    },
    // ... 其他平台
  ]
  
  // 按价格排序，突出最低价
  const sorted = prices.sort((a, b) => a.price - b.price)
  
  return (
    <div className="price-comparison">
      {sorted.map((item, index) => (
        <a 
          key={item.platform}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={index === 0 ? 'best-price' : ''}
        >
          <span>{item.platform}</span>
          <span>¥{item.price}</span>
          <span>{item.rating}分</span>
        </a>
      ))}
    </div>
  )
}
```

### 2. 深度链接优化
```typescript
// 带搜索参数的联盟链接
function generateDeepLink(
  platform: string, 
  hotelId: string, 
  checkIn: string, 
  checkOut: string,
  guests: number
): string {
  switch (platform) {
    case 'booking':
      return `https://www.booking.com/hotel/cn/${hotelId}.html?` +
             `aid=YOUR_AFFILIATE_ID&` +
             `checkin=${checkIn}&` +
             `checkout=${checkOut}&` +
             `group_adults=${guests}`
    
    case 'agoda':
      return `https://www.agoda.com/partners/partnersearch.aspx?` +
             `cid=YOUR_CID&` +
             `hid=${hotelId}&` +
             `checkin=${checkIn}&` +
             `checkout=${checkOut}`
    
    // ... 其他平台
  }
}
```

## 法律合规要点

### ✅ 必须遵守的规则

1. **robots.txt 遵守**
   - 不爬取禁止抓取的内容
   - 遵守各平台的爬虫协议

2. **联盟协议条款**
   - 阅读并遵守各平台联盟协议
   - 不使用误导性推广
   - 明确标注广告/联盟链接

3. **数据使用规范**
   - 不存储用户个人数据
   - 价格数据仅用于展示
   - 定期清理过期数据

4. **税务合规**
   - 联盟收入需申报纳税
   - 保留收入凭证

## 成本估算

| 项目 | 月度成本 | 说明 |
|------|---------|------|
| 服务器（VPS） | ¥50-100 | 2核4G即可 |
| 数据库（PostgreSQL） | ¥0 | 自建免费 |
| API调用（Booking） | ¥0 | 免费额度充足 |
| API调用（Agoda） | ¥0 | 免费 |
| 代理IP（可选） | ¥50-200 | 防IP被封 |
| **总计** | **¥100-300/月** | |

## 收益预估

假设：
- 月均访问量：10,000 UV
- 转化率：2%
- 客单价：¥1,000
- 佣金比例：平均 5%

**月收益：** 10,000 × 2% × ¥1,000 × 5% = **¥10,000**

ROI：¥10,000 / ¥200 = **50倍**

## 下一步行动计划

1. **本周内：** 申请 Booking.com 和 Agoda 联盟账号
2. **下周：** 对接 Booking.com API，完成数据同步架构
3. **第3周：** 申请携程联盟，对接 API
4. **第4周：** 完善价格监控和自动更新功能
5. **第5周：** 上线测试，优化转化率

## 技术栈推荐

- **后端：** Next.js API Routes + Prisma + PostgreSQL
- **API客户端：** 各平台官方 SDK 或 REST API
- **定时任务：** node-cron 或 OpenClaw 内置 cron
- **缓存：** Redis（可选，用于价格缓存）
- **监控：** 自建日志 + 邮件告警

---

*文档创建时间：2026-02-10*
*版本：v1.0*