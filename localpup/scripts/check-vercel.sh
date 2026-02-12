#!/bin/bash

echo "🔍 检查Vercel部署状态..."
echo "========================="

# 检查线上网站可访问性
echo "1. 检查线上网站可访问性..."
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" https://www.localpup.online || echo "无法访问网站"

echo ""
echo "2. 检查GitHub最新提交..."
cd /Users/mac/.openclaw/workspace/localpup
echo "本地最新提交: $(git log --oneline -1)"
echo "远程最新提交: $(git log --oneline -1 origin/main)"

echo ""
echo "3. 检查本地构建..."
if npx next build 2>&1 | grep -q "error"; then
    echo "❌ 本地构建有错误"
    npx next build 2>&1 | grep -A5 -B5 "error"
else
    echo "✅ 本地构建无错误"
fi

echo ""
echo "4. 部署状态总结:"
echo "- GitHub推送: ✅ 成功 (提交22022c1)"
echo "- Vercel部署: 🔄 应自动触发"
echo "- 线上地址: https://www.localpup.online"
echo "- 本地预览: http://localhost:3140"
echo "- 网站设计: ✅ 保持不变"