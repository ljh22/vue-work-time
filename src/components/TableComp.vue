<template>
	<div class="table-container">
		<div class="summary-cards">
			<el-card shadow="never" class="summary-card">
				<div class="label">本月总工时</div>
				<div class="value">{{ allHours }} <span class="unit">小时</span></div>
			</el-card>
			<el-card shadow="never" class="summary-card">
				<div class="label">日平均工时</div>
				<div class="value">{{ averageHours }} <span class="unit">小时</span></div>
			</el-card>
			<el-card shadow="never" class="summary-card highlight" v-if="beInDebtHours > 0">
				<div class="label">还差工时</div>
				<div class="value danger">{{ beInDebtHours }} <span class="unit">小时</span></div>
			</el-card>
			<el-card shadow="never" class="summary-card success" v-else>
				<div class="label">工时超出</div>
				<div class="value">{{ Math.abs(beInDebtHours) }} <span class="unit">小时</span></div>
			</el-card>
		</div>

		<el-table
			:data="tableData"
			style="width: 100%"
			stripe
			border
			show-summary
			:highlight-current-row="true"
			:header-cell-style="{ backgroundColor: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)', fontWeight: 'bold', textAlign: 'center' }"
			:cell-style="{ textAlign: 'center' }"
			:summary-method="getSummaries"
			@header-dragend="handleHeaderDragend"
			class="custom-table"
		>
			<el-table-column prop="empName" label="姓名" width="120" />
			<el-table-column prop="dt" label="日期" width="140" sortable />
			<el-table-column prop="validHours" label="有效工时" width="120">
				<template #default="scope">
					<el-tag :type="Number(customRound(scope.row.validHours)) >= 8 ? 'success' : 'danger'" effect="plain">
						{{ customRound(scope.row.validHours) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="上班打卡时间" min-width="180">
				<template #default="scope">
					<div class="edit-cell">
						<el-input
							v-model="scope.row.checkInTime"
							v-if="scope.row.isShowCheckInEdit"
							size="small"
							@blur="handleCheckInBlur(scope.row)"
							@keydown.enter="handleCheckInEnter(scope.row, $event)"
							ref="checkInInputRef"
						/>
						<div class="display-box" v-else @click="handleShowCheckInTimeEdit(scope.row)">
							<span>{{ scope.row.checkInTime }}</span>
							<el-icon class="edit-icon"><Edit /></el-icon>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="下班打卡时间" min-width="180">
				<template #default="scope">
					<div class="edit-cell">
						<el-input
							v-model="scope.row.checkOutTime"
							v-if="scope.row.isShowCheckOutEdit"
							size="small"
							@blur="handleCheckOutBlur(scope.row)"
							@keydown.enter="handleCheckOutEnter(scope.row, $event)"
							ref="checkOutInputRef"
						/>
						<div class="display-box" v-else @click="handleShowCheckOutTimeEdit(scope.row)">
							<span>{{ scope.row.checkOutTime }}</span>
							<el-icon class="edit-icon"><Edit /></el-icon>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="beInDebtHours" label="所欠工时" width="120" sortable>
				<template #default="scope">
					<el-tag :type="Number(customRound(scope.row.beInDebtHours)) <= 0 ? 'success' : 'danger'" effect="light">
						{{ customRound(scope.row.beInDebtHours) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template #default="scope">
					<div v-if="isLastRow(scope.$index)" class="action-buttons">
						<el-tooltip content="新增一条工时记录" placement="top" effect="light">
							<el-button
								type="primary"
								:icon="Plus"
								circle
								size="small"
								@click="handleAddNewRecord"
							/>
						</el-tooltip>
						<el-tooltip v-if="scope.row.isNewlyAdded" content="删除此条工时记录" placement="top" effect="light">
							<el-button
								type="danger"
								:icon="Minus"
								circle
								size="small"
								@click="handleDeleteRecord(scope.row)"
							/>
						</el-tooltip>
					</div>
					<span v-else class="empty-placeholder">--</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script lang="ts">
	export default {
		name: 'TableComp',
	};
</script>
<script setup lang="ts">
	import type { TableData, ProcessedData } from '@/types/TableData';
	import { ref, watch, inject, h, nextTick } from 'vue';
	import type { VNode } from 'vue';
	import type { TableColumnCtx } from 'element-plus';
	import type { Utils } from '@/types/utils';
	import { Edit, Plus, Minus } from '@element-plus/icons-vue';
	import { ElMessage, ElTooltip } from 'element-plus';
	import dayjs from 'dayjs';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

	// 判断是否是最后一行
	const isLastRow = (index: number): boolean => {
		return index === tableData.value.length - 1;
	};

	const props = defineProps({
		showTableInitData: {
			type: Array as () => Array<TableData>,
			default: () => [],
		},
		showTableDataNew: {
			type: Array as () => Array<ProcessedData>,
			default: () => [],
		},
		CalculationMethodType: {
			type: Number,
			default: -1,
		},
	});

	const emit = defineEmits<{
		'update-data': [data: TableData[]];
	}>();
	const tableData = ref<ProcessedData[]>([]);
	const allHours = ref<number>(0); // 总工时
	const averageHours = ref<number>(0); // 平均工时
	const beInDebtHours = ref<number>(0); // 所欠工时
	const checkInInputRef = ref<any>(null);
	const checkOutInputRef = ref<any>(null);
	const isHaveNewProcessedData = ref<boolean>(false); // 是否有新的处理数据
	const fullTableData = ref<TableData[]>([]); // 保存完整数据（包括添加的法定节假日）

	// 验证时间格式是否正确
	const validateTimeFormat = (timeStr: string): boolean => {
		// 检查格式是否为 YYYY-MM-DD HH:MM:SS
		const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
		if (!timeRegex.test(timeStr)) {
			return false;
		}

		// 提取时间部分进行详细验证
		const timePart = timeStr.slice(11); // 获取 HH:MM:SS 部分
		const [hours, minutes, seconds] = timePart.split(':').map(Number);

		// 验证时分秒的范围
		if (hours < 0 || hours > 23) return false;
		if (minutes < 0 || minutes > 59) return false;
		if (seconds < 0 || seconds > 59) return false;

		// 验证是否为有效数字（排除NaN）
		if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return false;

		return true;
	};

	// 恢复原始时间的辅助函数
	const restoreOriginalTime = (row: ProcessedData, originalTime: string, isCheckIn: boolean = true): void => {
		if (isCheckIn) {
			row.checkInTime = originalTime;
		} else {
			row.checkOutTime = originalTime;
		}
	};

	watch(
		[() => props.showTableInitData, () => props.CalculationMethodType],
		([newData, newType]) => {
			// 始终根据原始数据重新计算，确保编辑后的数据能正确更新
			const processedData: ProcessedData[] = utils.firstProcessingTableData(newData, newType);
			tableData.value = processedData;
			fullTableData.value = [...newData];
			isHaveNewProcessedData.value = props.showTableDataNew.length > 0;
		},
		{ deep: true, immediate: true },
	);
	// 上班时间输入框失去焦点事件
	const handleCheckInBlur = (row: ProcessedData) => {
		row.isShowCheckInEdit = false;
		const changedCheckInTime = row.checkInTime;

		// 从原始数据中获取真正的原始时间用于恢复
		const originalCheckInRecord = props.showTableInitData.find(item => item.dt === row.dt && item.type === '1');
		const originalCheckInTime = originalCheckInRecord ? originalCheckInRecord.checktime : `${row.dt} 09:00:00`;
		// 验证时间格式
		if (!validateTimeFormat(changedCheckInTime)) {
			ElMessage.error('时间格式不正确，请输入正确的时间格式（HH:MM:SS）');
			restoreOriginalTime(row, originalCheckInTime!, true);
			return;
		}

		const modificationDateStr = changedCheckInTime.slice(0, 10);
		const originalDateStr = row.dt;

		// 检查是否修改了日期，如果修改了日期则不允许修改，恢复原始时间
		if (modificationDateStr !== originalDateStr) {
			ElMessage.error('不允许修改日期，请重新修改上班时间');
			// 恢复原始时间（保持原日期，只使用修改后的时间部分）
			const originalTime = changedCheckInTime.slice(11); // 获取时间部分 HH:mm:ss
			row.checkInTime = `${originalDateStr} ${originalTime}`;
			return;
		}

		let tempTableData = [...props.showTableInitData];
		let index = tempTableData.findIndex(item => item.dt === modificationDateStr && item.type === '1');

		// 如果找不到对应的上班打卡记录，创建一个新的
		if (index === -1) {
			// 创建新的上班打卡记录
			const newCheckInRecord = {
				dt: modificationDateStr,
				checktime: changedCheckInTime,
				empName: row.empName,
				type: '1',
			};
			tempTableData.push(newCheckInRecord);
		} else {
			// 修改现有的上班打卡记录
			tempTableData[index].checktime = changedCheckInTime;
		}

		// 向父组件发射更新事件，watch会自动重新计算数据
		emit('update-data', tempTableData);
	};

	// 下班时间输入框失去焦点事件
	const handleCheckOutBlur = (row: ProcessedData) => {
		row.isShowCheckOutEdit = false;
		const changedCheckOutTime = row.checkOutTime;

		// 从原始数据中获取真正的原始时间用于恢复
		const originalCheckOutRecord = props.showTableInitData.find(item => item.dt === row.dt && item.type === '2');
		const originalCheckOutTime = originalCheckOutRecord ? originalCheckOutRecord.checktime : `${row.dt} 18:00:00`;
		// 验证时间格式
		if (!validateTimeFormat(changedCheckOutTime)) {
			ElMessage.error('时间格式不正确，请输入正确的时间格式（HH:MM:SS）');
			restoreOriginalTime(row, originalCheckOutTime!, false);
			return;
		}

		const modificationDateStr = changedCheckOutTime.slice(0, 10);
		const originalDateStr = row.dt;

		// 检查是否修改了日期，如果修改了日期则不允许修改，恢复原始时间
		if (modificationDateStr !== originalDateStr) {
			ElMessage.error('不允许修改日期，请重新修改下班时间');
			// 恢复原始时间（保持原日期，只使用修改后的时间部分）
			const originalTime = changedCheckOutTime.slice(11); // 获取时间部分 HH:mm:ss
			row.checkOutTime = `${originalDateStr} ${originalTime}`;
			return;
		}

		let tempTableData = [...props.showTableInitData];
		let index = tempTableData.findIndex(item => item.dt === modificationDateStr && item.type === '2');

		// 如果找不到对应的下班打卡记录，创建一个新的
		if (index === -1) {
			// 创建新的下班打卡记录
			const newCheckOutRecord = {
				dt: modificationDateStr,
				checktime: changedCheckOutTime,
				empName: row.empName,
				type: '2',
			};
			tempTableData.push(newCheckOutRecord);
		} else {
			// 修改现有的下班打卡记录
			tempTableData[index].checktime = changedCheckOutTime;
		}

		// 向父组件发射更新事件，watch会自动重新计算数据
		emit('update-data', tempTableData);
	};

	const handleCheckInEnter = (_row: ProcessedData, event: KeyboardEvent) => {
		const target = event.target as HTMLElement | null;
		if (target && typeof target.blur === 'function') {
			target.blur();
		}
	};

	const handleCheckOutEnter = (_row: ProcessedData, event: KeyboardEvent) => {
		const target = event.target as HTMLElement | null;
		if (target && typeof target.blur === 'function') {
			target.blur();
		}
	};

	// 显示上班时间编辑框
	const handleShowCheckInTimeEdit = (row: ProcessedData) => {
		// 关闭其他编辑状态
		tableData.value.forEach(item => {
			item.isShowCheckInEdit = false;
			item.isShowCheckOutEdit = false;
		});

		row.isShowCheckInEdit = true;
		// 使用nextTick确保DOM更新后再聚焦
		nextTick(() => {
			// 查找当前行的上班时间输入框并聚焦
			const inputElements = document.querySelectorAll('.el-table .el-input__inner');
			if (inputElements.length > 0) {
				(inputElements[0] as HTMLInputElement).focus();
			}
		});
	};

	// 显示下班时间编辑框
	const handleShowCheckOutTimeEdit = (row: ProcessedData) => {
		// 关闭其他编辑状态
		tableData.value.forEach(item => {
			item.isShowCheckInEdit = false;
			item.isShowCheckOutEdit = false;
		});

		row.isShowCheckOutEdit = true;
		// 使用nextTick确保DOM更新后再聚焦
		nextTick(() => {
			// 查找当前行的下班时间输入框并聚焦
			const inputElements = document.querySelectorAll('.el-table .el-input__inner');
			if (inputElements.length > 0) {
				(inputElements[0] as HTMLInputElement).focus();
			}
		});
	};
	interface Product {
		empName: string;
		dt: string;
		validHours: number;
		[key: string]: any;
	}
	interface SummaryMethodProps<T = Product> {
		columns: TableColumnCtx<T>[];
		data: T[];
	}
	// 合计行
	const getSummaries = (param: SummaryMethodProps) => {
		const { columns, data } = param;
		const sums: (string | VNode)[] = [];
		columns.forEach((column, index) => {
			switch (index) {
				case 0:
					sums[index] = h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, ['合计']);
					break;
				case 1:
					sums[index] = h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, [`${data.length} 天`]);
					break;
				case 2:
					const validHours = data.map(item => Number(item[column.property]));
					if (!validHours.every(value => isNaN(value))) {
						const totalHours = validHours.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) return prev + curr;
							else return prev;
						}, 0);
						sums[index] = h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, [
							`${Math.round(totalHours * 100) / 100} 小时`,
						]);
						allHours.value = Math.round(totalHours * 100) / 100;
						averageHours.value = Math.round((totalHours / data.length) * 100) / 100;
					}
					break;
				case 5:
					const beInDebtHoursArr = data.map(item => Number(item[column.property]));
					if (!beInDebtHoursArr.every(value => isNaN(value))) {
						const totalHours = beInDebtHoursArr.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) return prev + curr;
							else return prev;
						}, 0);

						const roundedValue = customRound(totalHours);
						const displayText = `${roundedValue} 小时`;

						// 使用 el-tooltip 包裹显示内容
						sums[index] = h(
							ElTooltip,
							{
								content: '负数代表工时超出，正数代表欠工时',
								placement: 'top',
								effect: 'light',
							},
							{
								default: () => h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, [displayText]),
							},
						);

						beInDebtHours.value = Number(roundedValue);
					}
					break;
				default:
					sums[index] = h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, ['--']);
					break;
			}
		});

		return sums;
	};
	// 自定义四舍五入函数
	const customRound = (num: number) => {
		if (typeof num !== 'number' || isNaN(num)) {
			return 'Invalid input';
		}

		// 处理负数：转换为正数处理后再加回负号
		const isNegative = num < 0;
		const absNum = Math.abs(num);

		// 计算整数部分
		const n = Math.floor(absNum);
		const remainder = absNum - n;

		// 检查是否在特殊进位区间 [n + 0.98, n + 1)
		if (remainder >= 0.98 && remainder < 1) {
			return (isNegative ? '-' : '') + (n + 1).toFixed(2);
		}

		// 将数字转为字符串检查小数部分
		const numStr = absNum.toString();
		const decimalIndex = numStr.indexOf('.');

		// 无小数部分时直接返回
		if (decimalIndex === -1) {
			return (isNegative ? '-' : '') + absNum.toFixed(2);
		}

		// 提取小数部分并检查第三位及之后是否有非零数字
		const decimals = numStr.slice(decimalIndex + 1);
		let hasNonZeroBeyondSecond = false;

		if (decimals.length > 2) {
			for (let i = 2; i < decimals.length; i++) {
				if (decimals[i] !== '0') {
					hasNonZeroBeyondSecond = true;
					break;
				}
			}
		}

		// 根据检测结果处理数字
		let result;
		if (hasNonZeroBeyondSecond) {
			// 加0.01进位后四舍五入
			result = (absNum + 0.01).toFixed(2);
		} else {
			// 直接四舍五入
			result = absNum.toFixed(2);
		}

		return (isNegative ? '-' : '') + result;
	};
	const handleHeaderDragend = (newWidth: number, _oldWidth: number, column: any, _event: MouseEvent) => {
		const minWidth = column.minWidth || 120;
		if (newWidth <= minWidth) {
			column.width = minWidth;
		}
	};

	// 计算下一个工作日的日期
	// 如果已有数据，基于最后日期计算；否则基于今天计算
	const calculateNextWorkDay = (baseDate?: string): string => {
		// 如果有基础日期，使用基础日期；否则使用今天
		const startDate = baseDate ? dayjs(baseDate) : dayjs();
		const tomorrow = startDate.add(1, 'day');
		const dayOfWeek = tomorrow.day(); // 0=周日, 6=周六

		// 如果明天是周六(6)或周日(0)，则跳到下周一
		let targetDate = tomorrow;
		if (dayOfWeek === 6) {
			// 周六，跳到下周一（加2天）
			targetDate = startDate.add(3, 'day');
		} else if (dayOfWeek === 0) {
			// 周日，跳到下周一（加1天）
			targetDate = startDate.add(2, 'day');
		}

		return targetDate.format('YYYY-MM-DD');
	};

	// 获取现有数据的月份（用于跨月检查）
	const getDataMonth = (): string | null => {
		if (props.showTableInitData.length === 0) {
			return null;
		}
		// 获取第一条数据的月份
		const firstDate = props.showTableInitData[0].dt;
		return dayjs(firstDate).format('YYYY-MM');
	};

	// 删除工时记录
	const handleDeleteRecord = (row: ProcessedData) => {
		// 从原始数据中移除该日期的所有记录
		const newTableData = props.showTableInitData.filter(item => item.dt !== row.dt);

		// 触发更新，重新处理数据
		emit('update-data', newTableData);
		ElMessage.success(`已删除 ${row.dt} 的工时记录`);
	};

	// 新增工时记录
	const handleAddNewRecord = () => {
		if (props.showTableInitData.length === 0) {
			ElMessage.warning('请先解析数据');
			return;
		}

		// 获取现有数据的月份
		const dataMonth = getDataMonth();
		if (!dataMonth) {
			ElMessage.warning('无法获取数据月份');
			return;
		}

		// 找到已有数据中的最后日期（去重后排序）
		const uniqueDates = [...new Set(props.showTableInitData.map(item => item.dt))].sort();
		const lastDate = uniqueDates[uniqueDates.length - 1];

		// 基于最后日期计算下一个工作日
		const targetDate = calculateNextWorkDay(lastDate);

		// 检查新增日期是否跨月
		const targetMonth = dayjs(targetDate).format('YYYY-MM');
		if (targetMonth !== dataMonth) {
			ElMessage.error(
				`新增日期 ${targetDate} 跨月了！只支持当月新增数据，当前数据月份为 ${dataMonth}，无法新增跨月数据`,
			);
			return;
		}

		// 检查该日期是否已存在
		const dateExists = props.showTableInitData.some(item => item.dt === targetDate);
		if (dateExists) {
			ElMessage.warning(`日期 ${targetDate} 已存在，请手动添加其他日期`);
			return;
		}

		// 从现有数据中获取员工信息（使用第一条记录的信息）
		const firstRecord = props.showTableInitData[0];
		const empName = firstRecord.empName || '';
		const deptName = firstRecord.deptName || '';
		const locsetname = firstRecord.locsetname || '';
		const empId = firstRecord.empId || '';
		const emp_code = firstRecord.emp_code || firstRecord.empCode || '';

		// 创建上班打卡记录
		const checkInRecord: TableData = {
			dt: targetDate,
			checktime: `${targetDate} 08:00:00`,
			type: '1',
			empName: empName,
			deptName: deptName,
			locsetname: locsetname,
			empId: empId,
			emp_code: emp_code,
			isNewlyAdded: true,
		};

		// 创建下班打卡记录
		const checkOutRecord: TableData = {
			dt: targetDate,
			checktime: `${targetDate} 17:30:00`,
			type: '2',
			empName: empName,
			deptName: deptName,
			locsetname: locsetname,
			empId: empId,
			emp_code: emp_code,
			isNewlyAdded: true,
		};

		// 添加到原始数据中
		const newTableData = [...props.showTableInitData, checkInRecord, checkOutRecord];

		// 触发更新，重新处理数据
		emit('update-data', newTableData);
		ElMessage.success(`已新增 ${targetDate} 的工时记录`);
	};
</script>

<style scoped lang="scss">
	.table-container {
		margin-top: 6px;
	}

	.summary-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 14px;
		margin-bottom: 24px;

		.summary-card {
			border-radius: 12px;
			border: 1px solid var(--el-border-color-light);
			transition: all 0.3s;
			background: linear-gradient(180deg, var(--app-surface-solid), var(--el-fill-color-light));

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 24px var(--app-shadow-color);
			}

			.label {
				font-size: 14px;
				color: var(--el-text-color-secondary);
				margin-bottom: 8px;
			}

			.value {
				font-size: 26px;
				font-weight: 800;
				color: var(--el-text-color-primary);
				line-height: 1.1;

				.unit {
					font-size: 14px;
					font-weight: normal;
					color: var(--el-text-color-placeholder);
					margin-left: 4px;
				}

				&.danger {
					color: var(--el-color-danger);
				}
			}

			&.highlight {
				border-color: var(--el-color-danger-light-8);
				background-color: var(--el-color-danger-light-9);
			}

			&.success {
				border-color: var(--el-color-success-light-8);
				background-color: var(--el-color-success-light-9);
			}
		}
	}

	.custom-table {
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--el-border-color-light);
		box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);

		:deep(.el-table__row) {
			transition: background-color 0.18s ease;
		}

		:deep(.el-table__cell) {
			padding: 10px 0;
		}

		:deep(.el-table__inner-wrapper) {
			&::before {
				display: none;
			}
		}

		:deep(.el-table__header) {
			th {
				background-color: var(--el-fill-color-light) !important;
				font-size: 13px;
			}
		}

		.edit-cell {
			width: 100%;
			min-height: 34px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-weight: 500;
			line-height: 1.4;

			:deep(.el-input) {
				width: 100%;
				height: 34px;
				font: inherit;
			}

			:deep(.el-input__wrapper) {
				width: 100%;
				min-height: 34px;
				padding: 0 10px;
				border-radius: 8px;
				box-sizing: border-box;
			}

			:deep(.el-input__inner) {
				height: 32px;
				font: inherit;
				line-height: 32px;
				text-align: center;
			}

			.display-box {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				width: 100%;
				cursor: pointer;
				min-height: 34px;
				padding: 0 10px;
				border-radius: 8px;
				box-sizing: border-box;
				font: inherit;
				line-height: 34px;
				transition:
					background-color 0.2s,
					box-shadow 0.2s;

				&:hover {
					background-color: var(--app-accent-soft);
					box-shadow: inset 0 0 0 1px var(--el-color-primary-light-7);
					
					.edit-icon {
						opacity: 1;
					}
				}

				span {
					flex: 0 1 auto;
				}

				.edit-icon {
					font-size: 14px;
					color: var(--el-color-primary);
					opacity: 0.45;
					flex-shrink: 0;
					transition: opacity 0.2s;
				}
			}
		}

		.action-buttons {
			display: flex;
			justify-content: center;
			gap: 8px;
			:deep(.el-button) {
				background: var(--el-color-primary);
			}
		}

		.empty-placeholder {
			color: var(--el-text-color-placeholder);
		}
	}

	:deep(.el-table__footer-wrapper) {
		td {
			background-color: var(--el-fill-color-lighter) !important;
			color: var(--el-text-color-primary);
			font-weight: 700;
		}
	}

	@media (max-width: 760px) {
		.summary-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
