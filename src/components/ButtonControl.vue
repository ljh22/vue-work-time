<template>
	<div class="btn-container">
		<div class="btn-control">
			<el-button type="primary" size="large">周末除外</el-button>
			<el-button type="primary" size="large">单独计算周末工时</el-button>
		</div>
		<div class="year-box">
			<div class="text">选择需要计算的国家规定调休日期(持续优化~~)</div>
			<div class="calendar-box"></div>
		</div>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'ButtonControl',
	};
</script>
<script setup lang="ts">
	import { getCurrentInstance } from 'vue';

	const instance = getCurrentInstance();
	// const dayjs = instance?.appContext.config.globalProperties.$dayjs;
</script>

<style scoped lang="scss">
	.btn-container {
		width: 60%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: pink;
		.btn-control {
			width: 46%;
			display: flex;
			align-items: center;
			justify-content: center;
			:deep(.el-button) {
				width: 46%;
				border: none;
				box-shadow: 1px 2px 2px 1px #555555;
				&:hover {
					background-color: #145ce0;
				}
			}
		}
		.year-box {
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				font-size: 14px;
			}
			.calendar-box {
				width: 46%;
				height: 300px;

				:deep(.el-calendar) {
					.el-calendar__header {
						background-color: skyblue;
						padding: 8px;
					}
					.el-calendar__body {
						padding: 8px;
						.el-calendar-table thead th {
							padding: 0 0 3px 0;
						}
						.el-calendar-table .el-calendar-day {
							height: auto;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
