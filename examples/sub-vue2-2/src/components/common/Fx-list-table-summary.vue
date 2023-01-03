<template>
	<w-popover
		trigger="hover"
		placement="top-start"
		width="400"
		:visible-arrow="false"
		popper-class="list-table-summary"
	>
		<div slot="reference" class="list-table-summary-label fx-cursor fx-default-font">
			<w-icon type="tabel-sum"></w-icon>
			<span>合计</span>
		</div>
		<div class="list-table-summary-popover">
			<div class="list-table-summary-popover__row">
				<div class="summary-key">列名</div>
				<div class="summary-value">全部合计</div>
				<div class="summary-value">选中合计</div>
			</div>
			<div v-for="item in columns" :key="item.prop" class="list-table-summary-popover__row">
				<div class="summary-key">{{item.label}}</div>
				<div class="summary-value">{{summaryData[item.prop] | filterAutoZeroFill({ len: getSummaryDataPointSize(item.summaryType) })}}</div>
				<div class="summary-value">{{selectSummaryData[item.prop]}}</div>
			</div>
		</div>
	</w-popover>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'fx-list-summary',
	props: {
		columns: {
			type: Array,
			default: () => {
				return []
			}
		},
		summaryData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		selectSummaryData: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize
		})
	},
	methods: {
		getSummaryDataPointSize (type) {
			switch (type) {
			case 'amount':
				return this.sysPointSize
			case 'price':
				return this.sysPricePointSize
			case 'money':
				return this.sysMoneyPointSize
			default:
				return this.sysMoneyPointSize
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-table-summary-label {
	display: flex;
    flex-direction: row;
    align-items: center;
	font-size: 14px
}
.list-table-summary-popover {
	font-size: 12px
	color: $fxWhite
	&__row {
		display: flex
		flex-direction: row
		height: 20px
		line-height: 20px
	}
	.summary-key {
		flex: 1
	}
	.summary-value {
		flex: 1
	}
}
</style>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
.list-table-summary {
	background-color: $fxBlack
	opacity: 0.9
}
</style>
