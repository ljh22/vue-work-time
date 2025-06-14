<template>
	<div class="modal-container">
		<el-input
			class="time-textarea"
			v-model="textarea2"
			style="width: 60%"
			:autosize="{ minRows: 2, maxRows: 4 }"
			type="textarea"
			placeholder="请粘贴打卡JSON数据"
		/>
	</div>
</template>
<script lang="ts">
	export default {
		name: 'ModalComp',
	};
</script>

<script setup lang="ts">
	import { ref } from 'vue';

	const textarea2 = ref('');
</script>

<style scoped lang="scss">
	.modal-container {
		:deep(.el-textarea .el-textarea__inner) {
			height: 300px !important;
			padding: 10px;
			box-sizing: border-box;
			font-size: 14px;
			margin-bottom: 50px;
			border-radius: 10px;
			box-shadow: 0 0 6px #838383;
		}
	}
</style>
