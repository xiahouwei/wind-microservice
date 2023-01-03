<template>
	<fx-card title="我的公告" class="notice-container">
		<div class="notice-content">供应链8，重磅来袭！更多功能，敬请期待！</div>
	</fx-card>
</template>
<script>
export default {
	name: 'noticeBoard',
	data () {
		return {
		}
	},
	methods: {
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.notice-container {
	flex 1
	width 100%
	min-height 255px
	margin-top 20px
	margin-bottom 15px
	.notice-content {
		padding-top 20px
		font-size 14px
	}
}
</style>

