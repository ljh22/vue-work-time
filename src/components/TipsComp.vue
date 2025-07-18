<template>
	<transition appear>
		<div class="tips-container">
			<el-card style="max-width: 480px" shadow="hover">
				<template #header>
					<div class="card-header" ref="cardHeader1">
						<span class="tips-title" @click="showToUse">** 如何使用？点击查看 **</span>
					</div>
				</template>

				<el-link
					href="https://gitee.com/ljh-project/vue-work-time"
					target="_blank"
					class="card-content"
					underline="never"
					ref="cardContent"
					>有优化建议？这里
				</el-link>
				<template #footer>
					<el-link target="_blank" class="card-content" underline="never" @click="copyReferenceData" ref="cardContent2">
						复制参考数据
					</el-link>
				</template>
			</el-card>
		</div>
	</transition>
	<el-tour v-model="open" :close-on-click-modal="true" @close="closeTourFirst">
		<el-tour-step :target="cardHeaderElement" title="使用指南" placement="right">
			<div class="step-font">点击这里查看如何使用本工具</div>
		</el-tour-step>
		<el-tour-step :target="cardContentElement" title="优化建议" placement="right">
			<div class="step-font">点击这里提交优化建议或访问代码仓库</div>
		</el-tour-step>
		<el-tour-step :target="cardContentElement2" title="使用指南参考数据" placement="right">
			<div class="step-font">点击这里复制参考数据</div>
		</el-tour-step>
		<template #indicators="{ current, total }">
			<span>{{ current + 1 }} / {{ total }}</span>
		</template>
	</el-tour>
</template>
<script lang="ts">
	export default {
		name: 'TipsComp',
	};
</script>

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
	const cardHeader1 = ref<HTMLElement | null>(null);
	const cardContent = ref<HTMLElement | null>(null);
	const cardContent2 = ref<HTMLElement | null>(null);

	const cardHeaderElement = ref<HTMLElement | null>(null);
	const cardContentElement = ref<HTMLElement | null>(null);
	const cardContentElement2 = ref<HTMLElement | null>(null);

	onMounted(() => {
		// 等待DOM更新后获取元素
		if (localStorage.getItem('has_it_been_guided') === 'true') {
			open.value = false; // 如果已经引导过，则不再打开
			return;
		}
		nextTick(() => {
			// // 获取组件的根DOM元素
			cardHeaderElement.value = cardHeader1.value;
			cardContentElement.value = utils.getComponentRoot(cardContent);
			cardContentElement2.value = utils.getComponentRoot(cardContent2);

			// 延迟100ms确保DOM完全渲染
			setTimeout(() => {
				open.value = true; // 此时DOM已就绪
			}, 800); //处理tip动画之后开始引导
		});
	});
	const closeTourFirst = () => {
		localStorage.setItem('tourFirst', 'true');
		emit('showTourSecond');
		open.value = false;
	};

	const referenceData: TableData[] = tableJson;
	const copyReferenceData = () => {
		// 将参考数据转换为JSON字符串
		const jsonStr = JSON.stringify(referenceData);
		try {
			// 复制到剪贴板
			navigator.clipboard.writeText(jsonStr).then(() => {
				ElMessage.success('参考数据已复制到剪贴板，请粘贴到输入框中');
			});
		} catch (error) {
			ElMessage.error('复制失败，请重试，或联系作者');
		}
	};
	const showToUse = () => {
		emit('show-to-use');
	};
</script>

<style lang="scss" scoped>
	.tips-container {
		animation: slide-down 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
		border-radius: 10px;
		:deep(.el-card) {
			width: 70%;
			border-radius: 10px;
			text-align: center;
		}
		.card-header {
			.tips-title {
				color: red;
				font-size: 21px;
				font-weight: bold;
				text-align: center;
				margin-bottom: 10px;
				cursor: pointer;
				text-shadow: 2px 2px 2px #262626;
			}
			.card-content {
				color: rgb(245, 110, 110);
				font-size: 16px;
				text-align: center;
				margin-bottom: 10px;
				cursor: pointer;
			}
		}
	}

	@keyframes slide-down {
		0% {
			opacity: 0;
			transform: translateY(-150px);
		}
		100% {
			opacity: 1;
			transform: translateY(0px);
		}
	}
</style>
