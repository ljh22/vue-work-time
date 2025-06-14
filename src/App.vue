<template>
	<div class="container">
		<!-- <el-splitter>
			<el-splitter-panel size="20%" :min="400">
				<div class="left">
					<TipsComp></TipsComp>
				</div>
			</el-splitter-panel>
			<el-splitter-panel :min="200" size="75%">
				<div class="right">2</div>
			</el-splitter-panel>
		</el-splitter> -->
		<el-row :gutter="0">
			<el-col :span="6">
				<div class="left">
					<TipsComp></TipsComp>
				</div>
			</el-col>
			<el-col :span="18">
				<div class="right">
					<ModalComp></ModalComp>
					<ButtonControl></ButtonControl>
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
		margin: 20px;
		.right {
			display: flex;
			flex-direction: column;
			align-content: center;
		}
	}
</style>
