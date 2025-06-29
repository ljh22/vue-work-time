import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import type { TableData, ProcessedData } from '@/types/TableData';

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
/**
 * 初步处理表格数据，把表格中相同日期的打卡记录合并为一条记录
 * 上班时间为8-12 13:30-17:30，早上弹性时间到9点
 * 工作日下午的17:30到18:00之间不算时间
 * @param tableData 表格数据
 * @returns 处理后的数据
 */
const firstProcessingTableData = (tableData: TableData[]): ProcessedData[] => {
	console.log('原始数据: ', tableData);

	// 按日期分组打卡记录
	const groupedByDate = tableData.reduce((acc, record) => {
		if (!acc[record.dt]) {
			acc[record.dt] = [];
		}
		acc[record.dt].push(record);
		return acc;
	}, {} as Record<string, TableData[]>);

	// 检查每个日期是否缺少下班打卡记录，如果缺少则添加虚拟下班打卡
	Object.keys(groupedByDate).forEach(date => {
		const dayRecords = groupedByDate[date];
		const hasClockIn = dayRecords.some(record => record.type === '1');
		const hasClockOut = dayRecords.some(record => record.type === '2');

		// 如果有上班打卡但没有下班打卡，则添加虚拟下班打卡记录
		if (hasClockIn && !hasClockOut) {
			const clockInRecord = dayRecords.find(record => record.type === '1');
			if (clockInRecord) {
				const clockInRecordTime = clockInRecord.checktime;
				// 在clockInRecordTime的基础上加8小时作为下班打卡时间，需要算上午休时间12-13:30和下午休息时间17:30-18:00
				const noonTime = 1.5; // 上午休息时间1.5小时
				const afternoonTime = 0.5; // 下午休息时间0.5小时
				const clockOutTime = dayjs(clockInRecordTime)
					.add(8 + noonTime + afternoonTime, 'hour')
					.format('YYYY-MM-DD HH:mm:ss');
				groupedByDate[date].push({
					...clockInRecord,
					checktime: clockOutTime,
					type: '2',
				});
			}
		}
	});

	// 处理每一天的打卡记录
	const processedData: ProcessedData[] = Object.keys(groupedByDate).map(date => {
		const dayRecords = groupedByDate[date];

		// 找到上班打卡记录 (type='1')
		const clockInRecord = dayRecords.find(record => record.type === '1');
		// 找到下班打卡记录 (type='2')
		const clockOutRecord = dayRecords.find(record => record.type === '2');

		let workHours = 0; // 有效工作小时数
		let beInDebtHours = 0; // 欠工小时数
		const clockInTime = dayjs(clockInRecord!.checktime);
		const clockOutTime = dayjs(clockOutRecord!.checktime);
		const totalHours = clockOutTime.diff(clockInTime, 'hour', true);
		// 判断clockOutTime下班时间是否在17:30到18:00之间
		if (clockOutTime.hour() >= 17 && clockOutTime.hour() < 18) {
			// 如果在这个区间，则计算出超出17：:30到18：00的时间小时
			const exceedHours = clockOutTime.diff(dayjs(clockOutTime).hour(17).minute(30), 'hour', true);
			// 随后，从总小时数中减去超出的小时数和午休时间1.5小时，得到实际工作小时数
			workHours = totalHours - exceedHours - 1.5;
		} else {
			workHours = totalHours - 1.5 - 0.5;
		}
		beInDebtHours = 8 - workHours;

		return {
			dt: date,
			validHours: workHours,
			beInDebtHours,
			empName: clockInRecord?.empName || clockOutRecord?.empName || '',
			checkInTime: clockInRecord?.checktime || '未打卡',
			checkOutTime: clockOutRecord?.checktime || '未打卡',
			isShowCheckInEdit: false,
			isShowCheckOutEdit: false,
		};
	});
	// 排除周末的数据
	processedData.forEach((item, index) => {
		const date = dayjs(item.dt).toDate();
		if (date.getDay() === 0 || date.getDay() === 6) {
			processedData.splice(index, 1);
		}
	});

	// 按日期排序
	processedData.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());

	console.log('处理后的数据: ', processedData);
	return processedData;
};
export default { isMonthExceed, updateThemeColor, firstProcessingTableData };
