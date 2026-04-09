<template>
	<div class="table-container">
		<el-text class="mx-1 title-text">
			本月总工时：{{ allHours }}, 平均工时为：{{ averageHours }}
			<span v-if="beInDebtHours > 0"> , 还差规定平均 8 小时工时为：{{ beInDebtHours }} 小时 </span>
		</el-text>
		<el-table
			:data="tableData"
			style="width: 100%"
			stripe
			border
			show-summary
			:highlight-current-row="true"
			append-filter-panel-to="body"
			:allow-drag-last-column="false"
			:header-cell-style="{ textAlign: 'center' }"
			:cell-style="{ textAlign: 'center' }"
			:summary-method="getSummaries"
			@header-dragend="handleHeaderDragend"
		>
			<el-table-column prop="empName" label="姓名" width="180" min-width="120" />
			<el-table-column prop="dt" label="日期" width="180" sortable min-width="120" />
			<el-table-column prop="validHours" label="有效工时/小时" width="180" min-width="120">
				<template #default="scope">
					<el-tag type="success" v-if="Number(customRound(scope.row.validHours)) >= 8">
						{{ customRound(scope.row.validHours) }}
					</el-tag>
					<el-tag type="danger" v-else>
						{{ customRound(scope.row.validHours) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="" label="打卡时间（上班）" width="200" min-width="220">
				<template #default="scope">
					<el-input
						v-model="scope.row.checkInTime"
						placeholder=""
						ref="checkInInputRef"
						v-if="scope.row.isShowCheckInEdit"
						@blur="handleCheckInBlur(scope.row)"
						@keydown.enter="handleCheckInEnter(scope.row, $event)"
					></el-input>
					<div class="edit-box" v-else>
						<el-text>{{ scope.row.checkInTime }}</el-text>
						<el-icon @click="handleShowCheckInTimeEdit(scope.row)">
							<Edit class="edit-icon" />
						</el-icon>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="" label="打卡时间（下班）" width="200" min-width="220">
				<template #default="scope">
					<el-input
						v-model="scope.row.checkOutTime"
						placeholder=""
						ref="checkOutInputRef"
						v-if="scope.row.isShowCheckOutEdit"
						@blur="handleCheckOutBlur(scope.row)"
						@keydown.enter="handleCheckOutEnter(scope.row, $event)"
					></el-input>
					<div class="edit-box" v-else>
						<el-text>{{ scope.row.checkOutTime }}</el-text>
						<el-icon @click="handleShowCheckOutTimeEdit(scope.row)">
							<Edit class="edit-icon" />
						</el-icon>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="beInDebtHours" label="所欠工时/小时" sortable min-width="120">
				<template #default="scope">
					<el-tag type="success" v-if="Number(customRound(scope.row.beInDebtHours)) <= 0">
						{{ customRound(scope.row.beInDebtHours) }}
					</el-tag>
					<el-tag type="danger" v-else>
						{{ customRound(scope.row.beInDebtHours) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template #default="scope">
					<div v-if="isLastRow(scope.$index)" class="operation-buttons">
						<el-tooltip content="新增一条新的工时" placement="top">
							<el-button
								type="primary"
								:icon="Plus"
								circle
								size="small"
								@click="handleAddNewRecord"
								class="add-button"
							/>
						</el-tooltip>
						<el-tooltip content="删除这条工时记录" placement="top" v-if="scope.row.isNewlyAdded">
							<el-button
								type="danger"
								:icon="Minus"
								circle
								size="small"
								@click="handleDeleteRecord(scope.row)"
								class="delete-button"
							/>
						</el-tooltip>
					</div>
					<span v-else class="empty-operation">--</span>
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
	import { ElMessage } from 'element-plus';
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
		[() => props.showTableInitData, () => props.CalculationMethodType, () => props.showTableDataNew],
		([newData, newType, newProcessedData]) => {
			if (newProcessedData.length === 0) {
				const processedData: ProcessedData[] = utils.firstProcessingTableData(newData, newType);
				tableData.value = processedData;
			} else {
				tableData.value = [...newProcessedData];
				isHaveNewProcessedData.value = true;
			}
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
		if (isHaveNewProcessedData.value) {
			ElMessage.error('选择法定节假日后，不能修改上班时间，请重新选择');
			restoreOriginalTime(row, originalCheckInTime!, true);
			return;
		}
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

		// 向父组件发射更新事件，避免重复调用firstProcessingTableData
		emit('update-data', tempTableData);
	};

	// 下班时间输入框失去焦点事件
	const handleCheckOutBlur = (row: ProcessedData) => {
		row.isShowCheckOutEdit = false;
		const changedCheckOutTime = row.checkOutTime;

		// 从原始数据中获取真正的原始时间用于恢复
		const originalCheckOutRecord = props.showTableInitData.find(item => item.dt === row.dt && item.type === '2');
		const originalCheckOutTime = originalCheckOutRecord ? originalCheckOutRecord.checktime : `${row.dt} 18:00:00`;
		if (isHaveNewProcessedData.value) {
			ElMessage.error('选择法定节假日后，不能修改下班时间，请重新选择');
			restoreOriginalTime(row, originalCheckOutTime!, false);
			return;
		}
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

		// 向父组件发射更新事件，避免重复调用firstProcessingTableData
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
						sums[index] = h('div', { style: { textAlign: 'center', fontWeight: 'bold' } }, [
							`${customRound(totalHours)} 小时`,
						]);
						beInDebtHours.value = Number(customRound(totalHours));
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
		margin-top: 20px;
		width: 90%;
		margin-left: -185px;

		.title-text {
			display: block;
			text-align: center;
			margin-bottom: 10px;
			font-weight: bold;
			font-size: 16px;
		}

		.edit-box {
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-evenly;

			.el-icon {
				font-size: 17px;
			}

			.edit-icon {
				color: rgb(110, 108, 108);
			}
		}

		:deep(.el-table) {
			width: 100%;
			color: #000;

			.el-table__inner-wrapper {
				.el-table__body-wrapper {
					.el-table__body {
						tbody {
							.el-table__row--striped .el-table__cell {
								background: color-mix(in srgb, var(--el-color-primary) 40%, white 30%);

								&:first-child {
									border-top-left-radius: 10px;
									border-bottom-left-radius: 10px;
								}

								&:last-child {
									border-top-right-radius: 10px;
									border-bottom-right-radius: 10px;
								}
							}

							.current-row .el-table__cell {
								background: #ced6e0 !important;
								border-right-color: #ced6e0;

								&:first-child {
									border-top-left-radius: 10px;
									border-bottom-left-radius: 10px;
								}

								&:last-child {
									border-top-right-radius: 10px;
									border-bottom-right-radius: 10px;
								}
							}
						}
					}
				}
			}
		}

		.dark & :deep(.el-table) {
			color: #fff;

			.el-table__inner-wrapper {
				.el-table__body-wrapper {
					.el-table__body {
						tbody {
							.el-table__row--striped .el-table__cell {
								color: #000;
								background: color-mix(in srgb, var(--el-color-primary) 70%, white 30%);

								.el-text {
									color: #000;
								}

								.el-input {
									.el-input__wrapper {
										padding: 0;
									}
								}
							}
						}
					}
				}
			}
		}

		.add-button {
			// transition: all 0.3s ease;
			&:hover {
				// transform: scale(1.1);
				box-shadow: 0px 2px 8px var(--el-color-primary);
			}
		}

		.delete-button {
			&:hover {
				box-shadow: 0px 2px 8px var(--el-color-danger);
			}
		}

		.operation-buttons {
			display: flex;
			gap: 8px;
			justify-content: center;
			align-items: center;
		}

		:deep(.el-button) {
			background-color: var(--el-color-primary) !important;
			border-color: var(--el-color-primary) !important;

			&:hover {
				background-color: var(--el-color-primary) !important;
				border-color: var(--el-color-primary) !important;
			}

			&:active {
				background-color: var(--el-color-primary) !important;
				border-color: var(--el-color-primary) !important;
			}
		}

		.empty-operation {
			color: #909399;
			font-size: 14px;
		}
	}
</style>
