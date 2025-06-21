<template>
	<div class="table-container">
		<el-text class="mx-1 title-text"
			>本月总工时：{{ allHours }},   平均工时为：8.18,   还差规定平均8小时工时为：-1.27 小时</el-text
		>
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
		>
			<el-table-column prop="empName" label="姓名" width="180" />
			<el-table-column prop="dt" label="日期" width="180" sortable />
			<el-table-column prop="validHours" label="有效工时/小时" width="180" />
			<el-table-column prop="" label="打卡时间（上班）">
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
			<el-table-column prop="" label="打卡时间（下班）">
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
			<el-table-column prop="beInDebtHours" label="所欠工时/小时" sortable />
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
	import { ref, defineProps, watch, inject, h, nextTick } from 'vue';
	import type { VNode } from 'vue';
	import type { TableColumnCtx } from 'element-plus';
	import type { Utils } from '@/types/utils';
	import { Edit } from '@element-plus/icons-vue';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

	const props = defineProps({
		showTableInitData: {
			type: Array as () => Array<TableData>,
			default: () => [],
		},
	});
	const tableData = ref<ProcessedData[]>([]);
	const allHours = ref<number>(0); // 总工时
	const averageHours = ref<number>(0); // 平均工时
	const checkInInputRef = ref<any>(null);
	const checkOutInputRef = ref<any>(null);

	watch(
		() => props.showTableInitData,
		newData => {
			if (newData && newData.length > 0) {
				const processedData: ProcessedData[] = utils.firstProcessingTableData(newData);
				tableData.value = processedData;
			}
		},
		{ deep: true, immediate: true },
	);
	// 上班时间输入框失去焦点事件
	const handleCheckInBlur = (row: ProcessedData) => {
		row.isShowCheckInEdit = false;
		console.log('上班时间编辑完成: ', row);
	};

	// 下班时间输入框失去焦点事件
	const handleCheckOutBlur = (row: ProcessedData) => {
		row.isShowCheckOutEdit = false;
		console.log('下班时间编辑完成: ', row);
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
	const getSummaries = (param: SummaryMethodProps) => {
		const { columns, data } = param;
		console.log('data: ', data);
		const sums: (string | VNode)[] = [];
		columns.forEach((column, index) => {
			switch (index) {
				case 0:
					sums[index] = h('div', { style: { textAlign: 'center' } }, ['合计']);
					break;
				case 1:
					sums[index] = h('div', { style: { textAlign: 'center' } }, [`${data.length} 天`]);
					break;
				case 2:
					const validHours = data.map(item => Number(item[column.property]));
					if (!validHours.every(value => isNaN(value))) {
						const totalHours = validHours.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) return prev + curr;
							else return prev;
						}, 0);
						sums[index] = h('div', { style: { textAlign: 'center' } }, [`${totalHours} 小时`]);
						allHours.value = totalHours;
						averageHours.value = totalHours / data.length;
					}
					break;
				case 5:
					const beInDebtHours = data.map(item => Number(item[column.property]));
					if (!beInDebtHours.every(value => isNaN(value))) {
						const totalHours = beInDebtHours.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) return prev + curr;
							else return prev;
						}, 0);
						sums[index] = h('div', { style: { textAlign: 'center' } }, [`${totalHours} 小时`]);
					}
					break;
				default:
					sums[index] = h('div', { style: { textAlign: 'center' } }, ['--']);
					break;
			}
		});

		return sums;
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
								background: lighten($primary-base, 30%);
							}
							.current-row .el-table__cell {
								background: $primary-base !important;
								border-right: none;
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
