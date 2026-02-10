# vivo 办公套件原子笔记推送配置指南

## 目标
每日自动将 AI Agent 热点新闻推送到 vivo 办公套件的原子笔记中

---

## 方案一：Apple Shortcuts 自动化（推荐）

### 步骤 1: 创建 Shortcut

1. 打开 iPhone **快捷指令** App
2. 点击右上角 **+** 创建新快捷指令
3. 命名: "每日 AI 新闻推送"

### 步骤 2: 配置动作

**动作 1: 获取文件**
```
动作: 获取文件
路径: iCloud Drive/OpenClaw/workspace/vivo-note-当前日期.txt
```

**动作 2: 复制到剪贴板**
```
动作: 拷贝至剪贴板
输入: 上一个动作的结果
```

**动作 3: 打开 vivo 办公套件**
```
动作: 打开 App
App: vivo 办公套件
```

**动作 4: 显示提醒**
```
动作: 显示提醒
标题: "新闻已就绪"
内容: "请在原子笔记中新建笔记并粘贴内容"
```

### 步骤 3: 设置自动化

1. 点击底部 **自动化** 标签
2. 选择 **创建个人自动化**
3. 选择 **特定时间**
   - 时间: 08:00
   - 重复: 每天
4. 选择刚才创建的 Shortcut
5. 关闭 **运行前询问**

---

## 方案二：Mac 自动复制

### 步骤 1: 创建自动复制脚本

```bash
# 创建脚本文件
nano ~/daily_copy.sh
```

```bash
#!/bin/bash
# daily_copy.sh

FILE="/Users/mac/.openclaw/workspace/vivo-note-$(date +%Y-%m-%d).txt"

if [ -f "$FILE" ]; then
    # 复制到剪贴板
    cat "$FILE" | pbcopy
    
    # 打开 vivo 办公套件
    open -a "vivo办公套件"
    
    # 显示通知
    osascript -e 'display notification "AI Agent 新闻已复制到剪贴板" with title "每日推送"'
else
    osascript -e 'display notification "新闻文件不存在" with title "错误"'
fi
```

### 步骤 2: 设置定时任务

```bash
# 编辑 crontab
crontab -e

# 添加行（每天早上 8 点运行）
0 8 * * * /bin/bash /Users/mac/daily_copy.sh
```

---

## 方案三：vivo 互传（手动）

### 步骤 1: 在 Mac 上准备文件

新闻文件位置:
```
/Users/mac/.openclaw/workspace/vivo-note-YYYY-MM-DD.txt
```

### 步骤 2: 使用 vivo 互传

1. Mac 打开浏览器访问: https://pc.vivo.com
2. 手机打开 vivo 互传 App
3. 扫码连接
4. 拖拽文件传输
5. 手机上在原子笔记中导入文件

---

## 自动化配置

### OpenClaw Cron 设置

```bash
# 添加每日任务（凌晨 2:00 生成新闻）
openclaw cron add \
  --name "daily-ai-news" \
  --schedule "0 2 * * *" \
  --command "generate-ai-news"
```

### 本地 Cron 设置

```bash
# 编辑 crontab
crontab -e

# 添加以下行
# 生成新闻（每天凌晨 2:00）
0 2 * * * cd /Users/mac/.openclaw/workspace && python3 generate_news.py

# 推送准备（每天上午 8:00）
0 8 * * * cd /Users/mac/.openclaw/workspace && python3 push_to_vivo_notes.py
```

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `AI-Agent-News-YYYY-MM-DD.md` | 原始新闻 Markdown |
| `vivo-note-YYYY-MM-DD.txt` | vivo 笔记格式 |
| `push_to_vivo_notes.py` | 推送脚本 |
| `daily_news_cron.sh` | 定时任务脚本 |

---

## 故障排查

### 问题 1: 文件未生成

**检查**:
```bash
ls -la /Users/mac/.openclaw/workspace/*.md
```

**解决**: 手动运行新闻生成

### 问题 2: Shortcuts 无法找到文件

**检查**: iCloud 同步状态

**解决**: 
1. 确保文件在 iCloud Drive
2. 使用绝对路径

### 问题 3: vivo 办公套件未打开

**检查**: App 是否安装

**解决**: 从 App Store 安装 vivo 办公套件

---

## 最佳实践

1. **每日检查**: 第一周每天检查是否正常推送
2. **备份策略**: 保留 7 天历史新闻文件
3. **格式优化**: 根据阅读习惯调整模板
4. **反馈收集**: 根据 Mr.shen 反馈改进内容

---

## 技术支持

如有问题，请检查:
1. 文件路径是否正确
2. 权限是否足够
3. vivo 办公套件是否最新版本
4. iCloud 同步是否正常

---

*配置完成时间: 2026-02-09 02:17 AM*  
*配置版本: v1.0*
