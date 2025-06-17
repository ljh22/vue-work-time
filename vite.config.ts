import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
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
});
