import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [
				ElementPlusResolver({
					importStyle: 'sass',
				}),
			],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'), // 配置别名指向 src 目录
		},
	},
	// 构建优化配置
	build: {
		// 启用代码压缩
		minify: 'terser',
		terserOptions: {
			compress: {
				// 移除console
				drop_console: true,
				// 移除debugger
				drop_debugger: true,
				// 移除无用代码
				dead_code: true,
			},
			mangle: {
				// 混淆变量名
				toplevel: true,
			},
		},
		// 代码分割优化
		rollupOptions: {
			output: {
				// 分包策略
				manualChunks: {
					// 将Vue相关库打包到vendor chunk
					vue: ['vue'],
					// 将Element Plus相关库打包到element chunk
					element: ['element-plus', '@element-plus/icons-vue'],
					// 将dayjs打包到utils chunk
					utils: ['dayjs'],
				},
				// 文件名优化
				chunkFileNames: 'js/[name]-[hash].js',
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: assetInfo => {
					const fileName = assetInfo.name || 'unknown';
					const info = fileName.split('.');
					let extType = info[info.length - 1];
					if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(fileName)) {
						extType = 'media';
					} else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(fileName)) {
						extType = 'img';
					} else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(fileName)) {
						extType = 'fonts';
					}
					return `${extType}/[name]-[hash].[ext]`;
				},
			},
		},
		// 设置chunk大小警告限制
		chunkSizeWarningLimit: 1000,
		// 启用gzip压缩提示
		reportCompressedSize: true,
		// 构建输出目录
		outDir: 'dist',
		// 清空输出目录
		emptyOutDir: true,
		// 生成source map用于调试（生产环境可设为false）
		sourcemap: false,
	},
	css: {
		preprocessorOptions: {
			less: {
				additionalData: `@import "@/styles/variables.less";`, // 全局导入的Less变量
			},
			scss: {
				additionalData: `
					@use "@/styles/variables.sass" as *;
					@use "@/styles/element-variables.scss" as *;
				`,
			},
		},
	},
	// 开发服务器配置
	server: {
		// 开发服务器端口
		port: 3000,
		// 自动打开浏览器
		open: true,
	},
	// 预览服务器配置
	preview: {
		// 预览服务器端口
		port: 4173,
	},
});
