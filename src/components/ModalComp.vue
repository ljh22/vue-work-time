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
			:autosize="{ minRows: 10, maxRows: 999 }"
			type="textarea"
			placeholder="请粘贴打卡JSON数据"
			@change="handleChangeTextarea"
		/>
		<ButtonControl
			@handleShowTable="handleShowTable"
			@handleChangeTableData="handleChangeTableData"
			:tableInitData="tableInitData"
		></ButtonControl>
		<TableComp v-show="showTable" :showTableInitData="showTableInitData"></TableComp>
	</div>
</template>
<script lang="ts">
	export default {
		name: 'ModalComp',
	};
</script>

<script setup lang="ts">
	import { ref, onMounted, watch, inject } from 'vue';
	import { Moon, Sunny } from '@element-plus/icons-vue';
	import type { TableData } from '@/types/TableData';
	import type { Utils } from '@/types/utils';
	// 注入全局工具
	const utils = inject<Utils>('$utils')!;

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
	const showTable = ref(false);

	const handleChangeTextarea = (value: string) => {
		// 处理输入框内容变化
		tableInitData.value = JSON.parse(value);
	};

	// 从localStorage读取暗黑模式状态，默认为false
	const darkMode = ref(localStorage.getItem('darkMode') === 'true');

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
		showTable.value = show;
	};

	const handleChangeColor = (value: string) => {
		color.value = value;
		// 动态更新主题色
		utils.updateThemeColor(value);
	};
	const handleChangeTableData = (data: TableData[]) => {
		showTableInitData.value = data;
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
	}
</style>
