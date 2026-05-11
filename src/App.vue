<template>
	<el-config-provider :message="messageConfig">
		<div v-if="newVersion" class="update-dialog">
			<div class="update-content">
				<h3>检测到新版本发布！</h3>
				<p>最新版本: {{ newVersion }}</p>
				<div class="contact">
					请自行
					<div>
						<el-link
							type="primary"
							:underline="false"
							href="https://gitee.com/ljh-project/vue-work-time/issues"
							target="_blank"
							>下载</el-link
						>
					</div>
					获取最新版本
				</div>
				<el-button type="primary" @click="newVersion = ''">我知道了</el-button>
			</div>
		</div>
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
	import { ref, reactive, onMounted } from 'vue';
	import utils from '@/utils/utils';
	import TipsComp from './components/TipsComp.vue';
	import ModalComp from './components/ModalComp.vue';

	const isShowUse = ref(false);
	const isShowTourSecond = ref(false);
	const newVersion = ref('');
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

	// 挂载时检查版本
	onMounted(async () => {
		const result = await utils.checkVersionUpdate();
		if (result.needUpdate) {
			newVersion.value = result.remoteVersion || '';
		}
	});
</script>

<style scoped lang="scss">
	.update-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.update-content {
		background: #fff;
		padding: 30px;
		border-radius: 8px;
		text-align: center;
		min-width: 300px;

		h3 {
			margin: 0 0 15px;
			color: #303133;
		}

		p {
			margin: 10px 0;
			color: #606266;
		}

		.contact {
			color: #909399;
			font-size: 12px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.container {
		padding: 20px;
		.right {
			display: flex;
			flex-direction: column;
			align-content: center;
		}
	}
</style>
