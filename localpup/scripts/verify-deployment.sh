#!/bin/bash

echo "🔍 验证LocalPup部署状态"
echo "=========================="

# 检查网站可访问性
echo "1. 检查网站可访问性:"
curl -s -o /dev/null -w "%{http_code}" https://www.localpup.online
echo " - HTTP状态码"

# 检查测试页面
echo -e "\n2. 检查测试页面:"
TEST_PAGE=$(curl -s https://www.localpup.online/test-hotels 2>/dev/null)
if [[ -n "$TEST_PAGE" ]]; then
    echo "✅ 测试页面可访问"
    # 提取酒店数量
    HOTEL_COUNT=$(echo "$TEST_PAGE" | grep -o "总酒店数量.*[0-9]*" | grep -o "[0-9]*")
    if [[ -n "$HOTEL_COUNT" ]]; then
        echo "   显示酒店数量: $HOTEL_COUNT"
    else
        echo "⚠️  未找到酒店数量统计"
    fi
else
    echo "❌ 测试页面无法访问"
fi

# 检查主酒店页面
echo -e "\n3. 检查酒店页面:"
HOTELS_PAGE=$(curl -s https://www.localpup.online/hotels 2>/dev/null)
if [[ -n "$HOTELS_PAGE" ]]; then
    echo "✅ 酒店页面可访问"
    # 提取"Discover X handpicked hotels"
    DISCOVER_TEXT=$(echo "$HOTELS_PAGE" | grep -o "Discover [0-9]* handpicked hotels")
    if [[ -n "$DISCOVER_TEXT" ]]; then
        echo "   $DISCOVER_TEXT"
    else
        echo "⚠️  未找到酒店数量文本"
    fi
else
    echo "❌ 酒店页面无法访问"
fi

# 检查构建版本
echo -e "\n4. 检查构建版本:"
BUILD_INFO=$(curl -s https://www.localpup.online | grep -o '"buildId":"[^"]*"' | head -1)
if [[ -n "$BUILD_INFO" ]]; then
    echo "✅ 找到构建ID: $BUILD_INFO"
else
    echo "⚠️  未找到构建ID"
fi

# 检查重定向
echo -e "\n5. 检查重定向:"
REDIRECT=$(curl -I https://localpup.online 2>/dev/null | grep -i "location")
if [[ -n "$REDIRECT" ]]; then
    echo "✅ 重定向配置正常"
    echo "   $REDIRECT"
else
    echo "⚠️  无重定向配置"
fi

echo -e "\n📊 部署状态总结:"
echo "=================="

if [[ -n "$HOTEL_COUNT" ]] && [[ "$HOTEL_COUNT" -eq 100 ]]; then
    echo "🎉 完美！网站显示100家酒店"
elif [[ -n "$HOTEL_COUNT" ]] && [[ "$HOTEL_COUNT" -eq 15 ]]; then
    echo "❌ 问题：网站仍然显示15家酒店"
    echo "   可能原因："
    echo "   1. Vercel部署了旧版本"
    echo "   2. 浏览器/CDN缓存"
    echo "   3. 构建失败"
elif [[ -z "$HOTEL_COUNT" ]]; then
    echo "⚠️  无法确定酒店数量"
    echo "   可能原因："
    echo "   1. 测试页面未部署"
    echo "   2. 构建错误"
    echo "   3. 页面访问问题"
fi

echo -e "\n🔧 修复建议:"
echo "1. 登录Vercel，重新部署项目"
echo "2. 清除Vercel缓存：Settings → Build & Development → Clear Build Cache"
echo "3. 检查构建日志中的错误"
echo "4. 强制刷新浏览器：Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)"
echo "5. 清除浏览器缓存"

exit 0