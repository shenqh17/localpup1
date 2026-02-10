#!/bin/bash
# AI Agent 每日新闻推送定时任务脚本
# 
# 安装方法:
# 1. 复制此脚本到 /Users/mac/.openclaw/workspace/
# 2. 添加到 crontab: crontab -e
# 3. 添加行: 0 2 * * * /Users/mac/.openclaw/workspace/daily_news_cron.sh

WORKSPACE="/Users/mac/.openclaw/workspace"
LOG_FILE="$WORKSPACE/logs/daily_news.log"
DATE=$(date +%Y-%m-%d)

# 创建日志目录
mkdir -p "$WORKSPACE/logs"

echo "[$DATE $(date +%H:%M:%S)] 开始每日新闻推送任务" >> "$LOG_FILE"

# 1. 生成今日新闻
cd "$WORKSPACE"
echo "[$DATE $(date +%H:%M:%S)] 生成新闻汇总..." >> "$LOG_FILE"

# 这里会调用 Agent 生成新闻
# 实际使用时通过 OpenClaw 触发

# 2. 推送到 vivo 笔记
echo "[$DATE $(date +%H:%M:%S)] 准备 vivo 推送..." >> "$LOG_FILE"
python3 "$WORKSPACE/push_to_vivo_notes.py" >> "$LOG_FILE" 2>&1

# 3. 发送通知（可选）
# osascript -e 'display notification "AI Agent 新闻已更新" with title "每日推送"'

echo "[$DATE $(date +%H:%M:%S)] 任务完成" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
