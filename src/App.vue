<template>
	<div class="container">
		<el-row :gutter="0">
			<el-col :span="6">
				<div class="left">
					<TipsComp></TipsComp>
				</div>
			</el-col>
			<el-col :span="18">
				<div class="right">
					<ModalComp></ModalComp>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
	import TipsComp from './components/TipsComp.vue';
	import ModalComp from './components/ModalComp.vue';
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
