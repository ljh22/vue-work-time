# 无障碍与交互规范

> Web 可访问性（WAI）和交互最佳实践，确保所有人都能使用。

## 无障碍（Accessibility）CRITICAL

### 对比度要求

| 内容类型 | AA 最低 | AAA 目标 |
|----------|---------|----------|
| 正文文字 | 4.5:1 | 7:1 |
| 大文字（18px+ 或 14px 粗体） | 3:1 | 4.5:1 |
| UI 组件、图标 | 3:1 | 4.5:1 |

### 焦点状态

```css
/* ✅ 必须可见 */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ❌ 禁止移除焦点环 */
*:focus {
  outline: none;
}
```

### 表单标签

```tsx
/* ✅ 正确：label + for */
<label htmlFor="email">邮箱</label>
<input id="email" type="email" />

/* ❌ 错误：只用 placeholder */
<input placeholder="邮箱" />
```

### 图片替代文本

```tsx
/* ✅ 有意义的图片 */
<img src="user.jpg" alt="张三的照片" />

/* ✅ 装饰性图片 */
<img src="decorative.svg" alt="" aria-hidden="true" />

/* ❌ 无替代文本 */
<img src="chart.png" />
```

### ARIA 标签

```tsx
/* 图标按钮必须有标签 */
<button aria-label="关闭菜单">
  <CloseIcon />
</button>

/* 隐藏元素 */
<span className="sr-only">新消息通知</span>
```

### 键盘导航

```
必须支持：
├── Tab - 移动到下一个可聚焦元素
├── Shift+Tab - 移动到上一个可聚焦元素
├── Enter - 激活按钮/链接
├── Space - 激活按钮/切换复选框
├── Escape - 关闭模态框/下拉菜单
└── 方向键 - 在选项组中导航
```

### 跳过链接

```tsx
{/* 允许键盘用户跳过导航 */}
<a href="#main-content" className="skip-link">
  跳到主要内容
</a>
```

### 标题层级

```html
<!-- 必须顺序：h1 → h2 → h3，不能跳级 -->
<h1>页面标题</h1>
  <h2>章节标题</h2>
    <h3>子章节标题</h3>
```

### 不只用颜色传达信息

```tsx
/* ❌ 错误：只用颜色 */
<span className="status error">失败</span>

/* ✅ 正确：颜色 + 图标/文字 */
<span className="status error">
  <ErrorIcon />
  失败
</span>
```

### 支持动态字体

```tsx
/* 避免固定高度截断文本 */
<div style={{ minHeight: '1.5em' }}>
  {text}
</div>
```

---

## 触摸与交互 CRITICAL

### 触摸目标尺寸

| 平台 | 最小尺寸 |
|------|----------|
| Apple (iOS) | 44×44pt |
| Material (Android) | 48×48dp |
| Web | 44×44px |

```css
/* ✅ 正确：确保足够大 */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 16px;
}
```

### 触摸间距

元素之间至少 8px 间距，避免误触。

```css
/* ✅ 正确 */
.list-item {
  padding: 12px;
  margin-bottom: 8px;
}

/* ❌ 错误：太近 */
.list-item {
  padding: 12px;
  margin-bottom: 2px;
}
```

### 不要只用悬浮

```tsx
/* ❌ 错误：移动端无悬浮 */
.tooltip {
  /* 仅 :hover 显示，移动端无法触发 */
}

/* ✅ 正确：触摸也能触发 */
.dropdown {
  /* 点击展开 */
}
.dropdown:hover .dropdown-content {
  /* 悬浮也显示 */
}
```

### 加载状态

```tsx
/* ✅ 异步操作时禁用按钮 */
<button disabled={isLoading} onClick={handleSubmit}>
  {isLoading ? '提交中...' : '提交'}
</button>
```

### 错误反馈

```tsx
/* ✅ 错误信息靠近问题字段 */
<div className="form-field">
  <label>邮箱</label>
  <input aria-describedby="email-error" />
  <span id="email-error" className="error">
    请输入有效的邮箱地址
  </span>
</div>
```

### 手势冲突

```css
/* ❌ 不要在主要内容上禁用水平滑动 */
.scrollable {
  touch-action: pan-y; /* 只允许垂直滚动 */
}
```

### 点击延迟

```css
/* 移除 300ms 点击延迟 */
html {
  touch-action: manipulation;
}
```

### 按压反馈

```css
button:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
```

---

## 性能优化 HIGH

### 图片优化

```html
<!-- ✅ WebP/AVIF + 响应式 -->
<img 
  src="image-400.avif"
  srcset="image-400.avif 400w, image-800.avif 800w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="描述"
  loading="lazy"
  width="800"
  height="600"
/>
```

### 字体加载

```css
/* ✅ 显示回退字体，避免 FOIT */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
```

### 骨架屏

```tsx
{/* ✅ 超过 1 秒的加载用骨架屏 */}
{isLoading ? (
  <div className="skeleton">
    <Skeleton.Avatar size="large" />
    <Skeleton.Text lines={3} />
  </div>
) : (
  <Content />
)}
```

### 虚拟列表

```tsx
{/* ✅ 50+ 条目的列表使用虚拟化 */}
<VirtualList
  data={items}
  itemHeight={72}
  overscan={5}
  renderItem={(item) => <ListItem data={item} />}
/>
```

### 防抖节流

```tsx
// 高频事件使用防抖/节流
const debouncedSearch = useDebouncedCallback(
  (value) => search(value),
  300
);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### CLS 预防

```css
/* ✅ 始终声明图片尺寸或比例 */
img, video {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}
```

---

## 表单设计

### 标签位置

```
✅ 正确：标签在输入框上方
┌─────────────────┐
│ 邮箱地址        │
│ ┌─────────────┐ │
│ │             │ │
│ └─────────────┘ │
│ 用于接收通知    │
└─────────────────┘
```

### 错误处理

```tsx
<Form.Item
  name="email"
  validateStatus="error"
  help="请输入有效的邮箱地址"
>
  <Input />
</Form.Item>
```

### 分步表单

```tsx
{/* 长表单使用分步 */}
<Steps current={current}>
  <Step title="基本信息" />
  <Step title="联系方式" />
  <Step title="完成" />
</Steps>
```

---

## 空状态设计

```tsx
<Empty
  image={<EmptyIcon />}
  description={
    <div>
      <p>还没有任何订单</p>
      <p className="hint">去逛逛有什么喜欢的商品吧</p>
    </div>
  }
>
  <Button type="primary">去购物</Button>
</Empty>
```

---

## 响应式布局

### 移动优先

```css
/* ✅ 移动优先 */
.card {
  padding: 16px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .card {
    padding: 24px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .card {
    padding: 32px;
  }
}
```

### 字符宽度

```
移动端：每行 35-60 字符
桌面端：每行 60-75 字符
```

### 内容优先级

```
移动端：核心内容优先，次要内容折叠或隐藏
桌面端：完整展示所有内容
```

---

## 检查清单

### 无障碍检查
```
□ 对比度是否 ≥ 4.5:1？
□ 焦点状态是否可见？
□ 表单是否有标签？
□ 图片是否有 alt 文本？
□ 是否只用颜色传达信息？
□ 是否支持键盘导航？
□ 是否支持 prefers-reduced-motion？
```

### 交互检查
```
□ 触摸目标是否 ≥ 44×44px？
□ 元素间距是否 ≥ 8px？
□ 异步操作是否有加载状态？
□ 错误信息是否清晰？
□ 是否只用悬浮触发重要交互？
```

### 性能检查
```
□ 图片是否使用 WebP/AVIF？
□ 是否声明了图片宽高？
□ 非首屏图片是否懒加载？
□ 字体是否使用 font-display？
□ 长列表是否虚拟化？
□ 是否有不必要的重排重绘？
```
