import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import { firstProcessingTableData } from './attendance';
import { CURRENT_VERSION } from './version';

/**
 * 获取当前版本号
 * @returns 当前版本号
 */
const getCurrentVersion = (): string => {
	return CURRENT_VERSION;
};

/**
 * 判断当前是否处于浏览器插件环境
 * 通过检测 chrome.runtime 对象是否存在来判断
 * @returns { boolean } 是否为插件环境
 */
const isPluginEnvironment = (): boolean => {
	const win = window as unknown as { chrome?: { runtime?: unknown } };
	return typeof win.chrome !== 'undefined' && typeof win.chrome.runtime !== 'undefined';
};

/**
 * 检查插件版本是否需要更新
 * 通过检测页面右下角版本号与缓存版本号是否一致来判断
 * 仅在插件环境下才进行版本检测
 * @returns { needUpdate: boolean; currentVersion: string }
 */
const checkVersionUpdate = (): {
	needUpdate: boolean;
	currentVersion: string;
} => {
	const currentVersion = getCurrentVersion();
	
	// 如果不是插件环境，直接返回不需要更新
	if (!isPluginEnvironment()) {
		return { needUpdate: false, currentVersion };
	}
	
	const storedVersion = localStorage.getItem('pluginVersion');
	const needUpdate = !storedVersion || storedVersion !== currentVersion;

	return { needUpdate, currentVersion };
};

/**
 * 标记用户已确认当前版本
 * @param version 需要确认的版本号
 */
const confirmVersion = (version: string): void => {
	localStorage.setItem('pluginVersion', version);
};
/**
 * 判断选择月份是否超过当前月份
 * @param selectMonth 选择月份
 * @returns boolean 如果选择的月份大于当前月份，则返回true
 * @description 如果选择的月份大于当前月份，则返回true并显示警告消息
 */
const isMonthExceed = (selectMonth: Date) => {
	const todayMonth = dayjs(new Date()).format('M');
	const selectedMonth = dayjs(selectMonth).format('M');
	if (selectedMonth > todayMonth) {
		ElMessage({
			message: '不能选择未来的月份',
			type: 'warning',
		});
		return true;
	}
	return false;
};

/**
 * 更新CSS自定义属性以改变主题色，并生成各种变体颜色
 * @param newColor 新的主题色
 * @description 更新CSS自定义属性以改变主题色，并生成各种变体颜色
 */
const updateThemeColor = (newColor: string) => {
	// 更新CSS自定义属性
	document.documentElement.style.setProperty('--el-color-primary', newColor);

	// 生成主题色的各种变体（浅色、深色等）
	const generateColorVariants = (baseColor: string) => {
		const hex = baseColor.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		// 设置 RGB 变量，有些组件需要
		document.documentElement.style.setProperty('--el-color-primary-rgb', `${r}, ${g}, ${b}`);

		// 生成浅色变体 light-1 到 light-9
		// Element Plus 规范: light-3 用于 hover, light-5 用于 active, light-9 最浅
		// 这里的 i 代表混合白色百分比的 1/10
		for (let i = 1; i <= 9; i++) {
			const ratio = i / 10;
			const lightR = Math.round(r + (255 - r) * ratio);
			const lightG = Math.round(g + (255 - g) * ratio);
			const lightB = Math.round(b + (255 - b) * ratio);
			const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
			document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, lightColor);
		}

		// 生成深色变体 dark-2
		const darkR = Math.round(r * 0.8);
		const darkG = Math.round(g * 0.8);
		const darkB = Math.round(b * 0.8);
		const darkColor = `rgb(${darkR}, ${darkG}, ${darkB})`;
		document.documentElement.style.setProperty('--el-color-primary-dark-2', darkColor);
	};

	if (newColor.startsWith('#') && newColor.length === 7) {
		generateColorVariants(newColor);
	}
};
/**
 * 获取组件根DOM的方法
 * @param compRef  组件引用
 * @returns  组件根DOM元素
 */
const getComponentRoot = (compRef: any) => {
	return compRef.value?.$el ?? compRef.value;
};

/**
 * 获取图标组件
 * @param name 图标名称
 * @returns 图标组件
 */
const getIcon = (name: string) => {
	return (Icons as any)[name];
};

export default { isMonthExceed, updateThemeColor, firstProcessingTableData, getComponentRoot, checkVersionUpdate, getCurrentVersion, confirmVersion, getIcon };
