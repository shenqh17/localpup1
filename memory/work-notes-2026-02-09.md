# OpenClaw 工作问题记录

## 日期：2026-02-09
## 项目：LocalPup 旅游网站改造

---

## 问题 1：Next.js 国际化配置错误

**现象：**
```
Error: Couldn't find next-intl config file. 
Please follow the instructions at https://next-intl.dev/docs/getting-started/app-router
```

**原因：**
- 安装了 next-intl v4.x 版本，但 Next.js 14.1.0 不完全兼容
- 缺少必要的配置文件（middleware.ts, i18n.ts, next-intl.config.js）
- 版本兼容性问题

**解决方案：**
1. 降级到 next-intl v3.5.0：`npm install next-intl@3.5.0 --save`
2. 或者**更简单的方法**：不使用 next-intl，改用自定义 React Context 实现国际化
3. 创建自定义 I18nProvider：
   ```tsx
   // src/lib/i18n-context.tsx
   const translations = { en: {...}, zh: {...} }
   export function I18nProvider({ children }) {
     const [locale, setLocale] = useState('en')
     const t = (key) => translations[locale][key] || key
     return <I18nContext.Provider value={{ locale, setLocale, t }}>
       {children}
     </I18nContext.Provider>
   }
   ```

**经验教训：**
- next-intl 配置复杂，与 Next.js 版本紧密相关
- 简单的国际化需求，用 Context + 翻译对象更稳定
- 使用外部库前，先检查版本兼容性

---

## 问题 2：国际化组件遗漏

**现象：**
- 只有部分组件实现了国际化切换
- Newsletter、CityGuide 等组件文字没有翻译

**原因：**
- 一开始只修改了 Header、Features 等少数组件
- 没有全局搜索所有硬编码文字
- 遗漏了部分组件

**解决方案：**
1. 创建完整的翻译文件，包含所有 key：
   - nav.home, nav.hotels, nav.attractions...
   - hero.title1, hero.subtitle...
   - hotels.title, hotels.perNight...
   - footer.description...
2. 逐个组件替换硬编码文字为 `t('key')`
3. 检查所有页面和组件

**经验教训：**
- 国际化要一次性完成，不要分批
- 先列出所有需要翻译的文字，再统一实现
- 使用脚本检查遗漏的硬编码字符串

---

## 问题 3：Unsplash 图片 404

**现象：**
```
⨯ upstream image response failed for https://images.unsplash.com/...
```

**原因：**
- Unsplash 图片链接不稳定
- 某些图片 ID 失效或被删除
- 网络访问问题

**解决方案：**
1. 更换为可靠的图片源：
   - 使用稳定的 placeholder 图片
   - 或者上传到自有 CDN
   - 使用 picsum.photos 等可靠服务
2. 添加 fallback 图片处理
3. 使用 Next.js Image 组件的 `onError` 处理图片加载失败

**经验教训：**
- 不要依赖外部图片链接，尤其是演示/生产环境
- 准备备用图片方案
- 图片资源应该可控（自托管或可靠 CDN）

---

## 问题 4：端口被占用导致服务启动失败

**现象：**
```
⚠ Port 3000 is in use by an unknown process
```

**原因：**
- 之前的 Next.js 进程没有正确结束
- 僵尸进程占用端口
- 多个实例同时运行

**解决方案：**
```bash
# 杀死所有 Next.js 进程
pkill -f "next dev"
sleep 2

# 或者找到并杀死特定进程
lsof -ti:3000 | xargs kill -9
```

**经验教训：**
- 重启服务前先清理旧进程
- 使用 `npm run dev` 时注意观察端口占用提示
- 保持进程管理整洁

---

## 问题 5：依赖冲突和版本不兼容

**现象：**
- 安装 next-intl 后出现各种错误
- TypeScript 类型错误
- 编译失败

**原因：**
- next-intl v4.x 需要 Next.js 14.2+
- 当前项目使用 Next.js 14.1.0
- 依赖版本不匹配

**解决方案：**
1. 检查 package.json 确认版本兼容性
2. 降级库版本：`npm install next-intl@3.5.0 --save`
3. 或者升级 Next.js：`npm install next@latest --save`

**经验教训：**
- 添加新依赖前检查版本要求
- 使用 `npm ls <package>` 查看依赖树
- 优先使用项目已有依赖的兼容版本

---

## 问题 6：子代理超时导致任务未完成

**现象：**
- sessions_spawn 启动的子代理在 30 分钟后超时
- 部分文件没有正确生成
- 任务被中断

**原因：**
- 任务复杂，30 分钟不足以完成
- 子代理没有返回进度信息
- 主代理无法监控子代理状态

**解决方案：**
1. 将大任务拆分成小任务
2. 增加 runTimeoutSeconds 参数：`runTimeoutSeconds: 1800`
3. 或者不使用子代理，直接在当前会话执行
4. 定期检查子代理进度：`sessions_history`

**经验教训：**
- 复杂任务不要一次性丢给子代理
- 拆分成可验证的小步骤
- 复杂任务直接在当前会话执行更可控

---

## 通用工作流程改进

### 修改前：
1. 直接开始修改代码 ❌
2. 遇到问题再修复 ❌
3. 不记录问题和解决方案 ❌

### 修改后：
1. 先分析现有代码结构 ✅
2. 列出需要修改的所有文件 ✅
3. 在简单环境测试方案 ✅
4. 应用到项目 ✅
5. 验证修改结果 ✅
6. **记录问题和解决方案** ✅

### 检查清单：
- [ ] 依赖版本兼容性检查
- [ ] 所有组件国际化覆盖
- [ ] 图片资源可用性检查
- [ ] 服务启动前清理旧进程
- [ ] 修改后验证所有页面

---

## 技术栈最佳实践

### 模型使用规则（2026-02-09 更新）
- **所有任务**：默认使用 minimax/MiniMax-M2.1
- **编程任务**：同样使用 Minimax，不再自动切换 Kimi
- **例外情况**：仅当 Minimax 免费额度用尽时才使用备用模型
- **成本控制**：每日 API 费用控制在最低水平

### Next.js + 国际化：
- **推荐**：自定义 Context 方案（简单稳定）
- **不推荐**：next-intl（版本兼容性复杂）

### 图片处理：
- **生产**：使用自托管 CDN 或可靠的图片服务
- **开发**：本地图片或 picsum.photos
- **避免**：直接使用 Unsplash 随机链接

### 进程管理：
- 启动新服务前先 `pkill -f "next dev"`
- 使用 `lsof -i :3000` 检查端口占用
- 保持终端输出可见，便于调试

---

_记录时间：2026-02-09_
_记录者：贾维斯_
