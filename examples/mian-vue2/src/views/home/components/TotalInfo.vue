<template>
	<fx-card class="total-container">
		<div class="total-item" v-for="item in totalInfoList" :key="item.id">
			<w-icon :type="item.icon" class="total-icon"></w-icon>
			<div class="total-info">
				<div class="total-info-num">{{item.number}}</div>
				<div class="total-info-label">{{item.label}}</div>
			</div>
		</div>
	</fx-card>
</template>
<script>
export default {
	name: 'totalInfo',
	data () {
		return {
			totalInfoList: [{
				id: 1,
				icon: 'total-order-size',
				label: '订货量',
				number: '999999'
			}, {
				id: 2,
				icon: 'total-stock-money',
				label: '本月进货金额',
				number: '99999.00'
			}, {
				id: 3,
				icon: 'total-cost-money',
				label: '本月成本金额',
				number: '99999.00'
			}, {
				id: 4,
				icon: 'total-sale-money',
				label: '本月销售金额',
				number: '99999.00'
			}, {
				id: 5,
				icon: 'total-gross-margin',
				label: '毛利率',
				number: '200%'
			}]
		}
	},
	methods: {
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.total-container {
	flex 1
	display flex
	width 100%
	min-height 117px
	padding 0
	margin-top 15px
	.total-item {
		position relative
		flex 1
		display flex
		justify-content center
		align-items center
		&:not(:last-child):after {
			content: ''
			position absolute
			right 0
			width 1px
			background-color $fxBorder
			height 50px
		}
		.total-icon {
			width 55px
			height 55px
			margin-right 30px
		}
		.total-info {
			&-num {
				font-size 24px
				font-weight bold
				margin-bottom 15px
			}
			&-label {
				font-size 16px
			}
		}
	}
}
</style>

