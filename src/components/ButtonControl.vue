<template>
	<div class="btn-container">
		<div class="btn-control">
			<el-button type="primary" size="large">周末除外</el-button>
			<el-button type="primary" size="large">单独计算周末工时</el-button>
		</div>
		<div class="year-box">
			<div class="text">选择需要计算的国家规定调休日期(持续优化~~)</div>
			<div class="calendar-box">
				<el-calendar ref="calendar" v-model="selectedDate">
					<template #header="{ date }">
						<div>{{ dayjs(selectedDate).format('YYYY 年 M 月 D 日') }}</div>
						<el-button-group>
							<el-button size="small" @click="handlePrevMonth">上一月</el-button>
							<el-button size="small" @click="selectDate('today')">今天</el-button>
							<el-button size="small" @click="selectDate('next-month')" :disabled="isNextMonthDisabled"
								>下一月</el-button
							>
						</el-button-group>
					</template>
					<template #date-cell="{ data }">
						<div :class="data.isSelected ? 'is-selected' : ''" @click="onDateClick(data)" class="date-cell">
							{{ data.day.split('-').slice(2).join('') }}
						</div>
					</template>
				</el-calendar>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'ButtonControl',
	};
</script>
<script setup lang="ts">
	import { ref, computed } from 'vue';
	import type { CalendarDateType, CalendarInstance } from 'element-plus';
	import dayjs from 'dayjs';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	dayjs.extend(isSameOrBefore);

	const calendar = ref<CalendarInstance>();
	const selectedDate = ref(new Date()); // 添加选中日期的响应式变量

	// 计算是否禁用下一月按钮
	const isNextMonthDisabled = computed(() => {
		const currentDate = new Date();
		const displayedDate = selectedDate.value;

		// 如果当前显示的月份是当前月份，则禁用下一月按钮
		return dayjs(displayedDate).format('YYYY-MM') === dayjs(currentDate).format('YYYY-MM');
	});

	const selectDate = (val: CalendarDateType) => {
		if (!calendar.value) return;
		// 如果是下一月且被禁用，则不执行
		if (val === 'next-month' && isNextMonthDisabled.value) return;
		calendar.value.selectDate(val);
	};

	// 处理上一月按钮点击
	const handlePrevMonth = () => {
		// 计算是否禁用上一月按钮
		const currentDate = new Date();
		const displayedDate = selectedDate.value;

		// 计算两个月前的日期
		const twoMonthsAgo = dayjs(currentDate).subtract(2, 'month');

		// 如果当前显示的月份已经是两个月前或更早，则禁用上一月按钮
		const isDisabled = dayjs(displayedDate).isSameOrBefore(twoMonthsAgo, 'month');

		// 处理上一月按钮点击
		console.log('isPrevMonthDisabled.value: ', isDisabled);
		if (isDisabled) {
			ElMessage({
				message: '仅可查看前2个月',
				type: 'warning',
			});
			return;
		}
		selectDate('prev-month');
	};
	// 监听日期点击事件
	const onDateClick = (data: any) => {
		console.log('点击的日期数据:', data);
		console.log('点击的日期:', data.date);
		console.log('格式化日期:', data.day);
		console.log('是否选中:', data.isSelected);
		// 更新选中的日期
		selectedDate.value = data.date;
		// 在这里可以处理选择的日期
		// 例如：发送请求、更新状态等
	};
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
					background-color: $primary-base;
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
					border-radius: 10px;
					.el-calendar__header {
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
							&:hover {
								background-color: $primary-base;
								border-radius: 4px;
							}
						}
						/* 日期单元格样式 */
						.date-cell {
							cursor: pointer;
							border-radius: 4px;
							transition: all 0.2s;
							&:hover {
								background-color: $primary-base;
								opacity: 0.7;
							}
						}
						/* 选中日期的样式 */
						.is-selected {
							background-color: $primary-base;
							color: white;
							border-radius: 4px;
							font-weight: bold;
						}
					}
				}
			}
		}
	}
</style>
