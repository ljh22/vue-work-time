<template>
	<div class="btn-container">
		<div class="method-selector">
			<el-radio-group :model-value="CalculationMethodType" size="large" @update:model-value="handleMethodChange">
				<el-radio-button :label="1" :value="1">计算工作日</el-radio-button>
				<el-radio-button :label="2" :value="2">单独计算周末工时</el-radio-button>
			</el-radio-group>
		</div>

		<Transition name="fade">
			<div class="extra-options" v-if="CalculationMethodType !== -1">
				<div class="holiday-picker">
					<el-tooltip content="当月存在国家法定节假日上班调休时，请选择调休日期" placement="top">
						<span class="picker-label">法定节假日/调休选择</span>
					</el-tooltip>
					<el-date-picker
						ref="datePickerRef"
						v-model="selectedDate"
						type="date"
						placeholder="选择调休日"
						size="default"
						:editable="false"
						@change="handleChange"
						@panel-change="panelChange"
						class="custom-picker"
					/>
				</div>
				
				<el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
					开始解析数据
				</el-button>
			</div>
		</Transition>
	</div>
</template>

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

	const handleMethodChange = (val: any) => {
		if (props.tableInitData.length === 0) {
			ElMessage.warning('请先输入数据');
			CalculationMethodType.value = -1;
			return;
		}
		CalculationMethodType.value = Number(val);
	};

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
		// 同时更新原始数据，将选择的法定节假日记录添加进去
		const holidayRecords = props.tableInitData.filter(item => item.dt === selectedDateStr);
		const updatedTableInitData = [...props.tableInitData];
		// 标记这些记录为法定节假日
		holidayRecords.forEach(record => {
			record.isHoliday = true;
		});
		emit('handleChangeTableData', updatedTableInitData, CalculationMethodType.value);
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
</script>

<style scoped lang="scss">
	.btn-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		width: 100%;
		padding: 8px 0 0;
	}

	.method-selector {
		width: 100%;
		display: flex;
		justify-content: center;

		:deep(.el-radio-group) {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			width: min(100%, 560px);
			padding: 4px;
			border-radius: 12px;
			background: var(--el-fill-color-light);
			border: 1px solid var(--el-border-color-light);
			overflow: hidden;
		}

		:deep(.el-radio-button) {
			--el-radio-button-checked-bg-color: var(--el-color-primary);
			--el-radio-button-checked-border-color: var(--el-color-primary);
			--el-radio-button-checked-text-color: #fff;
			margin: 0;
		}

		:deep(.el-radio-button::before) {
			display: none;
		}

		:deep(.el-radio-button__inner) {
			width: 100%;
			padding: 12px 16px;
			font-size: 15px;
			border: 0 !important;
			border-radius: 9px !important;
			background: transparent;
			box-shadow: none !important;
			outline: 0;
		}

		:deep(.el-radio-button:first-child .el-radio-button__inner) {
			border-left: 0 !important;
		}

		:deep(.el-radio-button.is-active .el-radio-button__inner) {
			box-shadow: none !important;
		}
	}

	.extra-options {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		width: 100%;
		max-width: 560px;
	}

	.holiday-picker {
		display: flex;
		align-items: center;
		gap: 12px;
		background-color: var(--app-muted-surface);
		padding: 12px 14px;
		border-radius: 12px;
		border: 1px solid var(--el-border-color-light);
		width: 100%;
		box-sizing: border-box;

		.picker-label {
			font-size: 14px;
			color: var(--el-text-color-regular);
			white-space: nowrap;
		}

		.custom-picker {
			flex: 1;
		}
	}

	.submit-btn {
		width: 100%;
		height: 48px;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0;
		border-radius: 12px;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px var(--el-color-primary-light-5);
		}

		&:active {
			transform: translateY(0);
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: all 0.3s ease;
	}
	.fade-enter-from, .fade-leave-to {
		opacity: 0;
		transform: translateY(10px);
	}

	@media (max-width: 620px) {
		.method-selector :deep(.el-radio-group) {
			grid-template-columns: 1fr;
		}

		.holiday-picker {
			align-items: stretch;
			flex-direction: column;

			.picker-label {
				white-space: normal;
			}
		}
	}
</style>
