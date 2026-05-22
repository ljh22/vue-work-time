# 工时计算工具

> 基于 Vue 3 + TypeScript + Element Plus 构建的工时统计工具，支持浏览器插件模式运行

## 功能简介

- 📊 **考勤数据解析**：导入 JSON 格式考勤数据，自动计算工时
- ⏰ **智能工时计算**：自动识别上下班打卡，计算有效工作时长
- 🔄 **版本更新提示**：插件模式下自动检测新版本并提示更新
- 🧩 **浏览器插件**：支持打包为 Chrome 扩展，便捷使用

## 技术栈

- Vue 3 + TypeScript
- Vite 6
- Element Plus
- dayjs
- pnpm

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 常用命令

| 命令                | 说明                       |
| ------------------- | -------------------------- |
| `pnpm dev`          | 启动开发环境               |
| `pnpm type-check`   | 运行 TypeScript 类型检查   |
| `pnpm build`        | 普通构建                   |
| `pnpm build:prod`   | 生产环境构建（含版本同步） |
| `pnpm preview`      | 预览构建结果               |
| `pnpm analyze`      | 分析打包体积               |
| `pnpm sync-version` | 同步版本号到所有配置文件   |

## 使用方式

### 方式一：浏览器插件（推荐）

1. 下载 `dist.zip` 压缩包
2. 解压到任意目录
3. 打开 Chrome → 扩展程序 → 开启开发者模式
4. 点击「加载已解压的扩展程序」，选择解压后的文件夹

### 方式二：直接访问

运行 `pnpm dev` 后，在浏览器中访问 `http://localhost:3000`

## 数据导入

1. 打开考勤页面，打开浏览器开发者工具（F12）
2. 在 Network 面板中找到 `getLocSetDataByPage` 请求
3. 复制 `Response` 中的 `items` 数组
4. 粘贴到工具的输入框中，点击解析

### JSON 数据格式

```json
// 1=上班，2=下班
[
	{
		"dt": "2025-06-03",
		"checktime": "2025-06-03 08:46:33",
		"empName": "张三",
		"type": "1"
	},
	{
		"dt": "2025-06-03",
		"checktime": "2025-06-03 18:08:44",
		"empName": "张三",
		"type": "2"
	}
]
```

## 版本管理

### 修改版本号

只需修改 `.env` 文件中的版本号：

```ini
VITE_APP_VERSION=1.0.9
```

构建时会自动同步到以下文件：

- `package.json`
- `public/manifest.json`
- `.env.production`

### 版本检测机制

- **插件模式**：检测页面右下角版本号与 localStorage 缓存对比，不一致时弹窗提示更新
- **网页模式**：不显示版本更新提示

## 常见问题

### Q: 修改代码后如何验证？

```bash
# 类型检查
pnpm type-check

# 构建验证
pnpm build:prod
```

### Q: 版本更新提示不显示？

确保是通过插件方式打开（不是直接访问网址），插件环境会自动检测 `chrome.runtime` 对象。

### Q: 如何发布新版本？

1. 修改 `.env` 中的 `VITE_APP_VERSION`
2. 运行 `pnpm build:prod`
3. 将生成的 `dist.zip` 上传到 Gitee

## 构建优化

- ✅ 生产环境启用代码压缩和混淆
- ✅ 自动移除 console.log 和 debugger
- ✅ 代码分割，按需加载
- ✅ 关闭生产环境 Source Map

## 目录结构

```
├── public/          # 静态资源（含插件配置）
├── src/
│   ├── components/  # 组件
│   ├── utils/       # 工具函数（版本检测等）
│   ├── types/       # TypeScript 类型定义
│   └── styles/      # 样式文件
├── scripts/         # 构建脚本
├── .env             # 开发环境配置
└── .env.production  # 生产环境配置
```

## License

MIT
