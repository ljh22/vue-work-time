# workTime

## <span style="color:red;">拉取优化后记得提交哈！！！！！</span>

## 安装依赖

```shell
pnpm install
```

### 介绍

计算工时小工具，网站中所用到的 JSON 数据模板，参考左侧目录的“JSON 数据模板”！

## 项目打包优化说明

### 已实施的优化措施

#### 1. 代码压缩优化

- 使用 Terser 进行 JavaScript 代码压缩
- 自动移除 console.log 和 debugger 语句
- 启用变量名混淆，减少代码体积
- 移除无用代码（dead code elimination）

#### 2. 代码分割优化

- **Vue 核心库**：单独打包到 `vue` chunk
- **Element Plus**：UI 组件库单独打包到 `element` chunk
- **工具库**：dayjs 等工具库打包到 `utils` chunk
- 按需加载，减少初始包体积

#### 3. 资源文件优化

- 图片资源使用外部 CDN 链接，避免打包到代码中
- 静态资源按类型分目录存放（js/css/img/fonts/media）
- 文件名添加 hash 值，支持长期缓存

#### 4. 构建配置优化

- 生产环境关闭 source map，减少包体积
- 启用 gzip 压缩提示
- 设置合理的 chunk 大小警告限制（1000KB）
- 自动清空输出目录

#### 5. 开发体验优化

- 开发和预览服务器启用 gzip 压缩
- 添加类型检查脚本
- 添加包分析脚本
- 添加清理脚本

### 构建脚本说明

```bash
# 开发环境启动
pnpm dev

# 生产环境构建
pnpm build:prod

# 普通构建
pnpm build

# 预览构建结果
pnpm preview

# 分析包体积
pnpm analyze

# 清理构建产物
pnpm clean

# 类型检查
pnpm type-check
```

### 优化效果预期

1. **包体积减少**：通过代码分割和压缩，预计可减少 30-50% 的包体积
2. **加载速度提升**：按需加载和缓存优化，首屏加载速度提升 20-40%
3. **缓存效率**：文件名 hash 化，提高浏览器缓存命中率
4. **代码质量**：移除调试代码，提高生产环境代码质量

### 注意事项

1. **调试代码**：生产环境会自动移除 console.log，开发时请注意
2. **Source Map**：生产环境已关闭，如需调试可临时开启
3. **依赖分析**：定期使用 `pnpm analyze` 检查包体积变化
4. **缓存策略**：部署时注意配置服务器缓存策略

### 进一步优化建议

1. **图片优化**：考虑使用 WebP 格式图片
2. **字体优化**：使用字体子集化技术
3. **预加载**：对关键资源启用 preload
4. **CDN 部署**：将静态资源部署到 CDN
5. **服务端压缩**：配置服务器 gzip/brotli 压缩

### 使用说明

**1. 打开个人考勤，点击查看打卡数据，随后打开控制台（快捷键 F12）点到 network 选项卡，清空请求数据**
|![输入图片说明](https://foruda.gitee.com/images/1711614780301895326/9c11fc4b_10888693.png '屏幕截图')|
|--|
|![输入图片说明](https://foruda.gitee.com/images/1751190497927676192/38c3991e_10888693.png '屏幕截图')|

**2.清空数据后，选择 50 条数据，点击 getLocSetDataByPage 请求，切换到 response**
|![输入图片说明](https://foruda.gitee.com/images/1751190501730420066/a6ddeb8e_10888693.png '屏幕截图')|
|--|
|![输入图片说明](https://foruda.gitee.com/images/1711615026549164653/9f871844_10888693.png '屏幕截图')|

**3.找到 items，点击左侧收起的小图标，之后复制这个数组带不带后面的逗号均可以**
|![输入图片说明](https://foruda.gitee.com/images/1711615092070250659/a95d1b2c_10888693.png '屏幕截图')|
|--|
|![输入图片说明](https://foruda.gitee.com/images/1711615148303292328/279ba83a_10888693.png '屏幕截图')|

#### JSON 数据模版

0.47 时间

```
[{"dt":"2025-06-03","deptName":"集成与使能交付部","checktime":"2025-06-03 08:46:33","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-03","deptName":"集成与使能交付部","checktime":"2025-06-03 18:08:44","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-04","deptName":"集成与使能交付部","checktime":"2025-06-04 08:51:30","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-04","deptName":"集成与使能交付部","checktime":"2025-06-04 19:34:40","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-05","deptName":"集成与使能交付部","checktime":"2025-06-05 08:40:48","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-05","deptName":"集成与使能交付部","checktime":"2025-06-05 20:17:49","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-06","deptName":"集成与使能交付部","checktime":"2025-06-06 08:42:20","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-06","deptName":"集成与使能交付部","checktime":"2025-06-06 19:22:05","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-07","deptName":"集成与使能交付部","checktime":"2025-06-07 11:15:28","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-07","deptName":"集成与使能交付部","checktime":"2025-06-07 14:34:50","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-09","deptName":"集成与使能交付部","checktime":"2025-06-09 08:46:27","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-09","deptName":"集成与使能交付部","checktime":"2025-06-09 17:48:40","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-10","deptName":"集成与使能交付部","checktime":"2025-06-10 08:56:58","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-10","deptName":"集成与使能交付部","checktime":"2025-06-10 21:36:03","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-11","deptName":"集成与使能交付部","checktime":"2025-06-11 08:50:13","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-11","deptName":"集成与使能交付部","checktime":"2025-06-11 17:37:45","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-12","deptName":"集成与使能交付部","checktime":"2025-06-12 08:54:40","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-12","deptName":"集成与使能交付部","checktime":"2025-06-12 17:35:49","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-13","deptName":"集成与使能交付部","checktime":"2025-06-13 08:50:18","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-13","deptName":"集成与使能交付部","checktime":"2025-06-13 17:35:47","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-16","deptName":"集成与使能交付部","checktime":"2025-06-16 08:50:47","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-16","deptName":"集成与使能交付部","checktime":"2025-06-16 17:50:31","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-17","deptName":"集成与使能交付部","checktime":"2025-06-17 08:50:12","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-17","deptName":"集成与使能交付部","checktime":"2025-06-17 18:20:02","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-18","deptName":"集成与使能交付部","checktime":"2025-06-18 08:50:06","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"},{"dt":"2025-06-18","deptName":"集成与使能交付部","checktime":"2025-06-18 17:57:22","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"2"},{"dt":"2025-06-19","deptName":"集成与使能交付部","checktime":"2025-06-19 08:41:20","locsetname":"多边形-陕西省西安市雁塔区云水一路3639号中软国际西安科技园（离岸）","empName":"liuZong","type":"1"}]
```
