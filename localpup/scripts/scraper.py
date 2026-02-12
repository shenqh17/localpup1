#!/usr/bin/env python3
"""
LocalPup 爬虫系统
抓取 Booking.com 和携程酒店数据
增强版：更好的错误处理、备用选择器、详细的日志记录
"""

import asyncio
import json
import os
import re
import logging
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, quote

from playwright.async_api import async_playwright, Page, Playwright

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BaseScraper:
    """基础爬虫类"""

    def __init__(self, max_retries: int = 3, request_delay: float = 2.0):
        self.results = []
        self.max_retries = max_retries
        self.request_delay = request_delay
        self.playwright: Optional[Playwright] = None
        self.browser = None
        self.context = None

    async def init_browser(self):
        """初始化浏览器"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,SitePerProcess'
            ]
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            locale='zh-CN',
            timezone_id='Asia/Shanghai'
        )

    async def close(self):
        """关闭浏览器"""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def _retry_request(self, page: Page, url: str, max_retries: int = None) -> bool:
        """带重试的页面请求"""
        max_retries = max_retries or self.max_retries

        for attempt in range(max_retries):
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=30000)
                # 等待页面基本加载
                await page.wait_for_load_state('networkidle', timeout=15000)
                return True
            except Exception as e:
                logger.warning(f"[{self.__class__.__name__}] 第{attempt + 1}次尝试失败: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(self.request_delay * (attempt + 1))
                else:
                    logger.error(f"[{self.__class__.__name__}] 所有重试次数已用尽")
                    return False
        return False


class BookingScraper(BaseScraper):
    """Booking.com 爬虫"""

    BASE_URL = "https://www.booking.com"

    # 备用选择器列表（按优先级排序）
    SELECTORS = {
        'card': [
            '[data-testid="property-card"]',
            '.hotel-card',
            '.sr_property_block',
            '[class*="property-card"]',
        ],
        'name': [
            '[data-testid="title"]',
            '.hotel-name',
            '[class*="title"]',
            'h3',
        ],
        'rating': [
            '[data-testid="review-score"]',
            '.review-score',
            '[class*="review-score"]',
        ],
        'review_count': [
            '[data-testid="review-count"]',
            '.review-count',
            '[class*="review-count"]',
        ],
        'price': [
            '[data-testid="price-and-discounted-price"]',
            '.price',
            '[class*="price"]',
            '[data-price]',
        ],
        'link': [
            'a[data-testid="title-link"]',
            'a[href*="/hotel"]',
            '.hotel-name a',
        ],
        'image': [
            'img[data-testid="image"]',
            '.hotel-image img',
            '[class*="image"] img',
        ],
        'address': [
            '[data-testid="address"]',
            '.address',
            '[class*="address"]',
        ],
        'description': [
            '[data-testid="property-description"]',
            '.description',
            '[class*="description"]',
        ],
    }

    def _try_selectors(self, element, selector_names: List[str]) -> Tuple[bool, any]:
        """尝试多个选择器"""
        for selector_type in selector_names:
            selectors = self.SELECTORS.get(selector_type, [])
            for selector in selectors:
                try:
                    el = element.query_selector(selector)
                    if el:
                        return True, el
                except Exception:
                    continue
        return False, None

    async def search_hotels(self, city: str = "Hangzhou", pages: int = 3) -> List[Dict]:
        """搜索酒店列表"""
        hotels = []
        search_url = f"{self.BASE_URL}/searchresults.html?ss={quote(city)}&checkin=&checkout="

        page = await self.context.new_page()
        try:
            for p in range(pages):
                url = f"{search_url}&offset={p * 25}"
                logger.info(f"[Booking] 正在抓取页面 {p + 1}: {url}")

                # 带重试的请求
                if not await self._retry_request(page, url):
                    logger.warning(f"[Booking] 跳过页面 {p + 1}")
                    continue

                await asyncio.sleep(self.request_delay)

                # 提取酒店数据
                hotel_cards = await page.query_selector_all(self.SELECTORS['card'][0])
                if not hotel_cards:
                    # 尝试备用选择器
                    for selector in self.SELECTORS['card'][1:]:
                        hotel_cards = await page.query_selector_all(selector)
                        if hotel_cards:
                            logger.info(f"[Booking] 使用备用选择器: {selector}")
                            break

                if not hotel_cards:
                    logger.warning(f"[Booking] 页面 {p + 1} 未找到酒店卡片")
                    continue

                logger.info(f"[Booking] 页面 {p + 1} 找到 {len(hotel_cards)} 个酒店")

                for card in hotel_cards:
                    try:
                        hotel = await self._parse_hotel_card(card)
                        if hotel:
                            hotels.append(hotel)
                    except Exception as e:
                        logger.error(f"[Booking] 解析酒店卡片失败: {e}")
                        continue

                await asyncio.sleep(self.request_delay)

        finally:
            await page.close()

        logger.info(f"[Booking] 共抓取 {len(hotels)} 家酒店")
        return hotels

    async def _parse_hotel_card(self, card) -> Optional[Dict]:
        """解析单个酒店卡片"""
        try:
            # 名称
            found, name_el = self._try_selectors(card, ['name'])
            name = await name_el.inner_text() if found else None

            # 评分
            found, rating_el = self._try_selectors(card, ['rating'])
            rating_text = await rating_el.inner_text() if found else "0"
            rating = float(re.search(r'(\d+\.?\d*)', rating_text).group(1)) if rating_text else None

            # 评论数
            found, review_el = self._try_selectors(card, ['review_count'])
            review_text = await review_el.inner_text() if found else "0"
            review_count = int(re.search(r'(\d+)', review_text.replace(',', '')).group(1)) if review_text else 0

            # 价格
            found, price_el = self._try_selectors(card, ['price'])
            price_text = await price_el.inner_text() if found else None
            price = None
            if price_text:
                price_match = re.search(r'(\d+[,\d]*)', price_text.replace(',', ''))
                if price_match:
                    price = int(price_match.group(1).replace(',', ''))

            # 链接
            found, link_el = self._try_selectors(card, ['link'])
            href = await link_el.get_attribute('href') if found else None
            url = urljoin(self.BASE_URL, href) if href else None

            # 图片
            found, img_el = self._try_selectors(card, ['image'])
            image_url = await img_el.get_attribute('src') if found else None

            if name and url:
                return {
                    'name': name.strip(),
                    'booking_rating': rating,
                    'booking_review_count': review_count,
                    'price': price,
                    'booking_url': url,
                    'thumbnail': image_url,
                    'source': 'booking',
                    'scraped_at': datetime.now().isoformat(),
                }
        except Exception as e:
            logger.error(f"[Booking] 解析失败: {e}")

        return None

    async def get_hotel_details(self, url: str) -> Dict:
        """获取酒店详情"""
        page = await self.context.new_page()
        try:
            logger.info(f"[Booking] 获取详情: {url}")

            if not await self._retry_request(page, url):
                return {'source': 'booking', 'url': url, 'error': 'Failed to load page'}

            await asyncio.sleep(self.request_delay * 2)

            details = {'source': 'booking', 'url': url}

            # 地址
            found, addr_el = self._try_selectors(page, ['address'])
            details['address'] = await addr_el.inner_text() if found else None

            # 描述
            found, desc_el = self._try_selectors(page, ['description'])
            details['description'] = await desc_el.inner_text() if found else None

            # 设施 - 使用更通用的选择器
            try:
                facility_els = await page.query_selector_all('[class*="facility"], [class*="amenity"]')
                details['amenities'] = []
                for el in facility_els[:20]:
                    text = await el.inner_text()
                    if text and len(text) < 50:  # 过滤太长的文本
                        details['amenities'].append(text.strip())
            except Exception:
                details['amenities'] = []

            # 图片
            try:
                image_els = await page.query_selector_all('img[src*="max"], img[src*="photo"]')
                details['images'] = []
                for img in image_els[:30]:
                    src = await img.get_attribute('src')
                    if src and 'max' in src:
                        high_res = src.replace('max300', 'max1024')
                        details['images'].append(high_res)
            except Exception:
                details['images'] = []

            return details
        except Exception as e:
            logger.error(f"[Booking] 获取详情失败: {e}")
            return {'source': 'booking', 'url': url, 'error': str(e)}
        finally:
            await page.close()


class CtripScraper(BaseScraper):
    """携程爬虫"""

    BASE_URL = "https://hotels.ctrip.com"

    # 备用选择器
    SELECTORS = {
        'card': [
            '.hotel-item',
            '[class*="hotel-item"]',
            '.hotel_list_item',
        ],
        'name': [
            '.hotel-name',
            '[class*="hotel-name"]',
            'h3',
            '.name',
        ],
        'rating': [
            '.score',
            '[class*="score"]',
            '.rating',
        ],
        'review_count': [
            '.comment-count',
            '[class*="comment"]',
            '.reviews',
        ],
        'price': [
            '.price',
            '[class*="price"]',
            '.hotel-price',
        ],
    }

    def _try_selectors(self, element, selector_names: List[str]) -> Tuple[bool, any]:
        """尝试多个选择器"""
        for selector_type in selector_names:
            selectors = self.SELECTORS.get(selector_type, [])
            for selector in selectors:
                try:
                    el = element.query_selector(selector)
                    if el:
                        return True, el
                except Exception:
                    continue
        return False, None

    async def search_hotels(self, city: str = "杭州", pages: int = 3) -> List[Dict]:
        """搜索酒店列表"""
        hotels = []
        search_url = f"{self.BASE_URL}/hotels/listPage?city=17&checkIn=&checkOut="

        page = await self.context.new_page()
        try:
            for p in range(pages):
                logger.info(f"[Ctrip] 正在抓取页面 {p + 1}")

                if not await self._retry_request(page, search_url):
                    logger.warning(f"[Ctrip] 跳过页面 {p + 1}")
                    continue

                await asyncio.sleep(self.request_delay * 2)

                # 滚动加载
                for _ in range(3):
                    await page.evaluate('window.scrollBy(0, 800)')
                    await asyncio.sleep(0.5)

                # 提取酒店数据
                hotel_cards = await page.query_selector_all(self.SELECTORS['card'][0])
                if not hotel_cards:
                    for selector in self.SELECTORS['card'][1:]:
                        hotel_cards = await page.query_selector_all(selector)
                        if hotel_cards:
                            logger.info(f"[Ctrip] 使用备用选择器: {selector}")
                            break

                if not hotel_cards:
                    logger.warning(f"[Ctrip] 页面 {p + 1} 未找到酒店卡片")
                    continue

                logger.info(f"[Ctrip] 页面 {p + 1} 找到 {len(hotel_cards)} 个酒店")

                for card in hotel_cards:
                    try:
                        hotel = await self._parse_hotel_card(card)
                        if hotel:
                            hotels.append(hotel)
                    except Exception as e:
                        logger.error(f"[Ctrip] 解析酒店卡片失败: {e}")
                        continue

                # 点击下一页
                try:
                    next_btn = await page.query_selector('.next, .next-page, [class*="next"]')
                    if next_btn:
                        await next_btn.click()
                        await asyncio.sleep(self.request_delay * 2)
                    else:
                        break
                except Exception:
                    break

        finally:
            await page.close()

        logger.info(f"[Ctrip] 共抓取 {len(hotels)} 家酒店")
        return hotels

    async def _parse_hotel_card(self, card) -> Optional[Dict]:
        """解析单个酒店卡片"""
        try:
            # 名称
            found, name_el = self._try_selectors(card, ['name'])
            name = await name_el.inner_text() if found else None

            # 评分
            found, rating_el = self._try_selectors(card, ['rating'])
            rating_text = await rating_el.inner_text() if found else "0"
            rating = float(rating_text) if rating_text and rating_text.replace('.', '').isdigit() else None

            # 评论数
            found, review_el = self._try_selectors(card, ['review_count'])
            review_text = await review_el.inner_text() if found else "0"
            review_count = int(re.search(r'(\d+)', review_text).group(1)) if review_text else 0

            # 价格
            found, price_el = self._try_selectors(card, ['price'])
            price_text = await price_el.inner_text() if found else None
            price = int(re.search(r'(\d+)', price_text).group(1)) if price_text else None

            # 链接
            try:
                link_el = await card.query_selector('a[href*="/hotel"]')
                href = await link_el.get_attribute('href') if link_el else None
            except Exception:
                href = None

            if name and href:
                return {
                    'name': name.strip(),
                    'ctrip_rating': rating,
                    'ctrip_review_count': review_count,
                    'price': price,
                    'ctrip_url': urljoin(self.BASE_URL, href),
                    'source': 'ctrip',
                    'scraped_at': datetime.now().isoformat(),
                }
        except Exception as e:
            logger.error(f"[Ctrip] 解析失败: {e}")

        return None

    async def get_official_photos(self, url: str) -> List[Dict]:
        """获取携程官方照片"""
        page = await self.context.new_page()
        photos = []

        try:
            logger.info(f"[Ctrip] 获取官方照片: {url}")

            if not await self._retry_request(page, url):
                return []

            await asyncio.sleep(self.request_delay * 2)

            # 尝试点击相册按钮
            try:
                gallery_btn = await page.query_selector('.hotel-pic-gallery, [class*="gallery"]')
                if gallery_btn:
                    await gallery_btn.click()
                    await asyncio.sleep(2)
            except Exception:
                pass

            # 获取图片
            try:
                image_els = await page.query_selector_all('img[src*="ctrip"], img[src*="pic"]')
                for idx, img in enumerate(image_els[:50]):
                    src = await img.get_attribute('src')
                    if src:
                        photos.append({
                            'url': src,
                            'caption': '',
                            'order': idx,
                            'is_official': True,
                            'source': 'ctrip'
                        })
            except Exception as e:
                logger.warning(f"[Ctrip] 获取图片失败: {e}")

            logger.info(f"[Ctrip] 获取 {len(photos)} 张照片")

        except Exception as e:
            logger.error(f"[Ctrip] 获取照片失败: {e}")
        finally:
            await page.close()

        return photos


async def main():
    """主函数"""
    logger.info("=" * 50)
    logger.info("LocalPup 爬虫系统启动")
    logger.info("=" * 50)

    # 确保输出目录存在
    os.makedirs('data', exist_ok=True)
    os.makedirs('logs', exist_ok=True)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Booking 爬虫
    booking = BookingScraper(max_retries=3, request_delay=2.0)
    await booking.init_browser()

    try:
        booking_hotels = await booking.search_hotels(city="Hangzhou", pages=2)

        # 保存结果
        with open(f'data/booking_hotels_{timestamp}.json', 'w', encoding='utf-8') as f:
            json.dump(booking_hotels, f, ensure_ascii=False, indent=2)

        logger.info(f"[主程序] Booking 数据已保存: {len(booking_hotels)} 家酒店")

        # 获取前3家酒店的详情
        for hotel in booking_hotels[:3]:
            if hotel.get('booking_url'):
                details = await booking.get_hotel_details(hotel['booking_url'])
                hotel.update(details)
                await asyncio.sleep(2)

    except Exception as e:
        logger.error(f"[Booking] 爬取过程出错: {e}")
    finally:
        await booking.close()

    # 携程爬虫
    ctrip = CtripScraper(max_retries=3, request_delay=2.0)
    await ctrip.init_browser()

    try:
        ctrip_hotels = await ctrip.search_hotels(city="杭州", pages=2)

        with open(f'data/ctrip_hotels_{timestamp}.json', 'w', encoding='utf-8') as f:
            json.dump(ctrip_hotels, f, ensure_ascii=False, indent=2)

        logger.info(f"[主程序] 携程数据已保存: {len(ctrip_hotels)} 家酒店")

    except Exception as e:
        logger.error(f"[Ctrip] 爬取过程出错: {e}")
    finally:
        await ctrip.close()

    # 合并结果
    try:
        all_hotels = booking_hotels + ctrip_hotels
        with open('data/all_hotels.json', 'w', encoding='utf-8') as f:
            json.dump(all_hotels, f, ensure_ascii=False, indent=2)
        logger.info(f"[主程序] 合并数据已保存: {len(all_hotels)} 家酒店")
    except Exception:
        pass

    logger.info("=" * 50)
    logger.info("爬虫任务完成")
    logger.info("=" * 50)


if __name__ == '__main__':
    asyncio.run(main())
