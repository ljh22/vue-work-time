import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/dist/index.css';
import '@/styles/variables.sass';
import '@/styles/global.css';
import utils from '@/utils/utils';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
dayjs.locale('zh-cn');
// 先创建应用实例
const app = createApp(App);

// 在应用实例上使用 ElementPlus 插件
app.use(ElementPlus, {
	locale: zhCn,
});
// 添加 dayjs 到全局属性
app.config.globalProperties.$dayjs = dayjs;
// 添加 utils 到全局属性
// 使用 provide 提供全局工具
app.provide('$utils', utils);

// 最后挂载应用
app.mount('#app');
