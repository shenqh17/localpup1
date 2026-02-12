#!/bin/bash

echo "🔄 LocalPup持续部署监控"
echo "========================"

MAX_ATTEMPTS=10
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo ""
    echo "尝试 $ATTEMPT/$MAX_ATTEMPTS..."
    
    # 1. 检查Git状态
    cd /Users/mac/.openclaw/workspace/localpup
    LOCAL_COMMIT=$(git log --oneline -1 --format="%H")
    REMOTE_COMMIT=$(git log --oneline -1 origin/main --format="%H" 2>/dev/null || echo "未知")
    
    if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
        echo "🔁 需要推送本地提交..."
        git push origin main
        echo "✅ 已推送提交: ${LOCAL_COMMIT:0:7}"
    else
        echo "✅ Git同步完成"
    fi
    
    # 2. 检查线上网站
    echo "检查线上网站..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.localpup.online 2>/dev/null || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "🎉 部署成功！网站可正常访问 (HTTP $HTTP_STATUS)"
        echo "线上地址: https://www.localpup.online"
        echo "最新提交: $(git log --oneline -1 --format="%s")"
        exit 0
    else
        echo "⚠️  网站访问异常 (HTTP $HTTP_STATUS)，等待重试..."
    fi
    
    # 等待30秒后重试
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "等待30秒..."
        sleep 30
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

echo "❌ 达到最大重试次数，部署可能仍在进行中"
echo "请手动检查: https://www.localpup.online"
echo "或查看Vercel控制台"