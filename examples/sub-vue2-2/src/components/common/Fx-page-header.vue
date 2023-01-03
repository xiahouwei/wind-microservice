<template>
	<div class="page-header fx-block-title">
		<div v-if="!Array.isArray(title)" class="page-header__text">{{title}}</div>
		<div v-else class="page-header__text">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="item in title" :key="item">{{item}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fx-page-header',
	props: {
		title: [String, Array]
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.page-header {
	display: flex;
	flex-direction: row;
	height: 44px;
	align-items: center;
	font-size: 15px;
	font-weight: 700;
	position:relative
	padding-left: 5px
	&__text {
		flex: 1;
	}
}
</style>

