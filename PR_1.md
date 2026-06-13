# PR 描述：本地模式添加翻译和关键词提取功能

## 标题
feat(local): 本地模式添加翻译和关键词提取功能

---

## 功能描述

本 PR 为本地绘图模式增强了指令解析能力：

1. **翻译功能**：将中文语音指令翻译为英文提示词
2. **关键词提取**：从语音指令中提取动词、图形、颜色等关键词
3. **增强日志显示**：在指令日志中显示翻译结果和提取的关键词
4. **支持更多图形**：扩展了图形同义词和翻译字典

---

## 功能详情

### 1. 翻译功能

新增 `translateText()` 函数，支持将中文指令翻译为英文：

| 输入 | 输出示例 |
|------|---------|
| "画一个红色的圆" | "draw a red circle" |
| "画一只可爱的猫" | "draw a cute cat" |
| "画美丽的风景" | "draw beautiful landscape" |

### 2. 关键词提取

新增 `extractKeywords()` 函数，从语音指令中分离不同类型的关键词：

```javascript
// 输入："画一个带笑脸的黄色太阳"
// 输出：
{
    verbs: ['画', '一个'],      // 动词
    shapes: ['笑脸', '太阳'],    // 图形
    colors: ['黄色'],            // 颜色
    adjectives: []               // 形容词
}
```

### 3. 翻译字典

新增 `TRANSLATION_DICT` 字典，包含以下类别：

| 类别 | 词汇示例 |
|------|---------|
| 动词 | 画、绘制、画一个、画点 |
| 量词 | 一个、一只、一张、一些 |
| 形容词 | 可爱的、美丽的、神秘的 |
| 图形名词 | 圆、矩形、三角形、星星、心形、太阳、月亮 |
| 动物名词 | 猫、狗、鸟、鱼、蝴蝶、龙、独角兽 |
| 自然名词 | 花、山、海、天空、云 |
| 人造物 | 汽车、飞机、船、城堡、机器人 |
| 颜色 | 红色、蓝色、绿色、黄色、紫色 |
| 表情 | 笑脸、哭脸、微笑、开心 |

### 4. 指令日志增强

处理语音指令时，会在日志中显示：
- 原文
- 翻译结果
- 提取的动词
- 提取的图形
- 提取的颜色

---

## 实现思路

### 核心修改点

1. **新增翻译字典**（[voicecanvas-ai.html#L336-391](file:///C:/Users/13517/Desktop/AI%20Voice%20painting/voicecanvas-ai.html#L336-391)）：
   ```javascript
   const TRANSLATION_DICT = {
       // 动词
       '画': 'draw',
       '画一个': 'draw a',
       // ... 更多词汇
   };
   ```

2. **新增关键词列表**（[voicecanvas-ai.html#L393-404](file:///C:/Users/13517/Desktop/AI%20Voice%20painting/voicecanvas-ai.html#L393-404)）：
   ```javascript
   const VERBS = ['画', '画一个', '绘制', ...];
   const NOUNS_SHAPES = ['圆', '矩形', '三角形', ...];
   const NOUNS_COLORS = ['红色', '蓝色', '绿色', ...];
   ```

3. **新增翻译函数**（[voicecanvas-ai.html#L789-797](file:///C:/Users/13517/Desktop/AI%20Voice%20painting/voicecanvas-ai.html#L789-797)）：
   ```javascript
   function translateText(text) {
       let result = text;
       const sortedKeys = Object.keys(TRANSLATION_DICT).sort((a, b) => b.length - a.length);
       for (const key of sortedKeys) {
           result = result.replace(new RegExp(key, 'g'), ` ${TRANSLATION_DICT[key]} `);
       }
       return result;
   }
   ```

4. **新增关键词提取函数**（[voicecanvas-ai.html#L799-828](file:///C:/Users/13517/Desktop/AI%20Voice%20painting/voicecanvas-ai.html#L799-828)）：
   ```javascript
   function extractKeywords(text) {
       const keywords = { verbs: [], shapes: [], colors: [], adjectives: [] };
       // 遍历各列表进行匹配
       return keywords;
   }
   ```

5. **增强指令处理**（[voicecanvas-ai.html#L857-864](file:///C:/Users/13517/Desktop/AI%20Voice%20painting/voicecanvas-ai.html#L857-864)）：
   ```javascript
   const translated = translateText(text);
   const keywords = extractKeywords(text);
   addLog(`原文: ${text}`, 'info');
   addLog(`翻译: ${translated}`, 'info');
   addLog(`动词: ${keywords.verbs.join(', ') || '无'}`, 'info');
   addLog(`图形: ${keywords.shapes.join(', ') || '无'}`, 'info');
   addLog(`颜色: ${keywords.colors.join(', ') || '无'}`, 'info');
   ```

### 技术选型

- **前端框架**：纯 HTML + JavaScript，无需额外依赖
- **翻译方式**：基于字典的字符串替换
- **关键词匹配**：遍历列表进行子串匹配
- **优先级处理**：按词汇长度降序匹配，避免短词优先匹配

---

## 测试方式

### 步骤 1：测试翻译功能
1. 切换到「本地绘图模式」
2. 点击「开始监听」
3. 说出指令（如「画一个红色的圆」）
4. 查看日志，确认显示：
   - 原文
   - 翻译: draw a red circle

### 步骤 2：测试关键词提取
1. 继续监听状态
2. 说出指令（如「画一个带笑脸的黄色太阳」）
3. 查看日志，确认显示：
   - 动词: 画, 一个
   - 图形: 笑脸, 太阳
   - 颜色: 黄色

### 步骤 3：测试多种指令
| 指令 | 期望提取 |
|------|---------|
| "画矩形" | 动词=画, 图形=矩形 |
| "用绿色画三角形" | 动词=画, 图形=三角形, 颜色=绿色 |
| "画一只可爱的小猫" | 动词=画一只, 图形=猫, 形容词=可爱的 |

---

## 相关文件

- `voicecanvas-ai.html` - 主应用文件，包含翻译和关键词提取逻辑
- `DESIGN.md` - 更新设计文档，记录新功能

---

## 注意事项

- 翻译功能主要用于日志显示和调试，实际绘图仍基于关键词匹配
- 关键词提取采用子串匹配，可能存在歧义（如"蓝色"中的"色"）
- 建议用户使用标准指令格式以获得最佳识别效果
