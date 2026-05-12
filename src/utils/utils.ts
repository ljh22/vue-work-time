import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import type { TableData, ProcessedData } from '@/types/TableData';
let calculatedData: ProcessedData[] = [];

// Gitee 仓库的 raw 文件地址
const VERSION_URL = 'https://api.jsonsilo.com/public/5d23800a-41c3-468b-9922-429ce6a96ced';

/**
 * 获取远程版本号
 * @returns Promise<string | null> 远程版本号，获取失败返回 null
 */
const getRemoteVersion = async (): Promise<string | null> => {
	// 开发环境下跳过版本检查（避免 CORS 问题）
	if (import.meta.env.DEV) {
		return null;
	}
	try {
		const response = await fetch(VERSION_URL, {
			method: 'GET',
			cache: 'no-cache',
		});
		if (!response.ok) {
			return null;
		}
		const data = await response.json();
		return data.version || null;
	} catch (error) {
		console.error('获取远程版本失败:', error);
		return null;
	}
};

/**
 * 检查插件版本是否需要更新（异步远程检查）
 * @returns Promise<{ needUpdate: boolean; remoteVersion: string | null }>
 */
const checkVersionUpdate = async (): Promise<{
	needUpdate: boolean;
	remoteVersion: string | null;
}> => {
	const remoteVersion = await getRemoteVersion();
	if (!remoteVersion) {
		return { needUpdate: false, remoteVersion };
	}

	const storedVersion = localStorage.getItem('pluginVersion');
	const needUpdate = storedVersion !== remoteVersion;

	if (needUpdate) {
		localStorage.setItem('pluginVersion', remoteVersion);
	}

	return { needUpdate, remoteVersion };
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
const firstProcessingTableData = (tableData: TableData[], CalculationMethodType: number): ProcessedData[] => {
	console.log('原始数据: ', tableData);

	// 按日期分组打卡记录
	const groupedByDate = tableData.reduce(
		(acc, record) => {
			if (!acc[record.dt]) {
				acc[record.dt] = [];
			}
			acc[record.dt].push(record);
			return acc;
		},
		{} as Record<string, TableData[]>,
	);

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
	let processedData: ProcessedData[] = Object.keys(groupedByDate).map(date => {
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

		// 检查是否有任何记录被标记为法定节假日
		const isHoliday = dayRecords.some(record => record.isHoliday);

		return {
			dt: date,
			validHours: workHours,
			beInDebtHours,
			empName: clockInRecord?.empName || clockOutRecord?.empName || '',
			checkInTime: clockInRecord?.checktime || '未打卡',
			checkOutTime: clockOutRecord?.checktime || '未打卡',
			isShowCheckInEdit: false,
			isShowCheckOutEdit: false,
			isNewlyAdded: clockInRecord?.isNewlyAdded || clockOutRecord?.isNewlyAdded || false,
			isHoliday,
		};
	});
	// 过滤数据：保留选择的计算类型对应的日期，以及标记为法定节假日的日期
	const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
	processedData = processedData.filter(item => {
		const date = dayjs(item.dt).toDate();
		const isSelectedType = CalculationMethodType === 1 ? !isWeekend(date) : isWeekend(date);
		// 保留选择类型的日期，或者标记为法定节假日的日期
		return isSelectedType || item.isHoliday;
	});

	// 按日期排序
	processedData.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());
	calculatedData = processedData;

	// console.log('处理后的数据: ', processedData);
	return processedData;
};
/**
 * 添加指定日期的打卡记录
 * @param date 指定日期
 * @param tableData 表格数据
 * @returns
 */
const addDate = (date: Date, tableData: TableData[]) => {
	const chooseDate = dayjs(date).format('YYYY-MM-DD');
	// 把tableData中符合chooseDate的按日期分组
	const groupedByDate = tableData.reduce(
		(acc, record) => {
			// 只处理与选择日期相同的记录
			if (record.dt === chooseDate) {
				if (!acc[record.dt]) {
					acc[record.dt] = [];
				}
				acc[record.dt].push(record);
			}
			return acc;
		},
		{} as Record<string, TableData[]>,
	);
	// 将分组后的数据转换为指定格式的对象
	if (Object.keys(groupedByDate).length > 0) {
		const dayRecords = groupedByDate[chooseDate];

		// 找到上班打卡记录 (type='1')
		const clockInRecord = dayRecords.find(record => record.type === '1');
		// 找到下班打卡记录 (type='2')
		const clockOutRecord = dayRecords.find(record => record.type === '2');

		let workHours = 0; // 有效工作小时数
		let beInDebtHours = 0; // 欠工小时数

		if (clockInRecord && clockOutRecord) {
			const clockInTime = dayjs(clockInRecord.checktime);
			const clockOutTime = dayjs(clockOutRecord.checktime);
			const totalHours = clockOutTime.diff(clockInTime, 'hour', true);

			// 判断clockOutTime下班时间是否在17:30到18:00之间
			if (clockOutTime.hour() >= 17 && clockOutTime.hour() < 18) {
				// 如果在这个区间，则计算出超出17:30到18:00的时间小时
				const exceedHours = clockOutTime.diff(dayjs(clockOutTime).hour(17).minute(30), 'hour', true);
				// 随后，从总小时数中减去超出的小时数和午休时间1.5小时，得到实际工作小时数
				workHours = totalHours - exceedHours - 1.5;
			} else {
				workHours = totalHours - 1.5 - 0.5;
			}
			beInDebtHours = 8 - workHours;
		}

		const processedRecord = {
			dt: chooseDate,
			validHours: workHours,
			beInDebtHours: beInDebtHours,
			empName: clockInRecord?.empName || clockOutRecord?.empName || '',
			checkInTime: clockInRecord?.checktime || '未打卡',
			checkOutTime: clockOutRecord?.checktime || '未打卡',
			isShowCheckInEdit: false,
			isShowCheckOutEdit: false,
		};
		calculatedData.push(processedRecord);
		return calculatedData.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());
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
export default { isMonthExceed, updateThemeColor, firstProcessingTableData, addDate, getComponentRoot, checkVersionUpdate, getRemoteVersion };
