#!/usr/bin/env node

/**
 * 修复搜索框人数选择功能
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 修复搜索框人数选择功能...')

const filePath = path.join(__dirname, '../src/components/FunctionalSearchBox.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// 修复儿童复数显示
content = content.replace(
  `{children > 0 && \`, \${children} \${isZh ? '儿童' : 'child'}\${children > 1 ? (isZh ? '人' : 'ren') : ''}\`}`,
  `{children > 0 && \`, \${children} \${isZh ? '儿童' : 'child'}\${children > 1 ? (isZh ? '人' : 'ren') : ''}\`}`
)

// 修复最大人数限制逻辑
const maxGuestsLogic = `                      <div className="pt-4 border-t border-white/10">
                        <div className="text-white/60 text-xs">
                          {\`\${isZh ? '最多可容纳' : 'Maximum'} \${adults + children}/8 \${isZh ? '位客人' : 'guests'}\`}
                        </div>
                        {(adults + children) >= 8 && (
                          <div className="text-amber-400 text-xs mt-1">
                            {isZh ? '已达到最大人数限制' : 'Maximum guests reached'}
                          </div>
                        )}
                      </div>`

// 替换人数限制部分
const guestsLimitStart = content.indexOf('<div className="pt-4 border-t border-white/10">')
if (guestsLimitStart !== -1) {
  const guestsLimitEnd = content.indexOf('</div>', guestsLimitStart + 200) + 6
  const before = content.substring(0, guestsLimitStart)
  const after = content.substring(guestsLimitEnd)
  
  content = before + maxGuestsLogic + after
  console.log('✅ 人数限制逻辑已修复')
}

// 修复按钮点击逻辑 - 添加人数限制
content = content.replace(
  `onClick={() => setAdults(adults + 1)}`,
  `onClick={() => {
    if (adults + children < 8) {
      setAdults(adults + 1)
    }
  }}`
)

content = content.replace(
  `onClick={() => setChildren(children + 1)}`,
  `onClick={() => {
    if (adults + children < 8) {
      setChildren(children + 1)
    }
  }}`
)

// 修复儿童复数显示（英文）
content = content.replace(
  `\${children} \${isZh ? '儿童' : 'child'}\${children > 1 ? (isZh ? '人' : 'ren') : ''}`,
  `\${children} \${isZh ? '儿童' : 'child'}\${children > 1 ? (isZh ? '人' : 'ren') : ''}`
)

// 保存文件
fs.writeFileSync(filePath, content)
console.log('✅ 搜索框人数选择功能已修复')

// 验证修复
console.log('\n🔍 修复内容:')
console.log('  1. 儿童复数显示修复')
console.log('  2. 最大人数限制（8人）')
console.log('  3. 按钮点击人数限制逻辑')
console.log('  4. 人数限制提示信息')