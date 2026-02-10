/**
 * AI 评价总结服务
 * 使用 Minimax API 自动总结酒店评价
 * 重点突出优点，弱化缺点
 */

interface Review {
  content: string
  rating: number
  platform: string
}

interface SummaryResult {
  summary: string
  summaryEn: string
  highlights: string[]
}

export async function generateHotelSummary(
  hotelName: string,
  reviews: Review[]
): Promise<SummaryResult> {
  // 筛选高评分评价用于总结
  const positiveReviews = reviews
    .filter(r => r.rating >= 4)
    .map(r => r.content)
    .slice(0, 20) // 限制数量
  
  if (positiveReviews.length === 0) {
    return {
      summary: '暂无足够评价进行AI总结',
      summaryEn: 'Not enough reviews for AI summary',
      highlights: [],
    }
  }

  const prompt = `请根据以下酒店评价，生成一段吸引人的酒店介绍。要求：
1. 重点突出酒店的优势和亮点
2. 使用积极正面的语言
3. 涵盖位置、设施、服务、餐饮等方面
4. 适合展示给潜在客人
5. 中文200-300字

酒店名称：${hotelName}

评价内容：
${positiveReviews.join('\n')}

请生成中文总结：`

  try {
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.1',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的酒店评价分析师，擅长从客户评价中提取亮点并生成吸引人的酒店介绍。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Minimax API error: ${response.status}`)
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || ''
    
    // 提取亮点
    const highlights = extractHighlights(summary)
    
    // 生成英文版本
    const summaryEn = await translateToEnglish(summary)
    
    return {
      summary: summary.trim(),
      summaryEn,
      highlights,
    }
  } catch (error) {
    console.error('Error generating summary:', error)
    return {
      summary: 'AI总结生成失败，请查看原始评价',
      summaryEn: 'AI summary generation failed',
      highlights: [],
    }
  }
}

function extractHighlights(summary: string): string[] {
  // 简单的亮点提取逻辑
  const sentences = summary.split(/[。！？]/)
  return sentences
    .filter(s => 
      s.includes('优秀') || 
      s.includes('出色') || 
      s.includes('完美') ||
      s.includes('一流') ||
      s.includes('推荐') ||
      s.includes('值得')
    )
    .slice(0, 6)
    .map(s => s.trim())
}

async function translateToEnglish(chineseText: string): Promise<string> {
  try {
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.1',
        messages: [
          {
            role: 'user',
            content: `Translate the following Chinese text to English, maintaining a professional and appealing tone:\n\n${chineseText}`,
          },
        ],
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || chineseText
  } catch {
    return chineseText
  }
}
