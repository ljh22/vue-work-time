# workTime

## 简介

`vite-work-time` 是一个基于 Vue 3、TypeScript 和 Element Plus 构建的工时统计小工具。它支持通过 JSON 数据模板导入考勤数据，并将原始打卡记录转换为可视化工时结果。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- dayjs
- pnpm

## 快速开始

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
# 启动开发环境
pnpm dev

# 运行类型检查
pnpm type-check

# 生产环境构建
pnpm build:prod

# 普通构建
pnpm build

# 预览构建结果
pnpm preview

# 分析打包体积
pnpm analyze

# 清理构建产物
pnpm clean
```

## 功能说明

- 导入考勤 JSON 数据，自动解析打卡记录
- 计算每日工时统计
- 支持按日期筛选和查看打卡明细
- 界面基于 Element Plus 组件库实现
- 已固定当前依赖版本，确保构建一致性

## 代码与构建优化

该项目已做以下优化：

- 生产环境启用压缩和代码混淆
- 自动移除 `console.log` 和 `debugger`
- 启用代码分割，减少首次加载体积
- 关闭生产 Source Map，减小构建体积
- 添加构建产物清理脚本
- 提供静态包分析命令

## 使用说明

1. 打开个人考勤页面，点击查看打卡数据。
2. 打开浏览器开发者工具（F12），切换到 `Network`，清空当前请求数据。
3. 选择 50 条数据，执行 `getLocSetDataByPage` 请求，切换到 `Response`。
4. 找到 `items` 数组，展开并复制该数组内容（是否带末尾逗号均可）。

## JSON 数据模板示例

以下示例为可直接复制的 JSON 数据模板：

```json
[
	{
		"dt": "2025-06-03",
		"deptName": "地球部门",
		"checktime": "2025-06-03 08:46:33",
		"locsetname": "多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）",
		"empName": "liuZong",
		"type": "1"
	},
	{
		"dt": "2025-06-03",
		"deptName": "地球部门",
		"checktime": "2025-06-03 18:08:44",
		"locsetname": "多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）",
		"empName": "liuZong",
		"type": "2"
	}
]
```

> 注意：实际数据请根据项目需求调整字段内容和数量。

## 说明与建议

- 如果要调试生产构建效果，可临时打开 Source Map。
- 定期运行 `pnpm analyze` 检查打包体积变化。
- 部署时建议配置服务器缓存和压缩（gzip / brotli）。

## 备注

本仓库依赖版本已固定为当前安装版本，避免因依赖版本更新导致的不一致问题。
