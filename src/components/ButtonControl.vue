<template>
	<div class="btn-container">
		<div class="btn-control">
			<el-button type="primary" size="large" @click="chooseCalculationMethod(1)">计算工作日</el-button>
			<el-button type="primary" size="large" @click="chooseCalculationMethod(2)">单独计算周末工时</el-button>
		</div>
		<div class="year-box" v-if="CalculationMethodType !== -1">
			<el-text class="mx-1 text">选择需要计算的国家规定调休日期(持续优化~~)</el-text>
			<div class="calendar-box">
				<el-date-picker
					ref="datePickerRef"
					v-model="selectedDate"
					type="date"
					placeholder="Pick a day"
					size="default"
					:editable="false"
					@change="handleChange"
					@panel-change="panelChange"
				>
					<template #prev-year>
						<span class="custom-prev-year"></span>
					</template>
					<template #prev-month>
						<span class="custom-prev-month">
							<el-text class="mx-1">上个月</el-text>
						</span>
					</template>
					<template #next-month>
						<span class="custom-next-month">
							<el-text class="mx-1">下个月</el-text>
						</span>
					</template>
					<template #next-year>
						<span class="custom-next-year"></span>
					</template>
				</el-date-picker>
			</div>
		</div>
		<el-button type="primary" size="large" class="submit" @click="handleSubmit" v-if="CalculationMethodType !== -1">
			解析
		</el-button>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'ButtonControl',
	};
</script>
<script setup lang="ts">
	import { inject, ref, watch } from 'vue';
	import dayjs from 'dayjs';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import type { Utils } from '@/types/utils';
	import type { TableData, ProcessedData } from '@/types/TableData';
	import { ElMessage } from 'element-plus';

	// 注入全局工具
	const utils = inject<Utils>('$utils')!;
	dayjs.extend(isSameOrBefore);
	// 定义计算方式
	const CalculationMethodType = ref<number>(-1);

	// 定义子组件接受的props
	const props = defineProps({
		tableInitData: {
			type: Array as () => Array<TableData>,
			default: () => [],
		},
	});
	const tempTableData = ref<TableData[]>([]);
	watch(
		() => props.tableInitData,
		newData => {
			tempTableData.value = newData;
		},
		{ deep: true, immediate: false },
	);

	const selectedDate = ref(new Date()); // 添加选中日期的响应式变量
	const datePickerRef = ref();
	// 定义emit事件
	const emit = defineEmits<{
		handleShowTable: [show: boolean];
		handleChangeTableData: [data: TableData[], CalculationMethodType: number];
		handleChangeTableDataNew: [data: ProcessedData[], CalculationMethodType: number];
	}>();

	// 选择日期后触发。
	const handleChange = (val: Date) => {
		if (utils.isMonthExceed(val)) {
			selectedDate.value = new Date(); // 重置为当前日期
			datePickerRef.value.handleClose(); // 关闭日期选择器
			return;
		}

		// 检查选择的日期是否在原始数据中存在
		const selectedDateStr = dayjs(val).format('YYYY-MM-DD');
		const dateExists = props.tableInitData.some(item => item.dt === selectedDateStr);

		if (!dateExists) {
			ElMessage.warning(`选择的日期 ${selectedDateStr} 在打卡数据中不存在，请选择有效的打卡日期`);
			selectedDate.value = new Date(); // 重置为当前日期
			return;
		}

		const newTableData = utils.addDate(val, props.tableInitData);
		emit('handleChangeTableDataNew', newTableData, CalculationMethodType.value);
		ElMessage.success('日期已添加到表格数据中');
	};
	// 当日期面板改变时触发，比如头部的选择年、月
	const panelChange = (date: Date, _mode: 'month' | 'year', _view?: string) => {
		if (utils.isMonthExceed(date)) {
			selectedDate.value = new Date(); // 重置为当前日期
			datePickerRef.value.handleClose(); // 关闭日期选择器
			return;
		}
	};
	// 解析数据
	const handleSubmit = () => {
		if (props.tableInitData.length === 0) {
			ElMessage.warning('请先输入数据');
			return;
		}
		if (CalculationMethodType.value === -1) {
			ElMessage.warning('请先选择计算方式');
			return;
		}
		if (tempTableData.value.length !== 0) {
			// 这里可以添加你的解析逻辑
			emit('handleShowTable', true);
			// 创建新的数组引用，确保每次都能触发表格组件的watch监听
			const newTableData = [...tempTableData.value];
			emit('handleChangeTableData', newTableData, CalculationMethodType.value);
		}
	};
	// 选择计算方式
	const chooseCalculationMethod = (type: number) => {
		if (props.tableInitData.length === 0) {
			ElMessage.warning('请先输入数据');
			return;
		}
		CalculationMethodType.value = type;
	};
</script>

<style scoped lang="scss">
	.btn-container {
		margin-top: 20px;
		width: 60%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.btn-control {
			width: 46%;
			display: flex;
			align-items: center;
			justify-content: center;
			:deep(.el-button) {
				width: 46%;
				border: none;
				&:hover {
					background-color: var(--el-color-primary);
					box-shadow: 0px 1px 3px 1px #535454;
				}
			}
		}
		.year-box {
			margin-top: 20px;
			width: 44%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.text {
				font-size: 14px;
			}
			.calendar-box {
				width: 75%;
				:deep(.el-tooltip__trigger) {
					width: 100%;
				}
			}
		}
		:deep(.el-button),
		.submit {
			margin-top: 20px;
			width: 44%;
			width: 46%;
			border: none;
			&:hover {
				background-color: var(--el-color-primary);
				box-shadow: 0px 1px 3px 1px #535454;
			}
		}
	}
</style>
