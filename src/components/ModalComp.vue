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
		</div>
		<el-input
			class="time-textarea"
			v-model="textareaValue"
			style="width: 60%"
			:autosize="{ minRows: 10, maxRows: 30 }"
			type="textarea"
			placeholder="请粘贴打卡JSON数据"
			@change="handleChangeTextarea"
		/>
		<ButtonControl
			@handleShowTable="handleShowTable"
			@handleChangeTableData="handleChangeTableData"
			:tableInitData="tableInitData"
		></ButtonControl>
		<TableComp
			v-if="isShowTable"
			:showTableInitData="showTableInitData"
			:CalculationMethodType="CalculationMethodType"
		></TableComp>
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
	</div>
</template>
<script lang="ts">
	export default {
		name: 'ModalComp',
	};
</script>

<script setup lang="ts">
	import { ref, onMounted, watch, inject, nextTick } from 'vue';
	import { Moon, Sunny } from '@element-plus/icons-vue';
	import type { TableData } from '@/types/TableData';
	import type { Utils } from '@/types/utils';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

	// 定义props
	const props = defineProps<{
		isShowUse: boolean;
	}>();

	// 定义emits
	const emit = defineEmits<{
		'close-use': [];
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
	const isShowTable = ref(false);
	const CalculationMethodType = ref<number>(-1);

	const handleChangeTextarea = (value: string) => {
		// 处理输入框内容变化
		if (value.slice(-1) == ',') {
			tableInitData.value = JSON.parse(value.slice(0, -1));
		} else {
			tableInitData.value = JSON.parse(value);
		}
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
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});
					}
				});
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

	// 组件挂载时初始化主题色和暗黑模式
	onMounted(() => {
		utils.updateThemeColor(color.value);

		initDarkMode();
	});
</script>

<style scoped lang="scss">
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
