#!/bin/bash

echo "🚀 开始监控LocalPup部署状态"
echo "部署时间: $(date)"
echo "=" .repeat(50)

# 初始检查
echo "📊 初始状态检查:"
INITIAL_COUNT=$(curl -s "https://www.localpup.online/hotels" 2>/dev/null | grep -o "Discover [0-9]* handpicked hotels" | grep -o "[0-9]*")
echo "  当前显示酒店数量: ${INITIAL_COUNT:-未知}"

echo -e "\n⏳ 开始监控部署进度（每30秒检查一次）..."
echo "预计完成时间: $(date -v+8M '+%H:%M:%S')"
echo "按 Ctrl+C 停止监控"

# 监控循环
for i in {1..16}; do  # 最多监控8分钟（16*30秒）
    echo -e "\n--- 检查 #$i ($(date '+%H:%M:%S')) ---"
    
    # 检查酒店页面
    HOTEL_COUNT=$(curl -s "https://www.localpup.online/hotels" 2>/dev/null | grep -o "Discover [0-9]* handpicked hotels" | grep -o "[0-9]*")
    
    if [[ -n "$HOTEL_COUNT" ]]; then
        echo "  酒店页面: Discover $HOTEL_COUNT handpicked hotels"
        
        if [[ "$HOTEL_COUNT" -eq 100 ]]; then
            echo "  🎉 部署成功！网站显示100家酒店"
            echo "  ✅ 部署完成时间: $(date)"
            exit 0
        elif [[ "$HOTEL_COUNT" -ne "${INITIAL_COUNT:-0}" ]]; then
            echo "  🔄 酒店数量已更新: ${INITIAL_COUNT:-未知} → $HOTEL_COUNT"
            INITIAL_COUNT=$HOTEL_COUNT
        fi
    else
        echo "  酒店页面: 无法获取数量"
    fi
    
    # 检查测试页面
    TEST_PAGE=$(curl -s "https://www.localpup.online/test-hotels" 2>/dev/null)
    if [[ -n "$TEST_PAGE" ]]; then
        TEST_COUNT=$(echo "$TEST_PAGE" | grep -o "总酒店数量.*[0-9]*" | grep -o "[0-9]*")
        if [[ -n "$TEST_COUNT" ]]; then
            echo "  测试页面: 总酒店数量 $TEST_COUNT"
        else
            echo "  测试页面: 可访问但未找到数量统计"
        fi
    else
        echo "  测试页面: 无法访问"
    fi
    
    # 检查HTTP状态
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://www.localpup.online")
    echo "  HTTP状态码: $HTTP_STATUS"
    
    # 进度指示
    if [[ $i -lt 8 ]]; then
        echo "  预计剩余时间: $((8 - i/2)) 分钟"
    elif [[ $i -lt 12 ]]; then
        echo "  预计剩余时间: $((4 - (i-8)/2)) 分钟"
    else
        echo "  部署可能已完成或遇到问题"
    fi
    
    # 等待30秒
    sleep 30
done

echo -e "\n⏰ 监控超时（8分钟）"
echo "可能情况:"
echo "1. Vercel部署仍在进行中"
echo "2. 部署遇到问题"
echo "3. CDN缓存延迟"
echo ""
echo "🔧 建议操作:"
echo "1. 登录Vercel检查部署状态"
echo "2. 强制刷新浏览器: Cmd+Shift+R"
echo "3. 清除浏览器缓存"
echo "4. 等待几分钟后重试"

exit 1