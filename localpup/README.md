# LocalPup - 杭州旅游信息聚合平台

## 项目概述

LocalPup 是一个面向外国游客的杭州旅游信息聚合平台，通过自动抓取 Booking、携程等平台数据，为游客提供统一的酒店、景点、餐厅信息展示。

## 核心功能

### 1. 数据聚合
- 自动抓取 Booking.com 酒店信息
- 自动抓取携程酒店官方照片和评分
- 多平台评分聚合与综合评分计算
- AI 自动总结酒店评价（突出优点）

### 2. 前端展示
- 精美简约的设计风格
- 响应式布局，支持移动端
- 多语言支持（中英双语）
- 高级筛选和搜索功能

### 3. AI 接入接口
- RESTful API 供外部 Agent 调用
- 支持搜索、筛选、详情查询
- API Key 认证和速率限制

### 4. 盈利模式
- Booking.com 联盟链接
- 携程联盟推广
- 广告位出租

## 技术栈

- **前端**: Next.js 14 + React 18 + Tailwind CSS
- **后端**: Next.js API Routes + Prisma ORM
- **数据库**: PostgreSQL
- **爬虫**: Python + Playwright
- **AI**: Minimax API (评价总结)
- **部署**: Vercel / 自有服务器

## 项目结构

```
localpup/
├── prisma/              # 数据库 schema
├── scripts/             # 爬虫脚本
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React 组件
│   ├── lib/            # 工具函数
│   └── types/          # TypeScript 类型
├── public/             # 静态资源
└── README.md
```

## 环境变量

创建 `.env` 文件：

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/localpup"

# Minimax AI
MINIMAX_API_KEY="your_minimax_api_key"

# 爬虫配置
BOOKING_AFFILIATE_ID="your_booking_affiliate_id"
CTRIP_AFFILIATE_ID="your_ctrip_affiliate_id"
```

## 启动步骤

1. 安装依赖：
```bash
npm install
```

2. 设置数据库：
```bash
npx prisma db push
```

3. 运行爬虫（抓取数据）：
```bash
npm run scrape
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 打开 http://localhost:3000

## API 接口

### 搜索酒店
```
GET /api/hotels?city=hangzhou&rating_min=4&page=1
```

### 获取酒店详情
```
GET /api/hotels/[slug]
```

### AI 接入端点（供外部 Agent 调用）
```
GET /api/v1/search?q=西湖附近酒店&limit=10
Headers: X-API-Key: your_api_key
```

## 开发计划

- [x] 项目架构设计
- [ ] 数据库模型设计
- [ ] 爬虫系统开发
- [ ] 前端页面开发
- [ ] AI 总结功能
- [ ] API 接口开发
- [ ] 联盟链接集成
- [ ] 部署上线

## 注意事项

1. 爬虫请遵守目标网站的 robots.txt 和服务条款
2. 建议设置合理的抓取频率，避免被封禁
3. 图片存储建议使用 CDN 或对象存储
4. 定期更新数据以保持信息准确性

## 许可证

MIT
