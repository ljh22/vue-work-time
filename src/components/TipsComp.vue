<template>
	<transition appear>
		<div class="tips-container">
			<el-card style="max-width: 480px" shadow="hover">
				<template #header>
					<div class="card-header">
						<span class="tips-title">** 如何使用？点击查看 **</span>
					</div>
				</template>

				<el-link href="https://gitee.com/ljh-project/work-time" target="_blank" class="card-content" :underline="false"
					>有优化建议？这里
				</el-link>
				<template #footer>
					<el-link target="_blank" class="card-content" :underline="false" @click="copyReferenceData"
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
	import type { TableData } from '@/types/TableData';

	const referenceData: TableData[] = [
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
	const copyReferenceData = () => {
		// 将参考数据转换为JSON字符串

		const jsonStr = JSON.stringify(referenceData);
		console.log('jsonStr: ', jsonStr);
		// 复制到剪贴板
		navigator.clipboard.writeText(jsonStr).then(() => {
			ElMessage.success('参考数据已复制到剪贴板，请粘贴到输入框中');
		});
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
