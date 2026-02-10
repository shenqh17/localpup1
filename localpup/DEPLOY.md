# LocalPup 部署指南

## 系统要求

- Node.js 18+
- PostgreSQL 14+
- Python 3.9+（用于爬虫）
- Playwright（用于爬虫浏览器）

## 本地开发部署

### 1. 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 安装 Python 依赖
pip install playwright asyncio
playwright install chromium
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 填入你的配置
```

### 3. 设置数据库

```bash
# 创建数据库
createdb localpup

# 推送 Schema
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## Docker 部署

### 使用 Docker Compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 手动 Docker 构建

```bash
# 构建镜像
docker build -t localpup .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e MINIMAX_API_KEY="..." \
  --name localpup \
  localpup
```

## 生产环境部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 自有服务器部署

1. **构建应用**
```bash
npm ci
npm run build
```

2. **环境变量配置**
```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://user:pass@localhost:5432/localpup"
export MINIMAX_API_KEY="your_key"
```

3. **使用 PM2 启动**
```bash
npm install -g pm2
pm2 start npm --name "localpup" -- start
pm2 save
pm2 startup
```

4. **Nginx 配置**

```nginx
server {
    listen 80;
    server_name localpup.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 数据库迁移

```bash
# 创建迁移
npx prisma migrate dev --name init

# 部署迁移
npx prisma migrate deploy
```

## 爬虫部署

### 使用 Cron 定时抓取

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点抓取数据
0 2 * * * cd /path/to/localpup && /usr/bin/python3 scripts/scraper.py >> /var/log/localpup-scraper.log 2>&1
```

### 使用 Systemd 服务

创建 `/etc/systemd/system/localpup-scraper.service`：

```ini
[Unit]
Description=LocalPup Data Scraper
After=network.target

[Service]
Type=oneshot
User=localpup
WorkingDirectory=/path/to/localpup
ExecStart=/usr/bin/python3 scripts/scraper.py
Environment=DATABASE_URL=postgresql://localhost/localpup

[Install]
WantedBy=multi-user.target
```

创建定时器 `/etc/systemd/system/localpup-scraper.timer`：

```ini
[Unit]
Description=Run LocalPup Scraper daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

启动定时器：

```bash
sudo systemctl enable localpup-scraper.timer
sudo systemctl start localpup-scraper.timer
```

## 监控与日志

### 使用 PM2 监控

```bash
pm2 monit
```

### 日志查看

```bash
# 应用日志
tail -f ~/.pm2/logs/localpup-out.log

# 错误日志
tail -f ~/.pm2/logs/localpup-error.log

# 爬虫日志
tail -f /var/log/localpup-scraper.log
```

## 备份策略

### 数据库备份

```bash
# 每日备份脚本
#!/bin/bash
BACKUP_DIR="/backup/localpup"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump localpup > "$BACKUP_DIR/localpup_$DATE.sql"

# 保留最近 7 天的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### 图片备份

建议使用云存储（AWS S3、阿里云 OSS）存储图片，并开启自动备份。

## SSL 证书配置

### 使用 Certbot

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d localpup.com -d www.localpup.com

# 自动续期
sudo certbot renew --dry-run
```

## 性能优化

### 1. 启用缓存

```bash
# 安装 Redis
sudo apt install redis-server

# 配置 Next.js 使用 Redis 缓存
# 见 next.config.js
```

### 2. 图片优化

- 使用 Next.js Image 组件
- 配置 CDN（Cloudflare、阿里云 CDN）
- 启用图片懒加载

### 3. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_hotel_city ON "Hotel"(city);
CREATE INDEX idx_hotel_rating ON "Hotel"(overallRating DESC);
CREATE INDEX idx_hotel_active ON "Hotel"(isActive);
CREATE INDEX idx_review_hotel ON "Review"(hotelId);
```

## 安全建议

1. **防火墙配置**：仅开放 80、443、22 端口
2. **定期更新**：保持系统和依赖包更新
3. **API 限流**：配置合理的速率限制
4. **数据加密**：敏感数据加密存储
5. **访问控制**：使用强密码和 SSH Key

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 服务状态
   - 验证 DATABASE_URL 配置
   - 确认防火墙设置

2. **爬虫无法启动**
   - 检查 Playwright 浏览器是否安装
   - 验证 Python 依赖
   - 查看网络连接

3. **AI 总结失败**
   - 验证 Minimax API Key
   - 检查 API 额度
   - 查看日志错误信息

### 获取帮助

- 查看日志：`npm run logs`
- 检查状态：`pm2 status`
- 联系支持：support@localpup.com
