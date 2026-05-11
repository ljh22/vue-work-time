<template>
	<div class="modal-container">
		<div class="theme-box">
			<div class="color-picker">
				<el-text class="color-text">主题色选择</el-text>
				<el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="handleChangeColor" />
			</div>
			<div class="dark-box">
				<el-text class="dark-text">深色模式</el-text>
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
			<div class="guide-box">
				<el-tooltip content="重新查看使用引导" placement="left">
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
		<el-input
			ref="textarea"
			class="time-textarea"
			v-model="textareaValue"
			style="width: 60%"
			:autosize="{ minRows: 10, maxRows: 30 }"
			type="textarea"
			placeholder="请粘贴打卡JSON数据"
			@change="handleChangeTextarea"
			@focus="handleTextareaFocus"
		/>
		<ButtonControl
			ref="buttonControlRef"
			@handleShowTable="handleShowTable"
			@handleChangeTableData="handleChangeTableData"
			@handleChangeTableDataNew="handleChangeTableDataNew"
			:tableInitData="tableInitData"
		></ButtonControl>
		<TableComp
			v-if="isShowTable"
			:showTableInitData="showTableInitData"
			:showTableDataNew="showTableDataNew"
			:CalculationMethodType="CalculationMethodType"
			@update-data="handleUpdateTableData"
		></TableComp>
		<Transition name="slide-fade">
			<div class="how-to-use-box" v-if="props.isShowUse">
			<div class="close-button-container">
				<el-button type="primary" size="small" @click="handleCloseUse" class="close-button"> 关闭 </el-button>
			</div>
			<strong>1. 打开个人考勤，点击查看打卡数据，随后打开控制台（快捷键F12）点到 network 选项卡，清空请求数据</strong>
			<br />
			<br />
			<img src="https://foruda.gitee.com/images/1711614780301895326/9c11fc4b_10888693.png" alt="" loading="lazy" />
			<img src="https://foruda.gitee.com/images/1751190501730420066/a6ddeb8e_10888693.png" alt="" loading="lazy" />
			<br />

			<strong>2.清空数据后，选择50条数据，点击 getLocSetDataByPage 请求，切换到 response</strong>
			<br />
			<br />
			<img src="https://foruda.gitee.com/images/1751190497927676192/38c3991e_10888693.png" alt="" loading="lazy" />
			<img src="https://foruda.gitee.com/images/1711615026549164653/9f871844_10888693.png" alt="" loading="lazy" />
			<br />

			<strong>3.找到 items，点击左侧收起的小图标，之后仅仅复制这个数组,带不带后面的逗号均可以</strong>
			<br />
			<br />
			<img src="https://foruda.gitee.com/images/1711615092070250659/a95d1b2c_10888693.png" alt="" loading="lazy" />
			<img src="https://foruda.gitee.com/images/1711615148303292328/279ba83a_10888693.png" alt="" loading="lazy" />
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

	const handleCloseUse = () => {
		emit('close-use');
	};

	// 从localStorage读取暗黑模式状态，默认为false
	const darkMode = ref(localStorage.getItem('darkMode') === 'true');

	// 平滑滚动到指定元素
	const smoothScrollToElement = (element: Element) => {
		// 计算元素相对于文档顶部的位置
		const elementPosition = element.getBoundingClientRect().top + window.scrollY;
		const startPosition = window.scrollY;
		const distance = elementPosition - startPosition;
		const duration = 600; // 滚动持续时间
		const startTime = performance.now();

		const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeProgress = easeOutCubic(progress);

			window.scrollTo({
				top: startPosition + distance * easeProgress,
				left: 0,
			});

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};

	// 监听isShowUse变化，自动滚动到使用说明区域
	watch(
		() => props.isShowUse,
		newValue => {
			if (newValue) {
				// 使用nextTick确保DOM已更新
				nextTick(() => {
					const element = document.querySelector('.how-to-use-box');
					if (element) {
						smoothScrollToElement(element);
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
					const root = buttonControlElement.value ?? utils.getComponentRoot(buttonControlRef);
					if (root instanceof HTMLElement) {
						const submitButton = root.querySelector('.submit') as HTMLElement | null;
						if (submitButton) {
							submitButton.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							});
						}
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

	.slide-fade-enter-active {
		transition: opacity 0.5s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.4s ease-in;
	}

	.slide-fade-enter-from {
		opacity: 0;
	}

	.slide-fade-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}

	.modal-container {
		position: relative;
		.theme-box {
			position: fixed;
			right: 20px;
			top: 10px;
			.color-picker {
				.color-text {
					margin-right: 10px;
				}
			}
			.dark-box {
				margin-top: 10px;
				.dark-text {
					margin-right: 10px;
				}
			}
			.guide-box {
				margin-top: 10px;
				display: flex;
				justify-content: flex-end;
				.guide-button {
					transition: all 0.3s ease;
					width: 36px;
					height: 36px;
					padding: 0;
					&:hover {
						transform: scale(1.1);
						box-shadow: 0px 2px 8px var(--el-color-primary-light-3);
					}
					:deep(.el-button--primary) {
						background-color: var(--el-color-primary) !important;
						border-color: var(--el-color-primary) !important;
						&:hover {
							background-color: var(--el-color-primary) !important;
							border-color: var(--el-color-primary) !important;
						}
					}
					:deep(.el-icon) {
						font-size: 20px;
					}
				}
			}
			:deep(.el-textarea .el-textarea__inner) {
				min-height: 300px !important;
				padding: 10px;
				box-sizing: border-box;
				font-size: 14px;
				margin-bottom: 50px;
				border-radius: 10px;
				box-shadow: 0 0 6px #838383;
			}
			:deep(.el-switch) {
				.el-switch__core {
					transition: box-shadow 0.3s ease;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
					&:hover {
						box-shadow: 0px 2px 13px 1px var(--el-color-primary);
					}
					.el-switch__action {
						align-items: flex-start;
						// 当包含custom-active-action时给el-switch__action添加边框
						&:has(.custom-active-action) {
							border: 1px solid var(--el-color-primary);
							line-height: 20px;
						}
						.custom-inactive-action {
							.sunny {
								color: #000;
							}
						}
						.custom-active-action {
							.moon-icon {
								color: #000;
							}
						}
					}
				}
			}

			// 暗黑模式下的发光效果
			.dark & :deep(.el-switch) {
				.el-switch__core {
					&:hover {
						box-shadow: 0px 2px 13px 1px var(--el-color-primary);
					}
				}
			}
		}
		.time-textarea {
			:deep(textarea) {
				max-height: 400px;
			}
			// 确保聚焦状态下的边框在有滚动条时也能正常显示
			:deep(.el-textarea__inner) {
				&:focus {
					// border: 1px solid var(--el-color-primary) !important;
					box-shadow: 0 0 0 1px var(--el-color-primary) !important;
					outline: none !important;
				}
				// 确保滚动条不会覆盖边框
				box-sizing: border-box;
				padding-right: 12px;
				// 修复滚动条角落的白色间隙问题
				scrollbar-color: var(--el-border-color-light) transparent;
				scrollbar-width: thin;
				// Webkit浏览器滚动条样式
				&::-webkit-scrollbar {
					width: 8px;
				}
				&::-webkit-scrollbar-track {
					background: transparent;
					border-radius: 10px;
				}
				&::-webkit-scrollbar-thumb {
					background: var(--el-border-color-light);
					border-radius: 10px;
					&:hover {
						background: var(--el-border-color);
					}
				}
				// 修复滚动条角落
				&::-webkit-scrollbar-corner {
					background: transparent;
				}
			}
		}
		.how-to-use-box {
			margin-top: 20px;
			width: 90%;
			margin-left: -185px;
			display: flex;
			padding: 24px;
			border: 1px solid #ccc;
			flex-direction: column;
			position: relative;
			img {
				border: 1px solid #ccc;
				margin-bottom: 10px;
				width: 90%;
				animation: fadeInUp 0.6s ease-out;
			}

			.close-button-container {
				position: fixed;
				top: 50%;
				right: 20px;
				transform: translateY(-50%);
				z-index: 1000;

				.close-button {
					border-radius: 50%;
					width: 40px;
					height: 40px;
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
				}
				:deep(.el-button) {
					border: none;
					&:hover {
						background-color: var(--el-color-primary);
						box-shadow: 0px 1px 3px 1px #535454;
					}
				}
			}
		}
	}
</style>
