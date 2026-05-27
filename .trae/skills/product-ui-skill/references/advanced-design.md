# 高级设计规范精华

> 整合多个顶级 Design Skill 的核心精华，生成专业级 UI。

## 设计参数系统

### 三大设计维度

| 参数 | 取值范围 | 说明 |
|------|----------|------|
| **DESIGN_VARIANCE** | 1-10 | 布局变化度（1=对称, 10=艺术化不对称） |
| **MOTION_INTENSITY** | 1-10 | 动效强度（1=静态, 10=电影级） |
| **VISUAL_DENSITY** | 1-10 | 视觉密度（1=留白多, 10=数据密集） |

### 默认配置（始终使用）

```
DESIGN_VARIANCE: 6
MOTION_INTENSITY: 5
VISUAL_DENSITY: 5
```

### 参数应用指南

#### DESIGN_VARIANCE 层级

| 层级 | 布局特点 | 适用场景 |
|------|----------|----------|
| 1-3 | Flex居中、12列对称网格 | 工具类后台、表格 |
| 4-6 | 偏移布局、叠加效果、不对称留白 | 常规网站 |
| 7-10 | 瀑布流、CSS Grid 2fr 1fr 1fr | 创意展示、landing页 |

#### MOTION_INTENSITY 层级

| 层级 | 动画特点 | 实现方式 |
|------|----------|----------|
| 1-3 | 无自动动画 | CSS :hover / :active |
| 4-6 | CSS过渡动画 | transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) |
| 7-10 | 复杂编排 | Framer Motion、GSAP |

#### VISUAL_DENSITY 层级

| 层级 | 密度特点 | 适用场景 |
|------|----------|----------|
| 1-3 | 大量留白、画廊感 | 高端官网、作品集 |
| 4-6 | 正常间距 | 日常应用 |
| 8-10 | 紧凑、数据驾驶舱 | 数据仪表盘 |

---

## AI 设计禁区（禁止模式）

### 视觉与 CSS

| 禁止项 | 替代方案 |
|--------|----------|
| ❌ Neon 外发光 | 使用内边框或微阴影 |
| ❌ 纯黑 #000000 | 使用 Off-Black、Zinc-950 |
| ❌ 过度饱和的强调色 | 降低饱和度与中性色融合 |
| ❌ 渐变文字（标题） | 使用纯色 |
| ❌ 自定义鼠标指针 | 使用系统默认 |
| ❌ Unsplash 图片 | 使用 picsum.photos 占位图 |

### 排版

| 禁止项 | 替代方案 |
|--------|----------|
| ❌ Inter 字体 | 使用 Geist、Outfit、Satoshi、Geist Mono |
| ❌ 特大 H1 | 用字重和颜色建立层级 |
| ❌ Serif 用于后台 | 仅用于编辑/创意场景 |
| ❌ 渐变背景文字 | 纯色背景 + 强调色文字 |

### 布局

| 禁止项 | 替代方案 |
|--------|----------|
| ❌ 3 列等宽卡片 | 使用 2 列 Zig-Zag 或不对称网格 |
| ❌ 居中 Hero 布局（variance>4） | 使用左右分栏或不对称留白 |
| ❌ 嵌套卡片 | 使用 border-t、divide-y 或留白分组 |
| ❌ 到处都是容器 | 大多数元素不需要包在容器里 |

### 内容

| 禁止项 | 替代方案 |
|--------|----------|
| ❌ John Doe、Sarah Chan | 使用真实感强的创意姓名 |
| ❌ 标准 SVG 头像 | 使用真实感强的照片占位 |
| ❌ 99.99%、50% 等假数据 | 使用自然数据如 47.2% |
| ❌ Acme、Nexus、SmartFlow | 使用高端品牌名 |
| ❌ Elevate、Seamless、Unleash | 使用具体动词 |

---

## OKLCH 色彩系统

### 核心原则

**使用 OKLCH 替代 HSL**。OKLCH 是感知均匀的，意味着相同步长的亮度看起来相等。

```
❌ HSL: hsl(250, 100%, 50%) - 50%亮度黄色太亮，50%亮度蓝色太暗
✅ OKLCH: oklch(50% 0.2 250) - 50%亮度在任何色相下看起来相同
```

### 调色板结构

```
角色层级：
├── Primary（主色）：品牌色、CTA、关键操作
│   └── 1个主色，3-5个色阶
├── Neutral（中性的）：文本、背景、边框
│   └── 9-11级色阶
├── Semantic（语义的）：成功、错误、警告、提示
│   └── 每种4色，2-3个色阶
└── Surface（表面）：卡片、模态框、遮罩
    └── 2-3个高度级别
```

### 60-30-10 法则

```
60% - 中性背景、留白、基础表面
30% - 次要颜色：文本、边框、非活跃状态
10% - 强调色：CTA、高亮、焦点状态
```

### 色调中性色（重要）

**纯灰已死**。在所有中性色中添加微小色度值（0.005-0.015），使其向品牌色倾斜。

```css
/* ❌ 纯灰：缺乏生气 */
--gray-100: oklch(98% 0 0);

/* ✅ 带色度的灰：与品牌协调 */
--gray-100: oklch(98% 0.005 250); /* 向蓝色倾斜 */
--gray-100: oklch(98% 0.008 60);  /* 向橙色倾斜 */
```

### 暗色模式

**暗色模式不是反转的亮色模式**。

| 亮色模式 | 暗色模式 |
|----------|----------|
| 用阴影表示深度 | 用更亮的表面表示深度 |
| 深色文字在浅色背景 | 浅色文字在深色背景 |
| 鲜艳的强调色 | 稍微降低饱和度 |
| 白色背景 | 绝不用纯黑（oklch 12-18%） |

---

## 字体系统

### 层级原则

**使用更少的字号，产生更大的对比**。

| 角色 | 字号范围 | 用途 |
|------|----------|------|
| xs | 0.75rem / 12px | 注释、法律文本 |
| sm | 0.875rem / 14px | 次要UI、元数据 |
| base | 1rem / 16px | 正文 |
| lg | 1.25-1.5rem | 副标题、引导文本 |
| xl+ | 2-4rem | 标题、Hero |

**字号比 ≥ 1.25**（推荐 1.333 或 1.5）。

### 字体选择

| 场景 | 推荐字体 |
|------|----------|
| 科技/工具 | Geist、Outfit、Satoshi |
| 编辑/高端 | 使用 Serif 配对 Sans |
| 代码 | Geist Mono、JetBrains Mono |

**不要用 Inter**。这是 AI 设计的第一大特征。

### 排版技术

```css
/* 字符宽度限制（阅读舒适） */
.body-text {
  max-width: 65ch; /* 65-75字符最佳 */
  line-height: 1.5-1.75;
}

/* 标题断行优化 */
h1, h2, h3 {
  text-wrap: balance; /* 均匀断行 */
}

/* 正文避免孤儿单词 */
article p {
  text-wrap: pretty; /* 减少孤行 */
}

/* 数字对齐 */
.data-table {
  font-variant-numeric: tabular-nums;
}

/* 全大写字母间距 */
.all-caps-label {
  letter-spacing: 0.05em to 0.12em;
}
```

---

## 布局原则

### 全屏场景（登录、注册页）

```css
/* ✅ 正确：动态视口高度 */
.fullscreen {
  min-height: 100vh;
  min-height: 100dvh; /* 移动端必需 */
  overflow: hidden;
}

/* ❌ 错误：iOS Safari 会跳 */
.hero {
  height: 100vh; /* 键盘弹出时出问题 */
}
```

### 响应式断点

```
常用断点：
├── xs: 0-479px   （小屏手机）
├── sm: 480-767px  （大屏手机）
├── md: 768-1023px （平板）
├── lg: 1024-1279px（笔记本）
└── xl: 1280px+   （桌面）
```

### Grid 优先原则

```css
/* ✅ Grid 布局：稳定可靠 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ❌ 避免 Flex 数学计算 */
.flex-33 {
  flex: 0 0 calc(33.333% - 1rem); /* 易出错 */
}
```

### 间距韵律

基于行高建立间距系统。如果 body 文字是 `16px × 1.5 = 24px`，所有间距应该是 24px 的倍数。

---

## 动效系统

### 时长规则

| 时长 | 用途 | 示例 |
|------|------|------|
| 100-150ms | 即时反馈 | 按钮按下、颜色变化 |
| 200-300ms | 状态变化 | 菜单展开、悬浮状态 |
| 300-500ms | 布局变化 | 手风琴、模态框 |
| 500-800ms | 入场动画 | 页面加载、Hero 揭示 |

### 缓动曲线

```css
/* ✅ 推荐：指数缓出 */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* 入场用 ease-out */
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

/* 退场用 ease-in（更快） */
transition: all 0.2s cubic-bezier(0.7, 0, 0.84, 0);
```

### 动画属性

**只动画 transform 和 opacity**。其他属性会触发重排。

```css
/* ✅ 正确 */
.element {
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: translateX(10px);
  opacity: 0.5;
}

/* ❌ 错误：触发布局重算 */
.element {
  transition: left 0.3s ease, width 0.3s ease;
  left: 100px;
  width: 200px;
}
```

### 减少动画（必须支持）

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 交错动画

```css
/* 列表交错入场 */
.item {
  animation: fade-up 0.5s ease-out both;
  animation-delay: calc(var(--index) * 50ms);
}
```

---

## 交互状态

### 必须实现的交互循环

每个交互组件必须实现完整的状态周期：

| 状态 | 实现要求 |
|------|----------|
| **Loading** | 骨架屏匹配布局大小，避免通用旋转器 |
| **Empty** | 精美组合的空状态，说明如何填充数据 |
| **Error** | 清晰的行内错误报告（如表单） |
| **Success** | 明确的成功反馈 |

### 触觉反馈

```css
/* 按下时的物理反馈 */
button:active {
  transform: scale(0.98) translateY(1px);
  /* 或 */
  transform: translateY(2px);
}
```

### 焦点状态

```css
/* 不要移除焦点环 */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ❌ 禁止 */
:focus {
  outline: none;
}
```

---

## 性能守卫

### 硬件加速

只动画 `transform` 和 `opacity`。

### Z-Index 克制

不要随意使用 z-50、z-100。只在以下场景使用：
- Sticky 导航栏
- 模态框
- 下拉菜单
- Toast 提示

### 图片优化

```html
<!-- ✅ WebP 格式 + 响应式图片 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述">
</picture>

<!-- ✅ 声明宽高防 CLS -->
<img src="..." width="800" height="600" alt="...">

<!-- ✅ 懒加载非首屏 -->
<img src="..." loading="lazy">
```

### 代码分割

```tsx
// ✅ 路由级分割
const Dashboard = dynamic(() => import('./Dashboard'));

// ✅ 组件级分割
const HeavyChart = dynamic(() => import('./HeavyChart'));
```

---

## 设计自检清单

### 布局检查
```
□ 是否使用了 min-height: 100dvh（全屏场景）？
□ 是否有 overflow: hidden（禁止滚动场景）？
□ 是否使用了 CSS Grid 而非 Flex 复杂计算？
□ 各断点是否正常响应？
```

### 色彩检查
```
□ 是否使用 OKLCH 而非 HSL？
□ 是否避免了纯黑和纯灰？
□ 强调色是否 ≤ 10% 使用？
□ 对比度是否 ≥ 4.5:1？
```

### 字体检查
```
□ 是否避免了 Inter 字体？
□ 字号层级是否有足够对比（≥ 1.25）？
□ 正文是否限制了宽度（≤ 75ch）？
□ 是否使用了 tabular-nums（数字列）？
```

### 动效检查
```
□ 是否只在 transform/opacity 上动画？
□ 时长是否在合理范围（150-500ms）？
□ 入场是否用 ease-out？
□ 是否支持 prefers-reduced-motion？
```

### 交互检查
```
□ 是否实现了 Loading/Empty/Error/Success 全状态？
□ 焦点状态是否可见？
□ 按下是否有触觉反馈？
□ 触摸目标是否 ≥ 44×44px？
```

### 内容检查
```
□ 是否避免了假数据（99.99%）？
□ 是否避免了 Emojis（用图标替代）？
□ 是否避免了 AI 俗套词（Elevate、Seamless）？
□ 是否避免了 Unsplash（用 picsum.photos）？
```
