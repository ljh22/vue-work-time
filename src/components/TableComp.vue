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
		>
			<el-table-column prop="dt" label="日期" width="180" />
			<el-table-column prop="name" label="有效工时" width="180" />
			<el-table-column prop="" label="打卡时间">
				<template #default="scope">
					<el-text>{{ scope.row.checktime }}</el-text>
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
	const tableData = [
		{ 'dt': '2024-05-06', 'checktime': '2024-05-06 08:39:52', 'type': '1' },
		{ 'dt': '2024-05-06', 'checktime': '2024-05-06 17:40:28', 'type': '2' },
		{ 'dt': '2024-05-07', 'checktime': '2024-05-07 08:37:59', 'type': '1' },
		{ 'dt': '2024-05-07', 'checktime': '2024-05-07 19:38:11', 'type': '2' },
		{ 'dt': '2024-05-08', 'checktime': '2024-05-08 08:37:07', 'type': '1' },
		{ 'dt': '2024-05-08', 'checktime': '2024-05-08 19:53:59', 'type': '2' },
		{ 'dt': '2024-05-09', 'checktime': '2024-05-09 08:39:34', 'type': '1' },
		{ 'dt': '2024-05-09', 'checktime': '2024-05-09 19:34:17', 'type': '2' },
		{ 'dt': '2024-05-10', 'checktime': '2024-05-10 08:38:17', 'type': '1' },
		{ 'dt': '2024-05-10', 'checktime': '2024-05-10 17:45:36', 'type': '2' },
		{ 'dt': '2024-05-11', 'checktime': '2024-05-11 08:37:25', 'type': '1' },
		{ 'dt': '2024-05-11', 'checktime': '2024-05-11 17:43:55', 'type': '2' },
		{ 'dt': '2024-05-13', 'checktime': '2024-05-13 08:37:33', 'type': '1' },
		{ 'dt': '2024-05-13', 'checktime': '2024-05-13 17:39:01', 'type': '2' },
		{ 'dt': '2024-05-14', 'checktime': '2024-05-14 08:37:43', 'type': '1' },
	];
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
