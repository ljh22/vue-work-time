<template>
	<div class="header-actions-container">
		<el-button-group>
			<el-button 
				ref="cardHeader1"
				type="primary" 
				link 
				:icon="utils.getIcon('Document')"
				@click="showToUse"
			>
				使用说明
			</el-button>
			<el-button 
				ref="cardContent2"
				type="primary" 
				link 
				:icon="utils.getIcon('CopyDocument')"
				@click="copyReferenceData"
			>
				复制参考数据
			</el-button>
			<el-button 
				ref="cardContent"
				type="primary" 
				link 
				:icon="utils.getIcon('Link')"
				@click="goToGitee"
			>
				建议/源码
			</el-button>
		</el-button-group>
	</div>

	<el-tour v-model="open" :close-on-click-modal="true" @close="closeTourFirst">
		<el-tour-step :target="cardHeaderElement" title="使用指南" placement="bottom">
			<div class="step-font">点击这里查看如何使用本工具</div>
		</el-tour-step>
		<el-tour-step :target="cardContentElement2" title="参考数据" placement="bottom">
			<div class="step-font">点击这里复制参考数据到剪贴板，方便快速测试</div>
		</el-tour-step>
		<el-tour-step :target="cardContentElement" title="优化建议" placement="bottom">
			<div class="step-font">点击这里提交优化建议或访问代码仓库</div>
		</el-tour-step>
		<template #indicators="{ current, total }">
			<span>{{ current + 1 }} / {{ total }}</span>
		</template>
	</el-tour>
</template>

<script setup lang="ts">
	import { inject, nextTick, onMounted, ref } from 'vue';
	import { ElMessage } from 'element-plus';
	import type { TableData } from '@/types/TableData';
	import { tableJson } from '@/utils/json';
	import type { Utils } from '@/types/utils';

	const utils = inject<Utils>('$utils')!;
	const emit = defineEmits<{
		'show-to-use': [];
		'showTourSecond': [];
	}>();

	const open = ref(false);

	const cardHeader1 = ref<any>(null);
	const cardContent = ref<any>(null);
	const cardContent2 = ref<any>(null);

	const cardHeaderElement = ref<HTMLElement | null>(null);
	const cardContentElement = ref<HTMLElement | null>(null);
	const cardContentElement2 = ref<HTMLElement | null>(null);

	const goToGitee = () => {
		window.open('https://gitee.com/ljh-project/vue-work-time', '_blank');
	};

	// 重新启动引导的方法
	const restartTour = () => {
		nextTick(() => {
			cardHeaderElement.value = utils.getComponentRoot(cardHeader1);
			cardContentElement.value = utils.getComponentRoot(cardContent);
			cardContentElement2.value = utils.getComponentRoot(cardContent2);

			setTimeout(() => {
				open.value = true;
			}, 300);
		});
	};

	defineExpose({
		restartTour,
	});

	onMounted(() => {
		if (localStorage.getItem('has_it_been_guided') === 'true') {
			open.value = false;
			return;
		}
		nextTick(() => {
			cardHeaderElement.value = utils.getComponentRoot(cardHeader1);
			cardContentElement.value = utils.getComponentRoot(cardContent);
			cardContentElement2.value = utils.getComponentRoot(cardContent2);

			setTimeout(() => {
				open.value = true;
			}, 1500);
		});
	});

	const closeTourFirst = () => {
		localStorage.setItem('has_it_been_guided', 'true');
		emit('showTourSecond');
		open.value = false;
	};

	const referenceData: TableData[] = tableJson;
	const copyReferenceData = () => {
		const jsonStr = JSON.stringify(referenceData);
		try {
			navigator.clipboard.writeText(jsonStr).then(() => {
				ElMessage.success('参考数据已复制到剪贴板，请粘贴到输入框中');
			});
		} catch (error) {
			ElMessage.error('复制失败，请重试');
		}
	};
	const showToUse = () => {
		emit('show-to-use');
	};
</script>

<style lang="scss" scoped>
	.header-actions-container {
		display: flex;
		align-items: center;
		gap: 8px;

		:deep(.el-button) {
			font-weight: 500;
			font-size: 14px;
			padding: 8px 12px;
			
			&:hover {
				background-color: var(--el-color-primary-light-9);
				border-radius: 6px;
			}
		}
	}
</style>
