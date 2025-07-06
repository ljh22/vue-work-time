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
					></el-input>
					<div class="edit-box" v-else>
						<el-text>{{ scope.row.checkInTime }}</el-text>
						<el-icon @click="handleShowCheckInTimeEdit(scope.row)"><Edit class="edit-icon" /></el-icon>
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
					></el-input>
					<div class="edit-box" v-else>
						<el-text>{{ scope.row.checkOutTime }}</el-text>
						<el-icon @click="handleShowCheckOutTimeEdit(scope.row)"><Edit class="edit-icon" /></el-icon>
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
	import { Edit } from '@element-plus/icons-vue';
	import { ElMessage } from 'element-plus';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

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
			console.log('newProcessedData: ', newProcessedData.length);
			if (newProcessedData.length === 0) {
				const processedData: ProcessedData[] = utils.firstProcessingTableData(newData, newType);
				tableData.value = processedData;
			} else {
				tableData.value = [...newProcessedData];
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
	}
</style>
