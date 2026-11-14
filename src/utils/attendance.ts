import dayjs from 'dayjs';
import type { TableData, ProcessedData } from '@/types/TableData';

/**
 * 初步处理表格数据，把表格中相同日期的打卡记录合并为一条记录
 * 上班时间为8-12 13:30-17:30，早上弹性时间到9点
 * 工作日下午的17:30到18:00之间不算时间
 * @param tableData 表格数据
 * @returns 处理后的数据
 */
export const firstProcessingTableData = (
	tableData: TableData[],
	CalculationMethodType: number,
	holidayMap: Map<string, boolean> = new Map(),
): ProcessedData[] => {
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
		if (CalculationMethodType === 2) {
			// 周末只扣除实际落在午休时段（12:00–13:30）内的时间，不应用工作日的17:30规则。
			const lunchStart = clockInTime.hour(12).minute(0).second(0).millisecond(0);
			const lunchEnd = lunchStart.add(1.5, 'hour');
			const lunchOverlapStart = Math.max(clockInTime.valueOf(), lunchStart.valueOf());
			const lunchOverlapEnd = Math.min(clockOutTime.valueOf(), lunchEnd.valueOf());
			const lunchHours = Math.max(0, lunchOverlapEnd - lunchOverlapStart) / (60 * 60 * 1000);
			workHours = totalHours - lunchHours;
		} else {
			// 工作日规则：17:30–18:00不计入工时，午休扣除1.5小时。
			if (clockOutTime.hour() >= 17 && clockOutTime.hour() < 18) {
				const exceedHours = clockOutTime.diff(dayjs(clockOutTime).hour(17).minute(30), 'hour', true);
				workHours = totalHours - exceedHours - 1.5;
			} else {
				workHours = totalHours - 1.5 - 0.5;
			}
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
		// 调休上班日（isOffDay=false）即使落在周末，也按工作日纳入计算
		const isMakeUpWorkday = holidayMap.get(item.dt) === false;
		// 保留选择类型的日期、标记为法定节假日的日期，以及计算工作日模式下的调休上班日
		return isSelectedType || item.isHoliday || (CalculationMethodType === 1 && isMakeUpWorkday);
	});

	// 按日期排序
	processedData.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());

	// console.log('处理后的数据: ', processedData);
	return processedData;
};
