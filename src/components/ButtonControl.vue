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
				<el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
					开始解析数据
				</el-button>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { inject, ref, watch } from 'vue';
	import type { Utils } from '@/types/utils';
	import type { TableData } from '@/types/TableData';
	import { ElMessage } from 'element-plus';

	// 注入全局工具
	const utils = inject<Utils>('$utils')!;
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

	// 定义emit事件
	const emit = defineEmits<{
		handleShowTable: [show: boolean];
		handleChangeTableData: [data: TableData[], CalculationMethodType: number];
	}>();

	const handleMethodChange = (val: any) => {
		if (props.tableInitData.length === 0) {
			ElMessage.warning('请先输入数据');
			CalculationMethodType.value = -1;
			return;
		}
		CalculationMethodType.value = Number(val);
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
	}
</style>
