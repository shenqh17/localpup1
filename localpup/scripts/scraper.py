#!/usr/bin/env python3
"""
LocalPup 爬虫系统
抓取 Booking.com 和携程酒店数据
"""

import asyncio
import json
import os
import re
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urljoin, quote

from playwright.async_api import async_playwright, Page


class BaseScraper:
    """基础爬虫类"""
    
    def __init__(self):
        self.results = []
        
    async def init_browser(self):
        """初始化浏览器"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        
    async def close(self):
        """关闭浏览器"""
        await self.context.close()
        await self.browser.close()
        await self.playwright.stop()
        
    async def scrape_page(self, url: str) -> str:
        """抓取页面内容"""
        page = await self.context.new_page()
        try:
            await page.goto(url, wait_until='networkidle', timeout=60000)
            content = await page.content()
            return content
        finally:
            await page.close()


class BookingScraper(BaseScraper):
    """Booking.com 爬虫"""
    
    BASE_URL = "https://www.booking.com"
    
    async def search_hotels(self, city: str = "Hangzhou", pages: int = 3) -> List[Dict]:
        """搜索酒店列表"""
        hotels = []
        search_url = f"{self.BASE_URL}/searchresults.html?ss={quote(city)}&checkin=&checkout="
        
        page = await self.context.new_page()
        try:
            for p in range(pages):
                url = f"{search_url}&offset={p * 25}"
                print(f"[Booking] 正在抓取页面 {p + 1}: {url}")
                
                await page.goto(url, wait_until='networkidle', timeout=60000)
                await asyncio.sleep(2)  # 等待 JS 加载
                
                # 提取酒店数据
                hotel_cards = await page.query_selector_all('[data-testid="property-card"]')
                
                for card in hotel_cards:
                    try:
                        hotel = await self._parse_hotel_card(card)
                        if hotel:
                            hotels.append(hotel)
                    except Exception as e:
                        print(f"[Booking] 解析酒店卡片失败: {e}")
                        continue
                        
                await asyncio.sleep(1)
                
        finally:
            await page.close()
            
        print(f"[Booking] 共抓取 {len(hotels)} 家酒店")
        return hotels
    
    async def _parse_hotel_card(self, card) -> Optional[Dict]:
        """解析单个酒店卡片"""
        try:
            # 名称
            name_el = await card.query_selector('[data-testid="title"]')
            name = await name_el.inner_text() if name_el else None
            
            # 评分
            rating_el = await card.query_selector('[data-testid="review-score"]')
            rating_text = await rating_el.inner_text() if rating_el else "0"
            rating = float(re.search(r'(\d+\.?\d*)', rating_text).group(1)) if rating_text else None
            
            # 评论数
            review_el = await card.query_selector('[data-testid="review-count"]')
            review_text = await review_el.inner_text() if review_el else "0"
            review_count = int(re.search(r'(\d+)', review_text.replace(',', '')).group(1)) if review_text else 0
            
            # 价格
            price_el = await card.query_selector('[data-testid="price-and-discounted-price"]')
            price_text = await price_el.inner_text() if price_el else None
            price = None
            if price_text:
                price_match = re.search(r'(\d+[,\d]*)', price_text.replace(',', ''))
                if price_match:
                    price = int(price_match.group(1))
            
            # 链接
            link_el = await card.query_selector('a[data-testid="title-link"]')
            href = await link_el.get_attribute('href') if link_el else None
            url = urljoin(self.BASE_URL, href) if href else None
            
            # 图片
            img_el = await card.query_selector('img[data-testid="image"]')
            image_url = await img_el.get_attribute('src') if img_el else None
            
            if name and url:
                return {
                    'name': name.strip(),
                    'booking_rating': rating,
                    'booking_review_count': review_count,
                    'price': price,
                    'booking_url': url,
                    'thumbnail': image_url,
                    'source': 'booking'
                }
        except Exception as e:
            print(f"[Booking] 解析失败: {e}")
            
        return None
    
    async def get_hotel_details(self, url: str) -> Dict:
        """获取酒店详情"""
        page = await self.context.new_page()
        try:
            print(f"[Booking] 获取详情: {url}")
            await page.goto(url, wait_until='networkidle', timeout=60000)
            await asyncio.sleep(3)
            
            details = {'source': 'booking', 'url': url}
            
            # 地址
            address_el = await page.query_selector('[data-testid="address"]')
            details['address'] = await address_el.inner_text() if address_el else None
            
            # 描述
            desc_el = await page.query_selector('[data-testid="property-description"]')
            details['description'] = await desc_el.inner_text() if desc_el else None
            
            # 设施
            facility_els = await page.query_selector_all('.hp__hotel_facilities .facilities-checkmark')
            details['amenities'] = [await el.inner_text() for el in facility_els[:20]]
            
            # 所有图片
            image_els = await page.query_selector_all('.bh-photo-grid-item img')
            details['images'] = []
            for img in image_els[:30]:  # 限制数量
                src = await img.get_attribute('src')
                if src and 'max' in src:
                    # 获取高清图
                    high_res = src.replace('max300', 'max1024x768')
                    details['images'].append(high_res)
            
            return details
        finally:
            await page.close()


class CtripScraper(BaseScraper):
    """携程爬虫"""
    
    BASE_URL = "https://hotels.ctrip.com"
    
    async def search_hotels(self, city: str = "杭州", pages: int = 3) -> List[Dict]:
        """搜索酒店列表"""
        hotels = []
        search_url = f"{self.BASE_URL}/hotels/listPage?city=17&checkIn=&checkOut="
        
        page = await self.context.new_page()
        try:
            for p in range(pages):
                print(f"[Ctrip] 正在抓取页面 {p + 1}")
                
                await page.goto(search_url, wait_until='networkidle', timeout=60000)
                await asyncio.sleep(3)
                
                # 滚动加载
                for _ in range(3):
                    await page.evaluate('window.scrollBy(0, 800)')
                    await asyncio.sleep(1)
                
                # 提取酒店数据（需要根据实际页面结构调整选择器）
                hotel_cards = await page.query_selector_all('.hotel-item')
                
                for card in hotel_cards:
                    try:
                        hotel = await self._parse_hotel_card(card)
                        if hotel:
                            hotels.append(hotel)
                    except Exception as e:
                        print(f"[Ctrip] 解析酒店卡片失败: {e}")
                        continue
                        
                # 点击下一页
                next_btn = await page.query_selector('.next-page')
                if next_btn:
                    await next_btn.click()
                    await asyncio.sleep(2)
                else:
                    break
                    
        finally:
            await page.close()
            
        print(f"[Ctrip] 共抓取 {len(hotels)} 家酒店")
        return hotels
    
    async def _parse_hotel_card(self, card) -> Optional[Dict]:
        """解析单个酒店卡片"""
        try:
            # 名称
            name_el = await card.query_selector('.hotel-name')
            name = await name_el.inner_text() if name_el else None
            
            # 评分
            rating_el = await card.query_selector('.score')
            rating_text = await rating_el.inner_text() if rating_el else "0"
            rating = float(rating_text) if rating_text else None
            
            # 评论数
            review_el = await card.query_selector('.comment-count')
            review_text = await review_el.inner_text() if review_el else "0"
            review_count = int(re.search(r'(\d+)', review_text).group(1)) if review_text else 0
            
            # 价格
            price_el = await card.query_selector('.price')
            price_text = await price_el.inner_text() if price_el else None
            price = int(re.search(r'(\d+)', price_text).group(1)) if price_text else None
            
            # 链接
            link_el = await card.query_selector('a')
            href = await link_el.get_attribute('href') if link_el else None
            
            if name and href:
                return {
                    'name': name.strip(),
                    'ctrip_rating': rating,
                    'ctrip_review_count': review_count,
                    'price': price,
                    'ctrip_url': urljoin(self.BASE_URL, href),
                    'source': 'ctrip'
                }
        except Exception as e:
            print(f"[Ctrip] 解析失败: {e}")
            
        return None
    
    async def get_official_photos(self, url: str) -> List[Dict]:
        """
        获取携程官方照片
        只抓取官方照片，不包括用户上传的评论区照片
        """
        page = await self.context.new_page()
        photos = []
        
        try:
            print(f"[Ctrip] 获取官方照片: {url}")
            await page.goto(url, wait_until='networkidle', timeout=60000)
            await asyncio.sleep(3)
            
            # 点击相册按钮
            gallery_btn = await page.query_selector('.hotel-pic-gallery')
            if gallery_btn:
                await gallery_btn.click()
                await asyncio.sleep(2)
                
                # 等待相册加载
                await page.wait_for_selector('.gallery-image', timeout=10000)
                
                # 获取所有官方照片
                # 注意：这里需要过滤掉用户上传的照片
                image_els = await page.query_selector_all('.gallery-image[data-type="official"] img')
                
                for idx, img in enumerate(image_els[:50]):  # 限制数量
                    try:
                        src = await img.get_attribute('src')
                        if src:
                            # 获取高清图
                            high_res = src.replace('200w', '800w').replace('_R_', '')
                            caption = await img.get_attribute('alt') or ''
                            
                            photos.append({
                                'url': high_res,
                                'caption': caption,
                                'order': idx,
                                'is_official': True,
                                'source': 'ctrip'
                            })
                    except Exception as e:
                        continue
                        
            print(f"[Ctrip] 获取 {len(photos)} 张官方照片")
            
        except Exception as e:
            print(f"[Ctrip] 获取照片失败: {e}")
        finally:
            await page.close()
            
        return photos


async def main():
    """主函数"""
    print("=" * 50)
    print("LocalPup 爬虫系统启动")
    print("=" * 50)
    
    # Booking 爬虫
    booking = BookingScraper()
    await booking.init_browser()
    
    try:
        # 搜索杭州酒店
        booking_hotels = await booking.search_hotels(city="Hangzhou", pages=2)
        
        # 保存结果
        os.makedirs('data', exist_ok=True)
        with open('data/booking_hotels.json', 'w', encoding='utf-8') as f:
            json.dump(booking_hotels, f, ensure_ascii=False, indent=2)
            
        print(f"[主程序] Booking 数据已保存: {len(booking_hotels)} 家酒店")
        
        # 获取前3家酒店的详情（示例）
        for hotel in booking_hotels[:3]:
            if hotel.get('booking_url'):
                details = await booking.get_hotel_details(hotel['booking_url'])
                hotel.update(details)
                await asyncio.sleep(2)  # 避免请求过快
                
    finally:
        await booking.close()
    
    # 携程爬虫
    ctrip = CtripScraper()
    await ctrip.init_browser()
    
    try:
        ctrip_hotels = await ctrip.search_hotels(city="杭州", pages=2)
        
        with open('data/ctrip_hotels.json', 'w', encoding='utf-8') as f:
            json.dump(ctrip_hotels, f, ensure_ascii=False, indent=2)
            
        print(f"[主程序] 携程数据已保存: {len(ctrip_hotels)} 家酒店")
        
        # 获取照片示例
        for hotel in ctrip_hotels[:2]:
            if hotel.get('ctrip_url'):
                photos = await ctrip.get_official_photos(hotel['ctrip_url'])
                hotel['photos'] = photos
                await asyncio.sleep(2)
                
    finally:
        await ctrip.close()
    
    print("=" * 50)
    print("爬虫任务完成")
    print("=" * 50)


if __name__ == '__main__':
    asyncio.run(main())
