import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
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
		// 简单的颜色变体生成逻辑
		const hex = baseColor.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		// 生成浅色变体
		for (let i = 1; i <= 9; i++) {
			const alpha = i / 10;
			const lightR = Math.round(r + (255 - r) * (1 - alpha));
			const lightG = Math.round(g + (255 - g) * (1 - alpha));
			const lightB = Math.round(b + (255 - b) * (1 - alpha));
			const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
			document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, lightColor);
		}

		// 生成深色变体
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
export default { isMonthExceed, updateThemeColor };
