<template>
	<transition appear>
		<div class="tips-container">
			<el-card style="max-width: 480px" shadow="hover">
				<template #header>
					<div class="card-header">
						<span class="tips-title" @click="showToUse">** 如何使用？点击查看 **</span>
					</div>
				</template>

				<el-link
					href="https://gitee.com/ljh-project/vue-work-time"
					target="_blank"
					class="card-content"
					underline="never"
					>有优化建议？这里
				</el-link>
				<template #footer>
					<el-link target="_blank" class="card-content" underline="never" @click="copyReferenceData"
						>复制参考数据
					</el-link>
				</template>
			</el-card>
		</div>
	</transition>
</template>
<script lang="ts">
	export default {
		name: 'TipsComp',
	};
</script>

<script setup lang="ts">
	import { ElMessage } from 'element-plus';
	import type { TableData } from '@/types/TableData';
	import { tableJson } from '@/utils/json';

	const emit = defineEmits<{
		'show-to-use': [];
	}>();

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
