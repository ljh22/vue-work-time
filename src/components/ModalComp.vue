<template>
	<div class="modal-container">
		<div class="settings-bar">
			<div class="setting-item">
				<span class="label">主题色</span>
				<el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="handleChangeColor" />
			</div>
			<div class="setting-item">
				<span class="label">深色模式</span>
				<el-switch
					v-model="darkMode"
					size="large"
					style="--el-switch-on-color: #ffffff; --el-switch-off-color: #f9ca24"
				>
					<template #inactive-action>
						<span class="custom-inactive-action">
							<el-icon class="sunny"><Sunny /></el-icon>
						</span>
					</template>
					<template #active-action>
						<span class="custom-active-action">
							<el-icon class="moon-icon"><Moon /></el-icon>
						</span>
					</template>
				</el-switch>
			</div>
			<div class="setting-item">
				<el-tooltip content="重新查看使用引导" placement="bottom">
					<el-button
						ref="guideButtonRef"
						type="primary"
						:icon="QuestionFilled"
						circle
						size="default"
						@click="handleRestartGuide"
						class="guide-button"
					/>
				</el-tooltip>
			</div>
		</div>

		<div class="input-section">
			<div class="input-header">
				<h2 class="section-title">数据导入</h2>
				<el-button type="primary" link @click="handleShowToUse">查看获取教程</el-button>
			</div>
			<el-input
				ref="textarea"
				class="time-textarea"
				v-model="textareaValue"
				:autosize="{ minRows: 8, maxRows: 15 }"
				type="textarea"
				placeholder="请粘贴考勤 JSON 数据（例如从 Chrome 控制台 Network 面板复制的 items 数组）"
				@change="handleChangeTextarea"
				@focus="handleTextareaFocus"
			/>
			<div class="control-wrapper">
				<ButtonControl
					ref="buttonControlRef"
					@handleShowTable="handleShowTable"
					@handleChangeTableData="handleChangeTableData"
					@handleChangeTableDataNew="handleChangeTableDataNew"
					:tableInitData="tableInitData"
				></ButtonControl>
			</div>
		</div>

		<Transition name="fade">
			<div v-if="isShowTable" class="result-section">
				<div class="section-header">
					<h2 class="section-title">考勤统计结果</h2>
				</div>
				<TableComp
					:showTableInitData="showTableInitData"
					:showTableDataNew="showTableDataNew"
					:CalculationMethodType="CalculationMethodType"
					@update-data="handleUpdateTableData"
				></TableComp>
			</div>
		</Transition>

		<Transition name="slide-fade">
			<div class="how-to-use-box" v-if="props.isShowUse">
				<div class="guide-header">
					<h3>获取数据教程</h3>
				</div>
				<div class="guide-content">
					<div class="guide-step">
						<div class="step-num">1</div>
						<div class="step-detail">
							<p>打开个人考勤，点击查看打卡数据，随后打开控制台（F12）点到 Network 选项卡，清空请求数据</p>
							<div class="step-images">
								<img
									src="https://foruda.gitee.com/images/1711614780301895326/9c11fc4b_10888693.png"
									alt=""
									loading="lazy"
								/>
								<img
									src="https://foruda.gitee.com/images/1751190501730420066/a6ddeb8e_10888693.png"
									alt=""
									loading="lazy"
								/>
							</div>
						</div>
					</div>
					<div class="guide-step">
						<div class="step-num">2</div>
						<div class="step-detail">
							<p>选择 50 条数据，点击 getLocSetDataByPage 请求，切换到 Response 标签页</p>
							<div class="step-images">
								<img
									src="https://foruda.gitee.com/images/1751190497927676192/38c3991e_10888693.png"
									alt=""
									loading="lazy"
								/>
								<img
									src="https://foruda.gitee.com/images/1711615026549164653/9f871844_10888693.png"
									alt=""
									loading="lazy"
								/>
							</div>
						</div>
					</div>
					<div class="guide-step">
						<div class="step-num">3</div>
						<div class="step-detail">
							<p>找到 items 数组，复制整个数组内容即可（带不带后面逗号均可）</p>
							<div class="step-images">
								<img
									src="https://foruda.gitee.com/images/1711615092070250659/a95d1b2c_10888693.png"
									alt=""
									loading="lazy"
								/>
								<img
									src="https://foruda.gitee.com/images/1711615148303292328/279ba83a_10888693.png"
									alt=""
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- 全局固定关闭按钮 -->
		<Transition name="fade">
			<div class="fixed-close-action" v-if="props.isShowUse">
				<el-tooltip content="关闭使用说明" placement="left">
					<el-button
						type="danger"
						:icon="utils.getIcon('Close')"
						circle
						@click="handleCloseUse"
						class="global-close-btn"
					/>
				</el-tooltip>
			</div>
		</Transition>
	</div>
	<el-tour v-model="isShowTourSecond" :close-on-click-modal="true" @close="closeTourSecond">
		<el-tour-step :target="textareaElement" title="使用指南" placement="bottom">
			<div class="step-font">这里粘贴打卡JSON数据</div>
		</el-tour-step>
		<el-tour-step :target="buttonControlElement" title="提交数据" placement="right">
			<div class="step-font">点击这里按钮选择处理数据格式以及提交数据，解析打卡记录</div>
		</el-tour-step>
		<el-tour-step :target="guideButtonElement" title="再次查看" placement="left">
			<div class="step-font">点击这里重新查看引导步骤</div>
		</el-tour-step>
		<template #indicators="{ current, total }">
			<span>{{ current + 1 }} / {{ total }}</span>
		</template>
	</el-tour>
</template>
<script lang="ts">
	export default {
		name: 'ModalComp',
	};
</script>

<script setup lang="ts">
	import { ref, onMounted, watch, inject, nextTick } from 'vue';
	import { Moon, Sunny, QuestionFilled } from '@element-plus/icons-vue';
	import type { TableData, ProcessedData } from '@/types/TableData';
	import type { Utils } from '@/types/utils';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

	const isShowTourSecond = ref(false);
	const textarea = ref<HTMLElement | null>(null);
	const buttonControlRef = ref<HTMLElement | null>(null);
	const guideButtonRef = ref<HTMLElement | null>(null);
	const textareaElement = ref<HTMLElement | null>(null);
	const buttonControlElement = ref<HTMLElement | null>(null);
	const guideButtonElement = ref<HTMLElement | null>(null);

	onMounted(() => {
		// 等待DOM更新后获取元素
		nextTick(() => {
			// // 获取组件的根DOM元素
			textareaElement.value = utils.getComponentRoot(textarea);
			buttonControlElement.value = utils.getComponentRoot(buttonControlRef);
			guideButtonElement.value = utils.getComponentRoot(guideButtonRef);

			// 延迟100ms确保DOM完全渲染
			// setTimeout(() => {
			// open.value = true; // 此时DOM已就绪
			// }, 800); //处理tip动画之后开始引导
		});
	});
	const closeTourSecond = () => {
		// 关闭使用指南第二步
		isShowTourSecond.value = false;
		// 注意：这里不设置localStorage，允许用户再次查看引导
	};

	// 重新启动引导
	const handleRestartGuide = () => {
		// 先重置右侧引导状态
		isShowTourSecond.value = false;
		// 重新获取元素引用，确保DOM已更新
		nextTick(() => {
			textareaElement.value = utils.getComponentRoot(textarea);
			buttonControlElement.value = utils.getComponentRoot(buttonControlRef);
			guideButtonElement.value = utils.getComponentRoot(guideButtonRef);
			// 触发父组件重新启动左侧引导
			emit('restart-guide');
		});
	};

	// 定义props
	const props = defineProps<{
		isShowUse: boolean;
		isShowTourSecond: boolean;
	}>();

	// 定义emits
	const emit = defineEmits<{
		'close-use': [];
		'show-to-use': [];
		'restart-guide': [];
	}>();

	// 默认主题色值（对应 $primary-base: #409eff）
	const defaultPrimaryColor = '#409eff';
	const color = ref(defaultPrimaryColor);

	const predefineColors = ref([
		'#409eff', // 默认主题色
		'#ff4500',
		'#ff8c00',
		'#ffd700',
		'#90ee90',
		'#00ced1',
		'#1e90ff',
		'#c71585',
		'rgba(255, 69, 0, 0.68)',
		'rgb(255, 120, 0)',
		'hsv(51, 100, 98)',
		'hsva(120, 40, 94, 0.5)',
		'hsl(181, 100%, 37%)',
		'hsla(209, 100%, 56%, 0.73)',
		'#c7158577',
	]);

	const textareaValue = ref('');
	const tableInitData = ref<TableData[]>([]);
	const showTableInitData = ref<TableData[]>([]);
	const showTableDataNew = ref<ProcessedData[]>([]);
	const isShowTable = ref(false);
	const CalculationMethodType = ref<number>(-1);

	const handleChangeTextarea = (value: string) => {
		// 如果输入的内容是"items":开头的数据，把"items":也去除(匹配前面任意个空格)
		if (/^\s*"items":/.test(value)) {
			value = value.replace(/^\s*"items":\s*/, '');
		}
		// 处理输入框内容变化
		if (value.slice(-1) == ',') {
			tableInitData.value = JSON.parse(value.slice(0, -1));
		} else {
			tableInitData.value = JSON.parse(value);
		}
	};

	const handleTextareaFocus = () => {
		// 当textarea聚焦时，清空表格数据
		isShowTable.value = false;
		showTableInitData.value = [];
		showTableDataNew.value = [];
		CalculationMethodType.value = -1;
	};

	const handleShowToUse = () => {
		emit('show-to-use');
	};

	const handleCloseUse = () => {
		emit('close-use');
	};

	// 从localStorage读取暗黑模式状态，默认为false
	const darkMode = ref(localStorage.getItem('darkMode') === 'true');

	// 监听isShowUse变化，自动滚动到使用说明区域
	watch(
		() => props.isShowUse,
		newValue => {
			if (newValue) {
				// 使用nextTick确保DOM已更新
				nextTick(() => {
					const element = document.querySelector('.how-to-use-box');
					if (element) {
						// 考虑到顶部有 64px 的 sticky header，滚动时需要留出偏移
						const headerHeight = 80; // 64px header + 一些间距
						const elementPosition = element.getBoundingClientRect().top + window.scrollY;

						window.scrollTo({
							top: elementPosition - headerHeight,
							behavior: 'smooth',
						});
					}
				});
			}
		},
	);

	// 单独监听右侧引导状态变化
	watch(
		() => props.isShowTourSecond,
		(newValue, oldValue) => {
			// 只在状态从false变为true时处理
			if (newValue && !oldValue) {
				// 当右侧引导状态变为true时，重新获取元素引用并启动引导
				nextTick(() => {
					textareaElement.value = utils.getComponentRoot(textarea);
					buttonControlElement.value = utils.getComponentRoot(buttonControlRef);
					guideButtonElement.value = utils.getComponentRoot(guideButtonRef);
					// 延迟一点时间确保元素引用已更新，然后再启动引导
					setTimeout(() => {
						if (props.isShowTourSecond) {
							// 确保外部状态仍然是true才启动
							isShowTourSecond.value = true;
						}
					}, 200);
				});
			} else if (!newValue) {
				// 如果外部设置为false，同步内部状态
				isShowTourSecond.value = false;
			}
		},
	);

	// 初始化暗黑模式
	const initDarkMode = () => {
		const htmlElement = document.documentElement;
		if (darkMode.value) {
			htmlElement.classList.add('dark');
		} else {
			htmlElement.classList.remove('dark');
		}
	};

	// 监听暗黑模式变化
	watch(darkMode, newValue => {
		const htmlElement = document.documentElement;
		if (newValue) {
			htmlElement.classList.add('dark');
			localStorage.setItem('darkMode', 'true');
		} else {
			htmlElement.classList.remove('dark');
			localStorage.setItem('darkMode', 'false');
		}
	});

	// 处理ButtonControl组件的提交完成事件
	const handleShowTable = (show: boolean) => {
		isShowTable.value = show;
		if (show) {
			nextTick(() => {
				setTimeout(() => {
					const element = document.querySelector('.result-section');
					if (element) {
						const headerHeight = 80;
						const elementPosition = element.getBoundingClientRect().top + window.scrollY;
						window.scrollTo({
							top: elementPosition - headerHeight,
							behavior: 'smooth',
						});
					}
				}, 100);
			});
		}
	};

	const handleChangeColor = (value: string) => {
		color.value = value;
		// 动态更新主题色
		utils.updateThemeColor(value);
	};
	const handleChangeTableData = (data: TableData[], type: number) => {
		showTableInitData.value = data;
		CalculationMethodType.value = type;
	};
	const handleChangeTableDataNew = (data: ProcessedData[], type: number) => {
		console.log('data: ', data);
		showTableDataNew.value = data;
		CalculationMethodType.value = type;
	};

	// 处理TableComp组件的数据更新事件
	const handleUpdateTableData = (data: TableData[]) => {
		showTableInitData.value = data;
		// 保留已处理的数据（法定节假日），不清空
	};

	// 组件挂载时初始化主题色和暗黑模式
	onMounted(() => {
		utils.updateThemeColor(color.value);

		initDarkMode();
	});
</script>

<style scoped lang="scss">
	.modal-container {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.settings-bar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.setting-item {
			display: flex;
			align-items: center;
			gap: 10px;
			:deep(.el-button) {
				border-color: var(--el-color-primary);
			}
			.label {
				font-size: 14px;
				color: var(--el-text-color-regular);
			}
		}
	}

	.section-title {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		color: var(--el-text-color-primary);
		position: relative;
		padding-left: 12px;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 4px;
			height: 18px;
			background-color: var(--el-color-primary);
			border-radius: 2px;
		}
	}

	.input-section {
		.input-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
			&:hover {
				:deep(.el-button) {
					span {
						color: var(--el-color-primary);
					}
				}
			}
		}

		.time-textarea {
			margin-bottom: 20px;

			:deep(.el-textarea__inner) {
				border-radius: 8px;
				padding: 12px;
				font-family: monospace;
				transition: all 0.3s;
				background-color: var(--el-fill-color-blank);

				&:focus {
					box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
				}
			}
		}

		.control-wrapper {
			display: flex;
			justify-content: center;
		}
	}

	.result-section {
		animation: fadeInUp 0.5s ease-out;

		.section-header {
			margin-bottom: 20px;
		}
	}

	.how-to-use-box {
		background-color: var(--el-fill-color-lighter);
		border-radius: 12px;
		padding: 24px;
		margin-top: 20px;
		border: 1px solid var(--el-border-color-light);
		position: relative; // 确保可以相对定位

		.guide-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24px;

			h3 {
				margin: 0;
				font-size: 18px;
			}
		}

		.guide-content {
			display: flex;
			flex-direction: column;
			gap: 32px;
		}

		.guide-step {
			display: flex;
			gap: 16px;

			.step-num {
				width: 28px;
				height: 28px;
				background-color: var(--el-color-primary);
				color: white;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				flex-shrink: 0;
			}

			.step-detail {
				flex: 1;

				p {
					margin: 0 0 16px 0;
					font-weight: 500;
					color: var(--el-text-color-primary);
				}

				.step-images {
					display: flex;
					flex-wrap: wrap;
					gap: 12px;

					img {
						max-width: 100%;
						height: auto;
						border-radius: 8px;
						border: 1px solid var(--el-border-color-lighter);
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
					}
				}
			}
		}
	}

	.fixed-close-action {
		position: fixed;
		right: 40px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2000;

		.global-close-btn {
			width: 56px;
			height: 56px;
			font-size: 24px;
			box-shadow: 0 4px 16px rgba(var(--el-color-danger-rgb), 0.3);
			transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			border: 2px solid white;

			&:hover {
				transform: scale(1.1) rotate(90deg);
				box-shadow: 0 6px 20px rgba(var(--el-color-danger-rgb), 0.5);
			}

			&:active {
				transform: scale(0.95);
			}
		}

		@media (max-width: 1400px) {
			right: 20px;
		}
	}

	.guide-button {
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

		&:hover {
			transform: translateY(-2px);
			background: var(--el-color-primary);
			box-shadow: 0 4px 12px var(--el-color-primary);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}
	.slide-fade-leave-active {
		transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
	}
	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(20px);
		opacity: 0;
	}

	:deep(.el-switch) {
		&.is-checked .el-switch__core {
			background-color: var(--el-color-primary);
		}
	}
</style>
