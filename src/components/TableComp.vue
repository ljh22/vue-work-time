<template>
	<div class="table-container">
		<el-text class="mx-1 title-text"
			>本月总工时：57.27,   平均工时为：8.18,   还差规定平均8小时工时为：-1.27 小时</el-text
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
		>
			<el-table-column prop="empName" label="姓名" width="180" />
			<el-table-column prop="dt" label="日期" width="180" />
			<el-table-column prop="name" label="有效工时" width="180" />
			<el-table-column prop="" label="打卡时间（上班）">
				<template #default="scope">
					<el-text>{{ scope.row.checkInTime }}</el-text>
				</template>
			</el-table-column>
			<el-table-column prop="" label="打卡时间（下班）">
				<template #default="scope">
					<el-text>{{ scope.row.checkOutTime }}</el-text>
				</template>
			</el-table-column>
			<el-table-column prop="hour" label="所欠工时/小时" sortable />
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
	import { ref, defineProps, watch, inject } from 'vue';
	import type { Utils } from '@/types/utils';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

	const props = defineProps({
		showTableInitData: {
			type: Array as () => Array<TableData>,
			default: () => [],
		},
	});
	const tableData = ref<any[]>([]);

	watch(
		() => props.showTableInitData,
		newData => {
			if (newData && newData.length > 0) {
				const processedData: ProcessedData[] = utils.firstProcessingTableData(newData);
				tableData.value = processedData;
			}
		},
		{ deep: true, immediate: false },
	);
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
							}
						}
					}
				}
			}
		}
	}
</style>
