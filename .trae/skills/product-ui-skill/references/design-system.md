# 设计系统规范

> 建立统一、可复用、可扩展的视觉设计语言。

## 设计系统组成

```
┌─────────────────────────────────────────┐
│              设计系统                    │
├─────────────────────────────────────────┤
│  基础层                                  │
│  ├── 色彩系统                           │
│  ├── 字体系统                           │
│  ├── 间距系统                           │
│  └── 图标系统                           │
├─────────────────────────────────────────┤
│  组件层                                  │
│  ├── 基础组件（Button/Input/Select...） │
│  ├── 业务组件（UserCard/ProductCard...）│
│  └── 布局组件（Container/Grid/Space...）│
├─────────────────────────────────────────┤
│  模式层                                  │
│  ├── 页面模板                           │
│  └── 交互模式                           │
└─────────────────────────────────────────┘
```

## 色彩系统

### 语义化色彩

```css
/* === 主色 Primary === */
/* 品牌色，建议 1 个主色 */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* 主色基准 */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;

/* === 成功色 Success === */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* === 警告色 Warning === */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* === 错误色 Error === */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* === 信息色 Info === */
--color-info-50: #f0f9ff;
--color-info-500: #0ea5e9;
--color-info-600: #0284c7;
--color-info-700: #0369a1;
```

### 中性色

```css
/* === 灰阶 Gray === */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;  /* 次要文字 */
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;  /* 主要文字 */
--color-gray-950: #030712;

/* === 文本颜色 === */
--text-primary: var(--color-gray-900);    /* 主要文字 */
--text-secondary: var(--color-gray-600);  /* 次要文字 */
--text-disabled: var(--color-gray-400);  /* 禁用文字 */
--text-inverse: #ffffff;                   /* 反色文字 */

/* === 背景颜色 === */
--bg-primary: #ffffff;
--bg-secondary: var(--color-gray-50);
--bg-tertiary: var(--color-gray-100);
--bg-inverse: var(--color-gray-900);

/* === 边框颜色 === */
--border-default: var(--color-gray-200);
--border-hover: var(--color-gray-300);
--border-focus: var(--color-primary-500);
```

### 功能色彩使用规范

```
场景指南：
┌──────────────────────────────────────────────────┐
│  颜色类型   │  使用场景                          │
├──────────────────────────────────────────────────┤
│  主色       │  主要按钮、链接、选中态、图标强调    │
│  成功色     │  成功提示、通过状态、正向操作        │
│  警告色     │  警告提示、注意事项、待处理状态      │
│  错误色     │  错误提示、失败状态、危险操作        │
│  信息色     │  信息提示、说明性内容、引导          │
│  中性色     │  正文、边框、背景、次要信息          │
└──────────────────────────────────────────────────┘

禁止规范：
- 禁止用颜色作为传递信息的唯一手段（配合图标/文字）
- 禁止红绿作为唯一区分的颜色组合
- 禁止在背景上使用过亮的颜色
- 禁止超过 3 种主色
```

## 字体系统

### 字体层级

```css
/* === 字体族 === */
--font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* === 字号 === */
--text-xs: 0.75rem;    /* 12px - 辅助说明 */
--text-sm: 0.875rem;   /* 14px - 次要文字 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 强调正文 */
--text-xl: 1.25rem;    /* 20px - 小标题 */
--text-2xl: 1.5rem;    /* 24px - 标题 */
--text-3xl: 1.875rem;  /* 30px - 大标题 */
--text-4xl: 2.25rem;   /* 36px - 页面标题 */

/* === 字重 === */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* === 行高 === */
--leading-none: 1;       /* 无行高 - 标题 */
--leading-tight: 1.25;   /* 紧凑 - 标题 */
--leading-snug: 1.375;  /* 略紧 - 卡片标题 */
--leading-normal: 1.5;   /* 正常 - 正文 */
--leading-relaxed: 1.625; /* 宽松 - 辅助文字 */

/* === 字间距 === */
--tracking-tight: -0.025em;  /* 标题 */
--tracking-normal: 0;
--tracking-wide: 0.025em;   /* 大写字母 */
```

### 字体使用规范

```css
/* 页面标题 H1 */
.heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

/* 区块标题 H2 */
.heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* 卡片标题 H3 */
.heading-3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--text-primary);
}

/* 正文 */
.body-text {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* 次要文字 */
.caption-text {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}
```

## 间距系统

### 间距尺度

```css
/* === 基础间距单位（4px）=== */
--space-0: 0;
--space-px: 1px;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */

/* === 语义化间距 === */
--spacing-xs: var(--space-1);   /* 4px - 紧凑 */
--spacing-sm: var(--space-2);  /* 8px - 元素内 */
--spacing-md: var(--space-4);  /* 16px - 元素间 */
--spacing-lg: var(--space-6);  /* 24px - 模块内 */
--spacing-xl: var(--space-8);  /* 32px - 模块间 */
--spacing-2xl: var(--space-12); /* 48px - 区块间 */
```

### 间距应用场景

```
┌─────────────────────────────────────────────────────┐
│  间距尺寸  │  使用场景                              │
├─────────────────────────────────────────────────────┤
│  4px       │  图标与文字间距、标签内间距             │
│  8px       │  按钮内边距、表单项间距、列表项间距     │
│  12px      │  小卡片内边距、标签与内容间距           │
│  16px      │  标准卡片内边距、表单元素间距           │
│  20px      │  大卡片内边距、分组间距                 │
│  24px      │  区块内间距、导航项间距                 │
│  32px      │  区块间间距、页面模块间距               │
│  48px      │  大区块间距、页面分区                   │
│  64px      │  页面级大间距                           │
└─────────────────────────────────────────────────────┘
```

## 圆角系统

### 圆角尺度

```css
/* === 圆角尺寸 === */
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* 胶囊形 */

/* === 语义化圆角 === */
--radius-button: var(--radius-md);     /* 按钮 */
--radius-input: var(--radius-md);       /* 输入框 */
--radius-card: var(--radius-lg);        /* 卡片 */
--radius-modal: var(--radius-xl);       /* 模态框 */
--radius-avatar: var(--radius-full);   /* 头像 */
--radius-badge: var(--radius-sm);      /* 徽章 */
```

### 圆角使用规范

```
┌─────────────────────────────────────────────────────┐
│  圆角尺寸  │  使用元素                                │
├─────────────────────────────────────────────────────┤
│  0px       │  分割线、表格边框、工具类界面             │
│  4px       │  小标签、徽章、小图标按钮                 │
│  8px       │  按钮、输入框、小卡片、下拉菜单           │
│  12px      │  中等卡片、弹窗、内容容器                │
│  16px      │  大卡片、Banner、特殊容器                │
│  24px      │  大型模态框、特殊装饰                     │
│  9999px    │  头像、胶囊按钮、标签                     │
└─────────────────────────────────────────────────────┘

一致性原则：
- 同类型元素使用相同圆角
- 圆角大小与元素大小成正比
- 避免在同一界面混用过多圆角尺寸
```

## 阴影系统

### 阴影尺度

```css
/* === 阴影层级 === */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 
             0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 
             0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 
             0 4px 6px -2px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);

/* === 场景化阴影 === */
--shadow-card: var(--shadow-sm);
--shadow-dropdown: var(--shadow-lg);
--shadow-modal: var(--shadow-2xl);
--shadow-tooltip: var(--shadow-md);
```

### 阴影使用场景

```css
/* 卡片悬浮 */
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* 下拉菜单 */
.dropdown-menu {
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-default);
}

/* 模态框 */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  box-shadow: var(--shadow-2xl);
  border-radius: var(--radius-xl);
}

/* 输入框聚焦 */
.input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  border-color: var(--color-primary-500);
}

/* 按钮聚焦 */
.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

## 边框系统

```css
/* === 边框宽度 === */
--border-width-0: 0;
--border-width-1: 1px;
--border-width-2: 2px;

/* === 边框样式 === */
--border-default: 1px solid var(--border-default);
--border-hover: 1px solid var(--border-hover);
--border-focus: 1px solid var(--border-focus);
--border-emphasis: 2px solid var(--color-primary-500);

/* === 分割线 === */
.divider: {
  height: 1px;
  background: var(--border-default);
  margin: var(--spacing-4) 0;
}

/* === 轮廓 === */
.outline-none: { outline: none; }
.outline-focus: { outline: 2px solid var(--color-primary-500); }
.outline-offset: { outline-offset: 2px; }
```

## 图标尺寸

```css
/* === 图标尺寸 === */
--icon-xs: 0.75rem;    /* 12px */
--icon-sm: 1rem;       /* 16px */
--icon-md: 1.25rem;    /* 20px */
--icon-lg: 1.5rem;     /* 24px */
--icon-xl: 2rem;       /* 32px */
--icon-2xl: 2.5rem;    /* 40px */

/* === 图标使用场景 === */
.icon-inline { width: var(--icon-sm); height: var(--icon-sm); }
.icon-button { width: var(--icon-lg); height: var(--icon-lg); }
.icon-feature { width: var(--icon-xl); height: var(--icon-xl); }
.icon-hero { width: var(--icon-2xl); height: var(--icon-2xl); }
```

## Z-Index 层级

```css
/* === Z-Index 层级 === */
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50;
--z-auto: auto;

/* === 语义化层级 === */
--z-dropdown: var(--z-30);
--z-sticky: var(--z-40);
--z-fixed: var(--z-50);
--z-modal-backdrop: var(--z-60);
--z-modal: var(--z-70);
--z-popover: var(--z-80);
--z-tooltip: var(--z-90);
--z-toast: var(--z-100);
```

## 动效变量

```css
/* === 过渡时长 === */
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* === 缓动函数 === */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* === 常用组合 === */
--transition-fast: var(--duration-fast) var(--ease-out);
--transition-normal: var(--duration-normal) var(--ease-out);
--transition-slow: var(--duration-slow) var(--ease-in-out);

/* === 旋转动画 === */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

## 设计令牌示例

```css
/* 设计令牌完整示例 */
:root {
  /* 颜色 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* 文本 */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-disabled: #9ca3af;
  
  /* 背景 */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  
  /* 边框 */
  --border-default: #e5e7eb;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* 动画 */
  --transition-fast: 100ms ease-out;
  --transition-normal: 200ms ease-out;
}
```

## 设计系统自检

```
□ 是否使用语义化命名（--color-primary 而非 --blue-500）？
□ 颜色是否支持明/暗主题切换？
□ 字号是否使用 rem 单位？
□ 间距是否符合 4px 倍数系统？
□ 阴影层级是否清晰？
□ 动效时长是否统一？
□ Z-Index 是否有规划避免冲突？
□ 组件是否使用 CSS 变量引用设计令牌？
```

---

## 布局工具类（重要）

### 全屏容器

```css
/* 全屏容器 - 登录页、欢迎页使用 */
.fullscreen {
  min-height: 100vh;
  min-height: 100dvh;           /* 移动端动态视口高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 禁止滚动 */
.no-scroll {
  overflow: hidden;
}

/* 允许滚动 */
.allow-scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Flex 布局

```css
/* 常用 Flex 工具类 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
.flex-shrink-0 { flex-shrink: 0; }

/* 主轴对齐 */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

/* 交叉轴对齐 */
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

/* 常用组合 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

### 间距

```css
/* 外边距 */
.m-0 { margin: 0; }
.m-auto { margin: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-auto { margin-top: auto; margin-bottom: auto; }

/* 内边距 */
.p-0 { padding: 0; }
.p-sm { padding: 8px; }
.p-md { padding: 16px; }
.p-lg { padding: 24px; }
.p-xl { padding: 32px; }

/* 垂直/水平 */
.py-sm { padding-top: 8px; padding-bottom: 8px; }
.py-md { padding-top: 16px; padding-bottom: 16px; }
.py-lg { padding-top: 24px; padding-bottom: 24px; }
.px-sm { padding-left: 8px; padding-right: 8px; }
.px-md { padding-left: 16px; padding-right: 16px; }
.px-lg { padding-left: 24px; padding-right: 24px; }

/* Gap */
.gap-xs { gap: 4px; }
.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
.gap-lg { gap: 24px; }
.gap-xl { gap: 32px; }
```

### 定位

```css
/* 定位 */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

/* 固定顶部/底部 */
.fixed-top { position: fixed; top: 0; left: 0; right: 0; }
.fixed-bottom { position: fixed; bottom: 0; left: 0; right: 0; }

/* 居中定位（需配合 absolute） */
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 固定居中 */
.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 尺寸

```css
/* 宽度 */
.w-full { width: 100%; }
.w-auto { width: auto; }
.max-w-xs { max-width: 320px; }
.max-w-sm { max-width: 400px; }
.max-w-md { max-width: 480px; }
.max-w-lg { max-width: 640px; }
.max-w-xl { max-width: 768px; }
.max-w-2xl { max-width: 1024px; }
.max-w-full { max-width: 100%; }

/* 高度 */
.h-full { height: 100%; }
.h-screen { height: 100vh; }
.h-screen-dynamic { height: 100dvh; }
.min-h-screen { min-height: 100vh; }
.min-h-screen-dynamic { min-height: 100dvh; }
```

### 文本

```css
/* 文本对齐 */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* 文本截断 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 文字换行 */
.break-words { word-break: break-word; }
.break-all { word-break: break-all; }
```

### 显示

```css
/* 显示模式 */
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }

/* 响应式显示 */
@media (max-width: 768px) {
  .hide-mobile { display: none; }
}

@media (min-width: 769px) {
  .show-mobile-only { display: none; }
}
```

### 圆角与阴影

```css
/* 圆角 */
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: 4px; }
.rounded { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-xl { border-radius: 16px; }
.rounded-full { border-radius: 9999px; }

/* 阴影 */
.shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.shadow { box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.shadow-xl { box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
.shadow-none { box-shadow: none; }
```

### 常用组件布局

```css
/* 页面容器 */
.page-container {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 卡片 */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* 表单容器 */
.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* 居中卡片 */
.center-card {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.center-card .card {
  width: 100%;
  max-width: 400px;
}
```
