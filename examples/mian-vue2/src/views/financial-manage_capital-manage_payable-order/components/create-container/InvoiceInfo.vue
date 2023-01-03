<template>
	<w-collapse v-model="collapseVisible" contentHeight="200px" title="发票信息">
		<fx-details-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:tableData="tableData"
			:showTools="false"
			:selectable="false"
			:canAdd="false"
			minHeight="190px"
		>
			<div slot="empty">暂无发票信息</div>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'invoiceInfo',
	props: {
		isFullScreen: Boolean,
		visibleFlag: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			collapseVisible: false,
			tableColumn: [
				{ prop: 'invoicingCode', label: '发票号码', width: '150px' },
				{ prop: 'invoicingDate', label: '开票时间', width: '150px' },
				{ prop: 'invoicingType.name', label: '发票类型' },
				{ prop: 'salesOrgan.name', label: '销售方名称', width: '200px' },
				{
					prop: 'inMoney',
					label: '不含税金额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxMoney',
					label: '价税合计',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)
					}
				}
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		tableData () {
			return this.organDetails.invoices || []
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (!val) {
					this.collapseVisible = false
				}
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
