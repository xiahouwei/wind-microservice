<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="采购明细">
		<fx-details-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:canAdd="false"
			showSummary
			:showMistakeCheck="false"
			:defaultSortParam="defaultSortParam"
			:showDeleteBtn="false"
			@on-full-screen-click="onFullScreenClick"
		>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
	name: 'detailsInfo',
	props: {
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			testa: false,
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'item.code',
					label: '品项编号',
					width: '170px',
					required: true,
					sortable: true,
					sortKey: 'item.code'
				},
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true, width: '170px' },
				{ prop: 'item.spec', label: '规格', width: '170px' },
				{ prop: 'itemUnit.name', label: '单位', width: '170px' },
				{
					prop: 'price',
					label: '非税单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxPrice',
					label: '含税单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					required: true,
					width: '100px',
					formatter: (row) => {
						return row.taxRate * 100 + '%'
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '170px' }
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		defaultSortParam () {
			return this.getSysParams('SJXZL_STOCKOFFER_ITEM_ORDER', 'value')
		}
	},
	methods: {
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.cell-input {
	>>>.form-item-input {
		width 100%
	}
}
</style>
