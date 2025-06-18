import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
// 判断选择月份是否超过当天月份
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
export default { isMonthExceed };
