# UX 设计模式库

> 汇总常见场景的最佳交互实践方案。

## 表单设计模式

### 1. 输入框设计

```tsx
// ✅ 好的设计
<div className="form-group">
  <label htmlFor="email">
    邮箱地址 <span className="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    placeholder="请输入邮箱"
    className="input"
  />
  <p className="form-hint">用于接收通知和找回密码</p>
  <p className="form-error">请输入有效的邮箱地址</p>
</div>

// 表单状态
.input { /* 默认 */ }
.input:hover { /* 悬浮 */ }
.input:focus { /* 聚焦 */ }
.input:disabled { /* 禁用 */ }
.input-error { /* 错误 */ border-color: var(--color-error); }
.input-success { /* 成功 */ border-color: var(--color-success); }
```

### 2. 实时校验模式

```tsx
// 校验时机：blur 时校验，input 时清除错误
const [value, setValue] = useState('');
const [error, setError] = useState('');
const [touched, setTouched] = useState(false);

// 失焦时校验
const handleBlur = () => {
  setTouched(true);
  validate(value);
};

// 输入时清除错误
const handleChange = (e) => {
  setValue(e.target.value);
  if (error) setError('');
};

// 提交时全量校验
const handleSubmit = () => {
  setTouched(true);
  if (!validate(value)) return;
  // 提交逻辑
};
```

### 3. 密码输入模式

```tsx
// 带切换显示/隐藏的密码输入
<div className="input-group">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="请输入密码"
  />
  <button 
    type="button"
    className="toggle-visibility"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
  </button>
</div>

// 密码强度指示
<div className="password-strength">
  <div className="strength-bar">
    <div className={`strength-level-${level}`} />
  </div>
  <span className="strength-text">
    {level === 1 && '弱'}
    {level === 2 && '中'}
    {level === 3 && '强'}
  </span>
</div>
```

### 4. 手机号输入模式

```tsx
// 国家代码 + 手机号
<div className="phone-input">
  <select className="country-code">
    <option value="+86">+86 中国</option>
    <option value="+852">+852 香港</option>
    <option value="+853">+853 澳门</option>
  </select>
  <input
    type="tel"
    placeholder="请输入手机号"
    maxLength={11}
  />
</div>

// 验证码发送
<div className="verify-code">
  <input placeholder="请输入验证码" />
  <button 
    disabled={countdown > 0}
    className="send-code"
  >
    {countdown > 0 ? `${countdown}s` : '发送验证码'}
  </button>
</div>
```

## 列表设计模式

### 1. 表格列表

```tsx
// 标准表格结构
<div className="table-container">
  <table className="data-table">
    <thead>
      <tr>
        <th className="checkbox-col">
          <input type="checkbox" />
        </th>
        <th>商品</th>
        <th className="text-right">价格</th>
        <th className="text-center">状态</th>
        <th className="text-right">操作</th>
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id}>
          <td><input type="checkbox" checked={selected.includes(item.id)} /></td>
          <td>
            <div className="product-cell">
              <img src={item.image} alt="" />
              <div>
                <p className="product-name">{item.name}</p>
                <p className="product-sku">SKU: {item.sku}</p>
              </div>
            </div>
          </td>
          <td className="text-right">¥{item.price}</td>
          <td className="text-center">
            <Badge variant={item.status}>{item.statusText}</Badge>
          </td>
          <td className="text-right">
            <Button size="sm" variant="ghost">编辑</Button>
            <Button size="sm" variant="ghost" danger>删除</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

// 表格功能栏
<div className="table-toolbar">
  <div className="toolbar-left">
    <span>共 {total} 条</span>
    <Select placeholder="批量操作" />
  </div>
  <div className="toolbar-right">
    <Input.Search placeholder="搜索..." />
    <Select placeholder="筛选状态" />
    <Button type="primary">导出</Button>
  </div>
</div>

// 分页
<div className="pagination">
  <span>共 {total} 条</span>
  <div className="page-size">
    <select value={pageSize} onChange={...}>
      <option value={10}>10条/页</option>
      <option value={20}>20条/页</option>
      <option value={50}>50条/页</option>
    </select>
  </div>
  <div className="page-nav">
    <Button disabled={page === 1} onClick={...}>上一页</Button>
    <span>第 {page} / {totalPages} 页</span>
    <Button disabled={page === totalPages} onClick={...}>下一页</Button>
  </div>
</div>
```

### 2. 卡片列表

```tsx
// 商品卡片
<div className="product-grid">
  {products.map(product => (
    <div key={product.id} className="product-card">
      <div className="card-image">
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <span className="discount-tag">-{product.discount}%</span>
        )}
      </div>
      <div className="card-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-price">
          <span className="price-current">¥{product.price}</span>
          {product.originalPrice && (
            <span className="price-original">¥{product.originalPrice}</span>
          )}
        </div>
        <div className="card-actions">
          <Button type="primary" block>立即购买</Button>
        </div>
      </div>
    </div>
  ))}
</div>
```

### 3. 虚拟列表（大数据量）

```tsx
// 万级数据虚拟滚动
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="virtual-container">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            className="virtual-row"
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ListItem data={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 导航设计模式

### 1. 顶部导航

```tsx
// 标准顶部导航
<header className="top-nav">
  <div className="nav-container">
    <Logo />
    <nav className="nav-menu">
      <a href="/" className="nav-item active">首页</a>
      <a href="/products" className="nav-item">产品</a>
      <a href="/pricing" className="nav-item">价格</a>
      <a href="/docs" className="nav-item">文档</a>
    </nav>
    <div className="nav-actions">
      <Button variant="ghost">登录</Button>
      <Button type="primary">免费试用</Button>
    </div>
  </div>
</header>

// 滚动时变化的导航
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

<header className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
  {/* 滚动后添加背景和阴影 */}
</header>
```

### 2. 侧边导航

```tsx
// 带折叠的侧边导航
<div className="layout">
  <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <div className="sidebar-header">
      <Logo />
      <Button 
        icon={<MenuIcon />} 
        onClick={() => setCollapsed(!collapsed)}
      />
    </div>
    <nav className="sidebar-nav">
      {menuItems.map(item => (
        <Tooltip 
          key={item.key} 
          content={item.label}
          position="right"
          disabled={!collapsed}
        >
          <a 
            href={item.path}
            className={`nav-item ${activeKey === item.key ? 'active' : ''}`}
          >
            <Icon name={item.icon} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        </Tooltip>
      ))}
    </nav>
  </aside>
</div>
```

### 3. 面包屑

```tsx
// 标准面包屑
<nav className="breadcrumb" aria-label="面包屑">
  <ol>
    <li><a href="/">首页</a></li>
    <li><a href="/products">产品中心</a></li>
    <li><a href="/products/electronics">电子产品</a></li>
    <li aria-current="page">智能手机</li>
  </ol>
</nav>

// 带图标的
<nav className="breadcrumb">
  <ol>
    <li><HomeIcon /><a href="/">首页</a></li>
    <li><ChevronRightIcon /></li>
    <li><FolderIcon /><a href="/docs">文档</a></li>
    <li><ChevronRightIcon /></li>
    <li>当前页面</li>
  </ol>
</nav>
```

## 反馈设计模式

### 1. 消息提示

```tsx
// Toast 消息
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
}

// 使用示例
const showToast = (type: ToastType, message: string) => {
  // 实现 toast 逻辑
};

showToast('success', '保存成功！');
showToast('error', '网络错误，请重试');
showToast('warning', '内容已过期');
showToast('info', '新版本已发布');
```

### 2. 确认对话框

```tsx
// 删除确认
const ConfirmDialog = ({ 
  title, 
  content, 
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  danger = false
}) => (
  <div className="dialog-overlay">
    <div className="dialog">
      <h3 className="dialog-title">{title}</h3>
      <p className="dialog-content">{content}</p>
      <div className="dialog-actions">
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button 
          type={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  </div>
);

// 使用
<ConfirmDialog
  title="确认删除"
  content="删除后数据无法恢复，确定要删除吗？"
  confirmText="删除"
  danger
  onConfirm={handleDelete}
/>
```

### 3. 加载状态

```tsx
// 骨架屏（内容结构清晰时推荐）
const ArticleSkeleton = () => (
  <div className="skeleton">
    <div className="skeleton-header">
      <Skeleton.Avatar size="large" />
      <div className="skeleton-info">
        <Skeleton.Text width="40%" />
        <Skeleton.Text width="60%" />
      </div>
    </div>
    <div className="skeleton-body">
      <Skeleton.Text lines={3} />
    </div>
  </div>
);

// 按钮加载
<Button loading={isSubmitting}>
  {isSubmitting ? '提交中...' : '提交'}
</Button>

// 全局加载
<Spin tip="加载中..." size="large">
  <div className="content">
    {/* 需要加载的内容 */}
  </div>
</Spin>
```

### 4. 空状态

```tsx
// 空状态组件
const EmptyState = ({
  image,
  title,
  description,
  action
}) => (
  <div className="empty-state">
    {image && <div className="empty-image">{image}</div>}
    <h3 className="empty-title">{title}</h3>
    {description && (
      <p className="empty-description">{description}</p>
    )}
    {action && <div className="empty-action">{action}</div>}
  </div>
);

// 使用示例
<EmptyState
  image={<EmptyIcon />}
  title="暂无数据"
  description="还没有任何订单，去逛逛有什么喜欢的商品吧"
  action={<Button type="primary">去购物</Button>}
/>

// 搜索无结果
<EmptyState
  image={<SearchEmptyIcon />}
  title="未找到搜索结果"
  description={`没有找到与"${keyword}"相关的商品`}
  action={
    <div>
      <p>试试以下方式：</p>
      <ul>
        <li>检查拼写是否正确</li>
        <li>尝试使用更通用的关键词</li>
        <li>减少筛选条件</li>
      </ul>
    </div>
  }
/>
```

## 数据展示模式

### 1. 统计卡片

```tsx
// 数字统计卡片
const StatCard = ({ 
  title, 
  value, 
  trend, 
  trendValue,
  icon 
}) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-title">{title}</span>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
    <div className="stat-value">{value}</div>
    {trend && (
      <div className={`stat-trend ${trend}`}>
        {trend === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />}
        <span>{trendValue}</span>
        <span className="trend-period">较上周</span>
      </div>
    )}
  </div>
);

// 使用
<div className="stats-grid">
  <StatCard
    title="总销售额"
    value="¥128,888"
    trend="up"
    trendValue="12.5%"
    icon={<DollarIcon />}
  />
  <StatCard
    title="订单量"
    value="1,234"
    trend="up"
    trendValue="8.2%"
  />
</div>
```

### 2. 进度指示

```tsx
// 步骤条
const Stepper = ({ current, steps }) => (
  <div className="stepper">
    {steps.map((step, index) => (
      <div 
        key={index}
        className={`step ${index < current ? 'completed' : ''} 
                         ${index === current ? 'active' : ''}`}
      >
        <div className="step-indicator">
          {index < current ? <CheckIcon /> : index + 1}
        </div>
        <div className="step-content">
          <div className="step-title">{step.title}</div>
          {step.description && (
            <div className="step-desc">{step.description}</div>
          )}
        </div>
        {index < steps.length - 1 && <div className="step-line" />}
      </div>
    ))}
  </div>
);

// 环形进度
const CircleProgress = ({ percent, size = 120 }) => (
  <div className="circle-progress" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100">
      <circle
        className="progress-bg"
        cx="50" cy="50" r="45"
      />
      <circle
        className="progress-bar"
        cx="50" cy="50" r="45"
        strokeDasharray={`${percent * 2.83} 283`}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="progress-text">{percent}%</div>
  </div>
);
```

### 3. 标签筛选

```tsx
// 可选中标签组
const TagGroup = ({ tags, selected, onChange }) => (
  <div className="tag-group">
    {tags.map(tag => (
      <button
        key={tag.value}
        className={`tag ${selected.includes(tag.value) ? 'active' : ''}`}
        onClick={() => onChange(tag.value)}
      >
        {tag.label}
        {tag.count !== undefined && (
          <span className="tag-count">{tag.count}</span>
        )}
      </button>
    ))}
  </div>
);

// 使用
<TagGroup
  tags={[
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待处理', count: 10 },
    { value: 'processing', label: '处理中', count: 5 },
    { value: 'completed', label: '已完成' },
  ]}
  selected={selectedTags}
  onChange={setSelectedTags}
/>
```

## 操作反馈模式

### 1. 按钮状态

```tsx
// 按钮状态示例
<div className="button-states-demo">
  {/* 默认 */}
  <Button>默认按钮</Button>
  
  {/* 悬浮 */}
  <Button className="hover">悬浮状态</Button>
  
  {/* 点击中 */}
  <Button loading>操作进行中</Button>
  
  {/* 禁用 */}
  <Button disabled>禁用状态</Button>
  
  {/* 成功反馈 */}
  <Button success>
    <CheckIcon /> 保存成功
  </Button>
</div>
```

### 2. 操作进度

```tsx
// 上传进度
const UploadProgress = ({ file, progress, status }) => (
  <div className={`upload-item ${status}`}>
    <FileIcon type={file.type} />
    <div className="upload-info">
      <div className="upload-name">{file.name}</div>
      <div className="upload-progress">
        {status === 'uploading' && (
          <>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span>{progress}%</span>
          </>
        )}
        {status === 'success' && <span className="status-text">上传完成</span>}
        {status === 'error' && <span className="status-text error">上传失败</span>}
      </div>
    </div>
    {status === 'uploading' && (
      <Button size="sm" variant="ghost">取消</Button>
    )}
  </div>
);
```

### 3. 手势操作

```tsx
// 滑块删除
const SwipeToDelete = ({ children, onDelete }) => {
  const [offset, setOffset] = useState(0);
  const threshold = 80;

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - startX.current;
    setOffset(Math.max(0, deltaX));
  };

  const handleTouchEnd = () => {
    if (offset > threshold) {
      onDelete();
    }
    setOffset(0);
  };

  return (
    <div className="swipe-container">
      <div className="swipe-action">
        <DeleteIcon /> 删除
      </div>
      <div 
        className="swipe-content"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
```

## 搜索设计模式

### 1. 搜索框

```tsx
// 带建议的搜索
const SearchWithSuggestions = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchSuggestions(query).then(setSuggestions);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-container">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="搜索商品..."
        prefix={<SearchIcon />}
        suffix={
          query && (
            <ClearButton onClick={() => setQuery('')} />
          )
        }
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              className="suggestion-item"
              onClick={() => {
                setQuery(s.text);
                navigateTo(s.url);
              }}
            >
              <SearchIcon />
              <span>{s.text}</span>
              <span className="category">{s.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 2. 高级筛选

```tsx
// 筛选面板
const FilterPanel = ({ filters, onChange }) => (
  <div className="filter-panel">
    <div className="filter-section">
      <h4>价格区间</h4>
      <div className="price-range">
        <Input 
          type="number" 
          placeholder="最低价"
          onChange={(v) => onChange({ minPrice: v })}
        />
        <span>-</span>
        <Input 
          type="number" 
          placeholder="最高价"
          onChange={(v) => onChange({ maxPrice: v })}
        />
      </div>
    </div>
    
    <div className="filter-section">
      <h4>品牌</h4>
      <Checkbox.Group
        options={brands}
        onChange={(values) => onChange({ brands: values })}
      />
    </div>
    
    <div className="filter-section">
      <h4>评分</h4>
      <Radio.Group>
        <Radio value={5}>5星</Radio>
        <Radio value={4}>4星及以上</Radio>
        <Radio value={3}>3星及以上</Radio>
      </Radio.Group>
    </div>
    
    <div className="filter-actions">
      <Button onClick={() => onChange({})}>重置</Button>
      <Button type="primary" onClick={applyFilters}>应用</Button>
    </div>
  </div>
);
```

## 登录注册模式

### 1. 表单切换

```tsx
// 登录/注册切换
const AuthForm = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="auth-container">
      <Tabs
        activeKey={mode}
        onChange={(key) => setMode(key as 'login' | 'register')}
      >
        <TabPane key="login" tab="账号密码登录" />
        <TabPane key="register" tab="注册账号" />
      </Tabs>
      
      {mode === 'login' ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}
      
      <div className="auth-footer">
        <a href="/forgot">忘记密码？</a>
        <span>|</span>
        <a href="/help">帮助</a>
      </div>
    </div>
  );
};
```

### 2. 第三方登录

```tsx
// 第三方登录
<div className="social-login">
  <div className="divider">
    <span>其他登录方式</span>
  </div>
  <div className="social-buttons">
    <Button icon={<WechatIcon />} className="wechat">
      微信
    </Button>
    <Button icon={<QQIcon />} className="qq">
      QQ
    </Button>
    <Button icon={<GithubIcon />} className="github">
      GitHub
    </Button>
    <Button icon={<GoogleIcon />} className="google">
      Google
    </Button>
  </div>
</div>
```

## 移动端模式

### 1. 底部标签栏

```tsx
// 移动端底部导航
<nav className="tab-bar">
  <a href="/" className="tab-item active">
    <HomeIcon />
    <span>首页</span>
  </a>
  <a href="/category" className="tab-item">
    <CategoryIcon />
    <span>分类</span>
  </a>
  <a href="/cart" className="tab-item">
    <CartIcon />
    <span>购物车</span>
    <Badge count={cartCount} />
  </a>
  <a href="/user" className="tab-item">
    <UserIcon />
    <span>我的</span>
  </a>
</nav>
```

### 2. 滚动吸附

```tsx
// 移动端分类 + 内容布局
<div className="category-layout">
  <aside className="category-sidebar">
    {categories.map(cat => (
      <div 
        key={cat.id}
        className={`category-item ${activeId === cat.id ? 'active' : ''}`}
        onClick={() => {
          setActiveId(cat.id);
          scrollToContent(cat.id);
        }}
      >
        {cat.name}
      </div>
    ))}
  </aside>
  
  <main className="category-content">
    {categories.map(cat => (
      <section 
        key={cat.id}
        id={`category-${cat.id}`}
        ref={el => sectionRefs.current[cat.id] = el}
      >
        <h3>{cat.name}</h3>
        {/* 商品列表 */}
      </section>
    ))}
  </main>
</div>
```

---

## 登录注册设计模式（完整版）

### 1. 全屏沉浸式登录（推荐）

**适用场景：独立登录页、认证页**

```tsx
export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="auth-fullscreen">
      {/* 背景装饰 */}
      <div className="auth-bg" />
      
      {/* 内容区 */}
      <div className="auth-content">
        {/* Logo */}
        <div className="auth-logo">
          <Logo />
        </div>

        {/* Tab 切换 */}
        <div className="auth-tabs">
          <button
            className={cn('tab', mode === 'login' && 'active')}
            onClick={() => setMode('login')}
          >
            登录
          </button>
          <button
            className={cn('tab', mode === 'register' && 'active')}
            onClick={() => setMode('register')}
          >
            注册
          </button>
        </div>

        {/* 表单区 - 带过渡动画 */}
        <div className="auth-forms">
          <TransitionGroup mode="wait">
            {mode === 'login' ? (
              <LoginForm key="login" />
            ) : (
              <RegisterForm key="register" />
            )}
          </TransitionGroup>
        </div>

        {/* 第三方登录 */}
        <ThirdPartyLogin />

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
};
```

### 2. Tab 切换动画实现

**核心要点：切换时不能闪烁、跳动**

```tsx
// 方案 A：使用 framer-motion（推荐）
import { motion, AnimatePresence } from 'framer-motion';

const [activeTab, setActiveTab] = useState('login');

<div className="form-wrapper">
  <AnimatePresence mode="wait">
    <motion.form
      key={activeTab}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </motion.form>
  </AnimatePresence>
</div>

// 方案 B：CSS 实现（不使用动画库）
.form-wrapper {
  position: relative;
}

.form-wrapper > * {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 3. 登录表单组件

```tsx
const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功');
    } catch (error) {
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="auth-form"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input 
          prefix={<UserIcon />}
          placeholder="用户名 / 邮箱 / 手机号"
          size="large"
        />
      </Form.Item>

      <Form.Item name="password">
        <Input.Password 
          prefix={<LockIcon />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>

      <div className="form-options">
        <Checkbox>记住我</Checkbox>
        <a href="/forgot">忘记密码？</a>
      </div>

      <Button 
        type="primary" 
        htmlType="submit" 
        loading={loading}
        block
        size="large"
      >
        登录
      </Button>
    </Form>
  );
};
```

### 4. 注册表单组件

```tsx
const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    // 发送验证码逻辑
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Form
      layout="vertical"
      className="auth-form"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 20, message: '用户名 3-20 个字符' }
        ]}
      >
        <Input placeholder="用户名" size="large" />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[{ required: true, message: '请输入手机号' }]}
      >
        <Input 
          placeholder="手机号"
          size="large"
          addonBefore={<span>+86</span>}
        />
      </Form.Item>

      <Form.Item
        name="code"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <div className="code-input">
          <Input placeholder="验证码" size="large" />
          <Button 
            onClick={handleSendCode}
            disabled={countdown > 0}
            size="large"
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少 6 个字符' }
        ]}
      >
        <Input.Password placeholder="设置密码" size="large" />
      </Form.Item>

      <Button 
        type="primary" 
        htmlType="submit"
        loading={loading}
        block
        size="large"
      >
        注册
      </Button>
    </Form>
  );
};
```

### 5. 样式规范

```css
/* 全屏容器 */
.auth-fullscreen {
  min-height: 100vh;
  min-height: 100dvh;  /* 动态视口高度，移动端适配 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;   /* 禁止页面滚动 */
  padding: 24px;
}

/* 内容区 */
.auth-content {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Tab 切换 */
.auth-tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.auth-tabs .tab {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  padding: 12px 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.auth-tabs .tab:hover {
  color: var(--text-primary);
}

.auth-tabs .tab.active {
  color: var(--primary);
}

.auth-tabs .tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  animation: slideIn 0.2s ease-out;
}

/* 表单 */
.auth-form .ant-form-item {
  margin-bottom: 20px;
}

.auth-form .ant-input-affix-wrapper {
  padding: 12px 16px;
}

.auth-form .ant-input {
  font-size: 15px;
}

/* 第三方登录 */
.third-party-login {
  margin-top: 24px;
  text-align: center;
}

.third-party-login .divider {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 16px;
}

.third-party-login .buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 底部协议 */
.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--primary);
}

/* 动画 */
@keyframes slideIn {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### 6. 响应式适配

```css
/* 移动端调整 */
@media (max-width: 768px) {
  .auth-content {
    padding: 32px 24px;
    border-radius: 12px;
  }
  
  .auth-tabs {
    gap: 24px;
  }
  
  .auth-tabs .tab {
    font-size: 16px;
  }
}

/* 大屏幕调整 */
@media (min-width: 1200px) {
  .auth-content {
    padding: 48px 40px;
    max-width: 440px;
  }
}
```

### 7. 防止多余滚动

```tsx
// 登录页禁止滚动
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = '';
  };
}, []);
```

### 登录注册设计检查清单

```
□ 容器是否使用 min-height: 100vh / 100dvh？
□ 是否设置了 overflow: hidden 防止滚动？
□ Tab 切换是否有动画过渡？（不能闪烁、跳动）
□ 表单是否有正确的 padding？
□ 按钮是否有合适的尺寸（height ≥ 44px）？
□ 是否有适当的键盘适配（移动端）？
□ 错误提示是否清晰？
□ 加载状态是否有反馈？
□ 第三方登录是否提供？
□ 协议链接是否存在？
□ 忘记密码入口是否存在？
□ 是否支持回车提交？
□ Logo 是否居中？
□ 表单宽度是否合理（max-width: 400px）？
□ 是否考虑了长文本（如错误文案）？
```
