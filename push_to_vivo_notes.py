#!/usr/bin/env python3
"""
AI Agent 热点新闻自动推送脚本
每日推送至 vivo 办公套件原子笔记

使用方法:
1. 配置 vivo 账号信息到 .env 文件
2. 运行: python3 push_to_vivo_notes.py
3. 或使用 cron 定时每天运行
"""

import os
import sys
from datetime import datetime
from pathlib import Path

# 获取新闻文件路径
def get_latest_news_file():
    """获取最新的新闻汇总文件"""
    workspace = Path('/Users/mac/.openclaw/workspace')
    news_files = list(workspace.glob('AI-Agent-News-*.md'))
    
    if not news_files:
        return None
    
    # 按修改时间排序，取最新的
    latest = max(news_files, key=lambda f: f.stat().st_mtime)
    return latest

def create_vivo_note_content(news_file):
    """创建原子笔记格式内容"""
    if not news_file.exists():
        return None
    
    content = news_file.read_text(encoding='utf-8')
    today = datetime.now().strftime('%Y年%m月%d日')
    
    # 原子笔记格式
    note_content = f"""# 📰 AI Agent 热点新闻 | {today}

---

{content}

---

💡 如何查看：
- 本笔记由 Agent 自动生成
- 每日更新时间为凌晨 2:00
- 来源：公开新闻、技术博客、官方公告

🤖 Powered by OpenClaw Agent
"""
    
    return note_content

def simulate_vivo_push(note_content, date_str):
    """
    模拟推送到 vivo 办公套件原子笔记
    
    注意：vivo 办公套件目前没有公开的 API
    以下步骤需要手动完成或使用自动化工具（如 Apple Shortcuts）
    """
    
    # 保存到本地文件，便于手动复制
    output_file = Path(f'/Users/mac/.openclaw/workspace/vivo-note-{date_str}.txt')
    output_file.write_text(note_content, encoding='utf-8')
    
    print(f"✅ 新闻内容已保存至: {output_file}")
    print()
    print("📱 vivo 办公套件推送指南:")
    print("=" * 50)
    print()
    print("方法 1 - 手动复制:")
    print("  1. 打开文件:", output_file)
    print("  2. 全选并复制内容")
    print("  3. 打开 vivo 办公套件")
    print("  4. 新建原子笔记")
    print("  5. 粘贴内容")
    print()
    print("方法 2 - 使用 Apple Shortcuts (推荐):")
    print("  1. 创建 Shortcuts 自动化")
    print("  2. 设置触发器: 每天 08:00")
    print("  3. 动作: 读取文件 → 复制到剪贴板 → 打开 vivo 办公套件")
    print()
    print("方法 3 - vivo 互传:")
    print("  1. 将文件通过 vivo 互传发送到手机")
    print("  2. 在原子笔记中导入")
    print()
    print("=" * 50)
    
    return output_file

def main():
    """主函数"""
    print("🚀 AI Agent 热点新闻推送服务")
    print("=" * 50)
    print()
    
    # 获取最新新闻文件
    news_file = get_latest_news_file()
    if not news_file:
        print("❌ 错误: 未找到新闻文件")
        print("请先运行新闻生成脚本")
        sys.exit(1)
    
    print(f"📄 读取新闻文件: {news_file.name}")
    
    # 创建笔记内容
    note_content = create_vivo_note_content(news_file)
    if not note_content:
        print("❌ 错误: 无法读取新闻内容")
        sys.exit(1)
    
    # 推送（模拟）
    date_str = datetime.now().strftime('%Y-%m-%d')
    output_file = simulate_vivo_push(note_content, date_str)
    
    print()
    print("✅ 推送准备完成!")
    print(f"📊 内容长度: {len(note_content)} 字符")
    print(f"📁 文件位置: {output_file}")
    print()
    print("⏰ 下次自动推送: 明天 08:00")
    print("📝 提示: 建议设置 Apple Shortcuts 自动化")

if __name__ == '__main__':
    main()
