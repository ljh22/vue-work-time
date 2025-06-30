<template>
	<el-config-provider :message="messageConfig">
		<div class="container">
			<el-row :gutter="0">
				<el-col :span="6">
					<div class="left">
						<TipsComp @show-to-use="handleShowToUse"></TipsComp>
					</div>
				</el-col>
				<el-col :span="18">
					<div class="right">
						<ModalComp :isShowUse="isShowUse" @close-use="handleCloseUse"></ModalComp>
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
