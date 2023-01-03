<template>
	<fx-card title="常用报表" class="report-container">
		<!-- <div slot="title-right">
			<w-icon pointer type="auth-setting"></w-icon>
		</div> -->
		<div class="report-content">
			<div class="report-item" v-for="(report,index) in reportList" :key="index">
				<span class="report-tag__dot"></span>
				<span>{{report.label}}</span>
			</div>
		</div>
	</fx-card>
</template>
<script>
export default {
	name: 'report',
	data () {
		return {
			reportList: [{
				id: 1,
				label: '库存表'
			}, {
				id: 2,
				label: '出库明细表'
			}, {
				id: 3,
				label: '入库明细表'
			}]
		}
	},
	methods: {
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.report-container {
	flex 1
	margin-left 18px
	.report-content {
		display flex
		flex-direction column
		margin-top 15px
		margin-left 20px
		font-size 14px
		color $fxBlue6
		.report-item {
			display flex
			align-items center
			line-height 40px
			&:hover {
				color $fxBlue
				text-decoration underline
				cursor pointer
			}
			.report-tag__dot {
				width 8px
				height 8px
				border-radius 50%
				margin-right 10px
				margin-left 5px
				background-color $fxBlue5
			}
		}
	}
}
</style>

