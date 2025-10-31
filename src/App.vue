<template>
	<el-config-provider :message="messageConfig">
		<div class="container">
			<el-row :gutter="0">
				<el-col :span="6">
					<div class="left">
						<TipsComp
							ref="tipsCompRef"
							@show-to-use="handleShowToUse"
							@showTourSecond="handleShowTourSecond"
						></TipsComp>
					</div>
				</el-col>
				<el-col :span="18">
					<div class="right">
						<ModalComp
							:isShowUse="isShowUse"
							@close-use="handleCloseUse"
							:isShowTourSecond="isShowTourSecond"
							@restart-guide="handleRestartGuide"
						></ModalComp>
					</div>
				</el-col>
			</el-row>
		</div>
	</el-config-provider>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import TipsComp from './components/TipsComp.vue';
	import ModalComp from './components/ModalComp.vue';

	const isShowUse = ref(false);
	const isShowTourSecond = ref(false);
	const tipsCompRef = ref<InstanceType<typeof TipsComp> | null>(null);

	// 配置 ElMessage 的最大显示数量
	const messageConfig = reactive({
		max: 3,
		grouping: false,
	});

	const handleShowToUse = () => {
		isShowUse.value = !isShowUse.value;
	};

	const handleCloseUse = () => {
		isShowUse.value = false;
	};
	const handleShowTourSecond = () => {
		isShowTourSecond.value = true;
	};

	const handleRestartGuide = () => {
		// 先重置右侧引导状态，确保每次都能触发
		isShowTourSecond.value = false;
		// 重新启动左侧引导
		if (tipsCompRef.value) {
			tipsCompRef.value.restartTour();
		}
	};
</script>

<style scoped lang="scss">
	.container {
		padding: 20px;
		.right {
			display: flex;
			flex-direction: column;
			align-content: center;
		}
	}
</style>
