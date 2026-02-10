# LocalPup API 文档

## 概述

LocalPup 提供 RESTful API 供外部 Agent 接入，支持搜索、筛选和获取酒店详情。

## 认证

所有 API 请求需要在 Header 中提供 API Key：

```
X-API-Key: your_api_key_here
```

## 端点

### 1. 搜索酒店

```
GET /api/v1/search
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 否 | 搜索关键词（酒店名、区域等） |
| city | string | 否 | 城市名称，默认 Hangzhou |
| district | string | 否 | 区域筛选 |
| min_rating | float | 否 | 最低评分，默认 0 |
| max_price | int | 否 | 最高价格 |
| limit | int | 否 | 返回数量，默认 10，最大 50 |
| ai_summary | boolean | 否 | 是否包含 AI 总结 |

**示例请求：**

```bash
curl -X GET "https://localpup.com/api/v1/search?q=西湖&min_rating=4.5&limit=5" \
  -H "X-API-Key: your_api_key"
```

**示例响应：**

```json
{
  "success": true,
  "meta": {
    "query": "西湖",
    "city": "Hangzhou",
    "resultsCount": 5,
    "timestamp": "2026-02-09T10:00:00.000Z"
  },
  "data": [
    {
      "id": "uuid",
      "name": "Four Seasons Hotel Hangzhou",
      "nameEn": "杭州西子湖四季酒店",
      "slug": "four-seasons-hangzhou",
      "url": "https://localpup.com/hotels/four-seasons-hangzhou",
      "location": {
        "address": "5 Lingyin Road, Xihu District",
        "district": "West Lake",
        "coordinates": {
          "lat": 30.2435,
          "lng": 120.1456
        }
      },
      "description": "Luxury resort nestled among traditional gardens...",
      "aiSummary": "This exceptional lakeside sanctuary offers...",
      "ratings": {
        "overall": 4.9,
        "reviewCount": 2847,
        "booking": 4.9,
        "ctrip": 4.8
      },
      "pricing": {
        "min": 2800,
        "max": 4500,
        "currency": "CNY"
      },
      "amenities": ["Spa", "Pool", "Restaurant", "Bar"],
      "bookingLinks": {
        "booking": "https://booking.com/...",
        "ctrip": "https://ctrip.com/..."
      },
      "images": [
        "https://images.localpup.com/..."
      ]
    }
  ]
}
```

### 2. 获取 API 使用信息

```
POST /api/v1/search
```

**响应：**

```json
{
  "success": true,
  "data": {
    "keyName": "My Application",
    "isActive": true,
    "rateLimit": 1000,
    "requestsToday": 45,
    "requestsRemaining": 955
  }
}
```

### 3. 获取酒店列表（内部）

```
GET /api/hotels
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| city | string | 城市名称 |
| rating_min | float | 最低评分 |
| price_min | int | 最低价格 |
| price_max | int | 最高价格 |
| page | int | 页码，默认 1 |
| limit | int | 每页数量，默认 20 |
| sort | string | 排序字段 |
| order | string | asc 或 desc |

## 错误处理

**错误响应格式：**

```json
{
  "success": false,
  "error": "错误代码",
  "message": "详细错误信息"
}
```

**常见错误码：**

| HTTP 状态 | 错误代码 | 说明 |
|-----------|----------|------|
| 401 | Invalid API key | API Key 无效或缺失 |
| 429 | Rate limit exceeded | 超出速率限制 |
| 500 | Internal server error | 服务器内部错误 |

## 速率限制

- 默认每个 API Key 每日限制：1000 次请求
- 超过限制后需等待次日重置或联系管理员

## 最佳实践

1. **缓存结果**：建议缓存搜索结果 1-5 分钟，减少重复请求
2. **批量获取**：使用合理的 limit 参数，避免频繁分页请求
3. **错误重试**：遇到 5xx 错误时，使用指数退避策略重试
4. **使用 AI 总结**：仅在需要时添加 `ai_summary=true`，减少响应大小

## SDK 示例

### Python

```python
import requests

class LocalPupClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://localpup.com/api/v1"
    
    def search_hotels(self, query=None, **kwargs):
        headers = {"X-API-Key": self.api_key}
        params = {"q": query, **kwargs}
        
        response = requests.get(
            f"{self.base_url}/search",
            headers=headers,
            params=params
        )
        return response.json()

# 使用示例
client = LocalPupClient("your_api_key")
results = client.search_hotels(
    query="West Lake",
    min_rating=4.5,
    limit=10
)
```

### JavaScript

```javascript
class LocalPupClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://localpup.com/api/v1';
  }
  
  async searchHotels(query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    
    const response = await fetch(
      `${this.baseUrl}/search?${params}`,
      {
        headers: {
          'X-API-Key': this.apiKey
        }
      }
    );
    
    return response.json();
  }
}

// 使用示例
const client = new LocalPupClient('your_api_key');
const results = await client.searchHotels('West Lake', {
  min_rating: 4.5,
  limit: 10
});
```
