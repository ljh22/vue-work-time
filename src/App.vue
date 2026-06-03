<template>
	<el-config-provider :message="messageConfig">
		<div v-if="newVersion" class="update-dialog">
			<div class="update-content">
				<h3>检测到新版本发布！</h3>
				<p>最新版本: {{ newVersion }}</p>
				<div class="contact">
					请自行
					<el-link
						type="primary"
						:underline="false"
						:disabled="downloadDisabled"
						:loading="downloadLoading"
						@click="handleDownload"
						>下载</el-link
					>
					获取最新版本，解压后添加到浏览器插件
				</div>
				<el-button type="primary" @click="handleConfirmVersion">我知道了</el-button>
			</div>
		</div>
		<div class="app-wrapper">
			<header class="app-header">
				<div class="header-content">
					<div class="logo-section">
						<div class="logo-mark">
							<img src="/workTime.png" alt="logo" class="logo-img" />
						</div>
						<div class="title-group">
							<h1 class="app-title">工时计算工具</h1>
							<span class="app-subtitle">考勤数据解析与月度工时核对</span>
						</div>
					</div>
					<div class="header-actions">
						<TipsComp
							ref="tipsCompRef"
							@show-to-use="handleShowToUse"
							@showTourSecond="handleShowTourSecond"
						></TipsComp>
					</div>
				</div>
			</header>

			<main class="main-container">
				<div class="content-card">
					<ModalComp
						:isShowUse="isShowUse"
						@show-to-use="handleShowToUse"
						@close-use="handleCloseUse"
						:isShowTourSecond="isShowTourSecond"
						@restart-guide="handleRestartGuide"
					></ModalComp>
				</div>
			</main>

			<footer class="app-footer">
				<div class="version-info">
					<span>Version {{ CURRENT_VERSION }}</span>
					<span class="dot">·</span>
					<el-link type="info" :underline="false" href="https://gitee.com/ljh-project/vue-work-time" target="_blank"
						>Gitee</el-link
					>
				</div>
			</footer>
		</div>
	</el-config-provider>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue';
	import utils from '@/utils/utils';
	import { CURRENT_VERSION } from '@/utils/version';
	import TipsComp from './components/TipsComp.vue';
	import ModalComp from './components/ModalComp.vue';

	const isShowUse = ref(false);
	const isShowTourSecond = ref(false);
	const newVersion = ref('');
	const downloadLoading = ref(false);
	const downloadDisabled = ref(false);
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

	// 下载最新版本
	const handleDownload = async () => {
		if (downloadDisabled.value) return;

		downloadLoading.value = true;
		downloadDisabled.value = true;

		try {
			const response = await fetch('https://gitee.com/ljh-project/vue-work-time/raw/master/dist.zip');
			if (!response.ok) throw new Error('下载失败');
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'dist.zip';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			// 如果直接下载失败，回退到打开页面
			window.open('https://gitee.com/ljh-project/vue-work-time/blob/master/dist.zip', '_blank');
		} finally {
			downloadLoading.value = false;
			// 10秒后恢复可点击
			setTimeout(() => {
				downloadDisabled.value = false;
			}, 10000);
		}
	};

	// 挂载时检查版本
	onMounted(() => {
		const result = utils.checkVersionUpdate();
		if (result.needUpdate) {
			newVersion.value = result.currentVersion;
		}
	});

	// 用户确认版本更新
	const handleConfirmVersion = () => {
		if (newVersion.value) {
			utils.confirmVersion(newVersion.value);
		}
		newVersion.value = '';
	};
</script>

<style scoped lang="scss">
	.app-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: transparent;
	}

	.app-header {
		background-color: var(--app-surface-color);
		backdrop-filter: blur(18px);
		box-shadow: 0 1px 0 rgba(15, 23, 42, 0.06);
		border-bottom: 1px solid rgba(148, 163, 184, 0.22);
		padding: 0 24px;
		min-height: 72px;
		display: flex;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 1000;
	}

	.header-content {
		max-width: 1280px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo-section {
		display: flex;
		align-items: center;
		gap: 14px;

		.logo-mark {
			width: 44px;
			height: 44px;
			display: grid;
			place-items: center;
			border-radius: 12px;
			background: linear-gradient(135deg, var(--el-color-primary-light-8), #ecfdf5);
			border: 1px solid rgba(64, 158, 255, 0.2);
			box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

			.logo-img {
				width: 28px;
				height: 28px;
			}
		}

		.title-group {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.app-title {
			margin: 0;
			font-size: 20px;
			line-height: 1.2;
			font-weight: 700;
			color: var(--el-text-color-primary);
		}

		.app-subtitle {
			font-size: 12px;
			color: var(--el-text-color-secondary);
		}
	}

	.main-container {
		flex: 1;
		padding: 28px 24px 18px;
		max-width: 1280px;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.content-card {
		background-color: var(--app-surface-color);
		border: 1px solid rgba(148, 163, 184, 0.24);
		border-radius: 18px;
		box-shadow: var(--app-shadow-strong);
		padding: 26px;
		min-height: 420px;
	}

	html.dark .app-header {
		border-color: rgba(255, 255, 255, 0.08);
	}

	html.dark .content-card {
		background-color: var(--el-bg-color);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.app-footer {
		padding: 24px;
		text-align: center;
		color: var(--el-text-color-secondary);

		.version-info {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			font-size: 14px;

			.dot {
				color: var(--el-text-color-placeholder);
			}
		}
	}

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
		backdrop-filter: blur(4px);
	}

	.update-content {
		background: var(--app-surface-solid);
		padding: 30px;
		border-radius: 16px;
		text-align: center;
		min-width: 320px;
		border: 1px solid var(--el-border-color-light);
		box-shadow: var(--app-shadow-strong);

		h3 {
			margin: 0 0 15px;
			color: var(--el-text-color-primary);
		}

		p {
			margin: 10px 0;
			color: var(--el-text-color-regular);
		}

		.contact {
			color: var(--el-text-color-secondary);
			font-size: 13px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 4px;
		}
	}

	@media (max-width: 760px) {
		.app-header {
			padding: 12px 16px;
		}

		.header-content {
			align-items: flex-start;
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
		}

		.main-container {
			padding: 22px 14px 14px;
		}

		.content-card {
			padding: 16px;
			border-radius: 14px;
		}
	}
</style>
