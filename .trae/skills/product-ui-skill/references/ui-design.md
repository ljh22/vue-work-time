# UI 设计规范

> 从高级 UI 设计师的视角，提供专业、可执行的视觉设计指导。

## 视觉设计原则

### 1. 对比（Contrast）

**通过对比建立信息层级，引导用户注意力**

```
对比维度：
- 大小对比：标题 vs 正文 vs 辅助文字
- 颜色对比：主色 vs 背景色
- 粗细对比：粗体 vs 常规 vs 浅色
- 间距对比：模块间距 vs 元素间距

对比度标准：
- 文本与背景：≥ 4.5:1（小文本）/ ≥ 3:1（大文本）
- UI 组件：≥ 3:1
```

### 2. 一致性（Consistency）

**相同的功能使用相同的设计，减少用户学习成本**

```
一致性检查：
- 相似操作是否使用相同的交互方式？
- 相同类型的信息是否使用相同的展示方式？
- 颜色、字体、间距是否遵循统一规范？
- 动效是否使用相同的曲线和时长？
```

### 3. 层次（Hierarchy）

**信息有主次，视觉有轻重**

```
建立层次的技巧：
- 尺寸：越大越重要
- 颜色：越醒目越重要（但要克制）
- 位置：越靠左上越重要（阅读习惯）
- 对比：越明显越重要
- 间距：越宽松越重要
```

### 4. 容错（ Forgiveness）

**给用户犯错的空间，同时提供纠错机制**

```
容错设计：
- 删除前确认
- 撤销/重做功能
- 自动保存草稿
- 操作倒计时取消
- 版本历史记录
```

## 排版规范

### 字体系统

```
推荐中文字体：
- 正文：思源黑体 / 苹方 / Noto Sans CJK
- 标题：思源黑体 Bold / 苹方 Bold
- 代码：JetBrains Mono / Source Code Pro

推荐英文字体：
- 正文：Inter / SF Pro / Roboto
- 标题：Inter Bold / Poppins
- 代码：Fira Code / Monaco

字体使用规范：
- 正文字号：14-16px
- 标题层级：24/20/18/16px
- 辅助文字：12-13px
- 行高：1.5-1.8（正文）/ 1.2-1.4（标题）
```

### 字体层级示例

```css
/* 页面标题 */
.text-h1 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

/* 卡片标题 */
.text-h2 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

/* 正文 */
.text-body {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

/* 辅助文字 */
.text-caption {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
}
```

### 文本规范

```
文本规则：
- 句末使用中文标点
- 英文/数字与中文之间有空格
- 避免一正文/单独标点换行
- 标题不适用句号
- 数字使用阿拉伯数字（数据、日期等）
- 金额使用标准格式（¥100.00）

文案风格：
- 按钮：动词 + 对象（"提交订单"）
- 提示：简短直接（"密码错误"）
- 错误：说明原因 + 解决建议
```

## 色彩系统

### 色彩语义

```
功能性颜色：
- 主色（Primary）：品牌色、主要操作
- 成功（Success）：正向操作、成功状态
- 警告（Warning）：警示、需要关注
- 错误（Error）：错误、危险操作
- 信息（Info）：提示、说明性内容

中性色：
- 标题文字：#1a1a1a 或 rgba(0,0,0,0.85)
- 正文文字：#333333 或 rgba(0,0,0,0.65)
- 辅助文字：#666666 或 rgba(0,0,0,0.45)
- 占位文字：#999999 或 rgba(0,0,0,0.35)
- 边框线条：#e5e5e5 或 rgba(0,0,0,0.12)
- 背景色：#ffffff / #f5f5f5 / #fafafa
```

### 配色方案示例

```css
/* 浅色主题 */
:root {
  /* 主色系 - 蓝色 */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

/* 深色主题 */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}
```

### 渐变色规范

```
渐变使用场景：
- 背景装饰（需低饱和度）
- 品牌强调（如首页 Banner）
- 状态变化（loading 动画）

渐变注意事项：
- 避免过于花哨（≤ 3 个颜色）
- 保持可读性（覆盖内容需有对比）
- 考虑无障碍（避免纯色相渐变）
- 控制使用频率（克制使用）

常见渐变公式：
- 品牌渐变：primary → primary-light
- 天空渐变：blue-400 → purple-400
- 暖色渐变：orange-400 → pink-400
```

## 间距系统

### 基础间距单位

```
推荐间距系统（4px 基准）：
xs: 4px   - 紧凑间距
sm: 8px   - 元素内间距
md: 16px  - 元素间距
lg: 24px  - 模块内间距
xl: 32px  - 模块间距
2xl: 48px - 区块间距
3xl: 64px - 页面间距
```

### 间距应用指南

```css
/* 元素内部 */
.padding-tight { padding: 4px; }
.padding-normal { padding: 8px 12px; }
.padding-relaxed { padding: 12px 16px; }

/* 元素之间 */
.gap-xs { gap: 4px; }
.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
.gap-lg { gap: 24px; }

/* 模块之间 */
.section-gap { margin-bottom: 24px; }
.card-gap { gap: 16px; }
.list-gap { gap: 8px; }
```

### 常用布局间距

```
页面级：
- 容器最大宽度：1200px / 1440px
- 页面水平边距：16px（移动）/ 24px（平板）/ 48px（桌面）
- 页面垂直间距：24px / 32px / 48px

卡片级：
- 卡片内边距：16px / 20px / 24px
- 卡片间距：12px / 16px / 24px
- 卡片圆角：8px / 12px / 16px

列表级：
- 列表项间距：1px（分割线）/ 8px / 12px
- 列表项内边距：12px / 16px
```

## 圆角规范

### 圆角系统

```
圆角尺寸（4px 基准）：
none: 0px      - 特殊场景（徽章、分隔线）
sm: 4px        - 小型元素（标签、图标按钮）
md: 8px        - 常规元素（按钮、输入框）
lg: 12px       - 中型容器（卡片）
xl: 16px       - 大型容器（模态框）
full: 9999px   - 胶囊按钮、头像

圆角应用场景：
- 小按钮/标签：4px
- 输入框/小卡片：8px
- 中等卡片/模态框：12px
- 大容器/Banner：16px
- 头像/头像组：50% 或 full
```

### 圆角使用原则

```
一致性：
- 同类型元素使用相同圆角
- 避免混用（如按钮 8px、卡片 12px）

匹配性：
- 圆角大小应与元素大小协调
- 小元素小圆角，大元素大圆角
- 配对元素（如头像和背景）圆角一致

克制使用：
- 功能性元素避免过大圆角
- 表格列表通常无圆角
- 工具类界面可减少圆角
```

## 阴影规范

### 阴影层级

```
阴影系统（示例）：
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)      /* 微阴影 */
shadow-md:  0 4px 6px rgba(0,0,0,0.07)      /* 标准阴影 */
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)     /* 浮层阴影 */
shadow-xl:  0 20px 25px rgba(0,0,0,0.15)    /* 模态框阴影 */
shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06) /* 内阴影 */

/* MacOS 风格阴影 */
shadow-macos: 0 22.5px 45px rgba(0,0,0,0.15), 0 9px 18px rgba(0,0,0,0.1)

/* Material 风格阴影 */
shadow-material-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
shadow-material-2: 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)
shadow-material-3: 0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)
```

### 阴影使用场景

```css
/* 卡片悬浮 */
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* 下拉菜单 */
.dropdown {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
}

/* 模态框 */
.modal {
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

/* 输入框聚焦 */
.input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  border-color: var(--primary);
}
```

### 阴影设计原则

```
层次清晰：
- 阴影深度表示层级高低
- 高层元素阴影更深更大
- 同级元素阴影一致

性能考虑：
- 避免过多阴影（影响性能）
- 移动端减少阴影使用
- 优先使用 transform 动画

美观协调：
- 阴影方向统一（通常向下）
- 阴影颜色与元素色协调
- 避免纯黑色（过于生硬）
```

## 图标规范

### 图标设计原则

```
风格统一：
- 相同系列（Lucide / Heroicons / Feather）
- 相同线宽（1.5px / 2px / 2.5px）
- 相同圆角（4px / 8px / 12px）

尺寸规范：
- 图标 + 文字：16px / 20px
- 独立图标：24px
- 大图标/装饰：32px / 48px
- 底栏图标：28px

颜色规范：
- 与文字同色（继承 color）
- 功能色（success/error/warning）
- 禁用状态：opacity 0.4
```

### 常用图标库

```
开源图标库：
- Lucide（推荐）：https://lucide.dev
- Heroicons：https://heroicons.com
- Feather：https://feathericons.com
- Tabler Icons：https://tabler-icons.io
- Phosphor Icons：https://phosphoricons.com

图标使用：
- SVG 内联（推荐）或 SVG Sprite
- 避免 Icon Font（不利于维护）
- 支持通过 CSS 自定义颜色
```

## 组件设计指南

### 按钮设计

```css
/* 按钮尺寸 */
.btn-sm { height: 32px; padding: 0 12px; font-size: 13px; }
.btn-md { height: 40px; padding: 0 16px; font-size: 14px; }
.btn-lg { height: 48px; padding: 0 24px; font-size: 16px; }

/* 按钮变体 */
.btn-primary {
  background: var(--primary);
  color: white;
  border-radius: 8px;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-ghost {
  background: transparent;
  color: var(--text);
}
```

### 输入框设计

```css
.input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.input:hover {
  border-color: var(--gray-400);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}
```

### 卡片设计

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid var(--gray-100);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.card-interactive {
  cursor: pointer;
  transition: all 0.2s;
}
```

## 动效设计

### 动效原则

```
动效目的：
- 引导注意力
- 提供反馈
- 减少等待感知
- 建立空间关系

动效规范：
- 时长：快速（100-200ms）/ 正常（200-300ms）/ 缓慢（400-500ms）
- 缓动：ease-out（进入）/ ease-in-out（状态变化）/ spring（弹性）
- 克制：避免无意义的动效

推荐缓动曲线：
- ease-out：cubic-bezier(0, 0, 0.2, 1)
- ease-in：cubic-bezier(0.4, 0, 1, 1)
- ease-in-out：cubic-bezier(0.4, 0, 0.2, 1)
- spring：cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

### 常用动效

```css
/* 淡入 */
.fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 缩放淡入 */
.scale-in {
  animation: scaleIn 0.25s ease-out;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* 滑入 */
.slide-up {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 悬浮效果 */
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

## 响应式断点

```
常见断点：
- xs: 0-479px    （小屏手机）
- sm: 480-767px  （大屏手机）
- md: 768-1023px （平板）
- lg: 1024-1279px（笔记本）
- xl: 1280-1535px（桌面）
- 2xl: 1536px+   （大屏桌面）

移动优先策略：
1. 从小屏幕设计开始
2. 使用相对单位（rem/vw）
3. 渐进增强而非优雅降级
4. 测试关键断点
```

## 设计自检清单

```
□ 是否有清晰的视觉层级？
□ 颜色使用是否一致？
□ 间距是否遵循系统？
□ 圆角是否统一？
□ 阴影是否克制？
□ 动效是否自然流畅？
□ 是否考虑了无障碍？
□ 是否适配多端？
□ 文案是否清晰友好？
□ 状态是否完整覆盖？
□ 布局是否填满可用空间？
□ 是否有不必要的滚动？
□ 页面切换是否有流畅过渡？
```

---

## 布局规范（重要）

### 全屏/沉浸式布局

**适用场景：登录页、注册页、欢迎页、认证页**

```css
/* 全屏容器 - 禁止滚动 */
.fullscreen-container {
  min-height: 100vh;           /* 最小高度 = 视口高度 */
  min-height: 100dvh;          /* 动态视口高度（移动端） */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;             /* 禁止滚动 */
}

/* 内容区最大宽度 */
.content-wrapper {
  width: 100%;
  max-width: 400px;            /* 登录注册：400px */
  padding: 0 24px;
}
```

### 左右分栏布局

**适用场景：登录页、注册页（PC端）**

```css
/* 分栏容器 */
.split-layout {
  display: flex;
  min-height: 100vh;
}

.split-layout .left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.split-layout .right {
  width: 100%;
  max-width: 520px;            /* 表单区固定宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  overflow-y: auto;            /* 表单区可滚动 */
}

/* 移动端隐藏左侧 */
@media (max-width: 768px) {
  .split-layout .left {
    display: none;
  }
  .split-layout .right {
    max-width: 100%;
    padding: 24px;
  }
}
```

### 居中悬浮布局

**适用场景：Modal、Dialog、Toast**

```css
/* 居中容器 */
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* 固定居中（不随滚动移动） */
.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
}
```

### 防止多余滚动

```css
/* 禁止 html/body 滚动 */
html, body {
  height: 100%;
  overflow: hidden;
}

/* 允许局部滚动 */
.allow-scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 滚动条美化（可选） */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
```

### Flex 布局技巧

```css
/* 垂直居中 */
.center-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 内容贴底 + 头部自适应 */
.sticky-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sticky-footer .header {
  flex-shrink: 0;
}

.sticky-footer .content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sticky-footer .footer {
  flex-shrink: 0;
}
```

## 页面切换动效（重要）

### Tab/切换平滑过渡

```tsx
// ✅ 正确的 Tab 切换实现
const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

// 方案1：淡入淡出（推荐）
<div className="auth-tabs">
  <button 
    className={activeTab === 'login' ? 'active' : ''}
    onClick={() => setActiveTab('login')}
  >
    登录
  </button>
  <button 
    className={activeTab === 'register' ? 'active' : ''}
    onClick={() => setActiveTab('register')}
  >
    注册
  </button>
</div>

<div className="tab-content">
  <TransitionGroup>
    {activeTab === 'login' && (
      <motion.div
        key="login"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="form-container"
      >
        <LoginForm />
      </motion.div>
    )}
    {activeTab === 'register' && (
      <motion.div
        key="register"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="form-container"
      >
        <RegisterForm />
      </motion.div>
    )}
  </TransitionGroup>
</div>
```

### 页面进入动画

```tsx
// 页面加载动画
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3
};

export default function AuthPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="fullscreen-container"
    >
      {/* 内容 */}
    </motion.div>
  );
}
```

### 表单切换（无动画版）

```tsx
// 如果不使用动画库，确保切换时不闪烁
const [activeTab, setActiveTab] = useState('login');

// 方案：保持两个表单但控制显示
return (
  <div className="auth-container">
    <div className="auth-tabs">
      <button className={activeTab === 'login' ? 'active' : ''}>
        登录
      </button>
      <button className={activeTab === 'register' ? 'active' : ''}>
        注册
      </button>
    </div>
    
    {/* 保持 DOM 结构稳定，避免重新挂载导致的闪烁 */}
    <div style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
      <LoginForm />
    </div>
    <div style={{ display: activeTab === 'register' ? 'block' : 'none' }}>
      <RegisterForm />
    </div>
  </div>
);
```

## 常见场景布局模板

### 登录页（完整实现）

```tsx
export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // 全屏容器，禁止滚动
    <div className="fullscreen-container">
      <div className="content-wrapper">
        {/* Logo */}
        <div className="auth-header">
          <h1>Logo</h1>
        </div>

        {/* Tab 切换 */}
        <div className="auth-tabs">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button 
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        {/* 表单区 */}
        <div className="auth-form">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm />
            </motion.div>
          )}
        </div>

        {/* 第三方登录 */}
        <div className="social-login">
          {/* ... */}
        </div>

        {/* 底部协议 */}
        <div className="auth-footer">
          <span>登录即代表同意</span>
          <a href="/terms">《用户协议》</a>
          <span>和</span>
          <a href="/privacy">《隐私政策》</a>
        </div>
      </div>
    </div>
  );
}
```

### 样式

```css
.fullscreen-container {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

.content-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.auth-tabs button {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
}

.auth-tabs button.active {
  color: var(--primary);
}

.auth-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```
