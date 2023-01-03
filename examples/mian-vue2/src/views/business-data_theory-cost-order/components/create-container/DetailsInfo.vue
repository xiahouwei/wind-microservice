<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="出库明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.business-data_theory-cost-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableData="tableDetails"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:expandRows="computedExpandRows"
			:fpSaveMain="fSaveMain"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:fpExpandAsync="fpExpandAsync"
			:fpExpandAllAsync="fpExpandAllAsync"
			:canAdd="false"
			showSummary
			:showDeleteBtn='false'
			:defaultSortParam="defaultSortParam"
			@on-full-screen-click="onFullScreenClick"
		>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				:organDetails="organDetails"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import { apiName } from '../../Index.vue'
const REQUIRE_CHANGE_COLUMN = ['outHouse.code', 'item.code', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'item.assistUnit', 'assistUnitAmount', 'detail1']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity
	},
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
		},
		fSaveMain: Function,
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{ prop: 'outHouse.code', label: '仓库编号', width: '150px', required: true, sortable: true, sortKey: 'outHouse.code' },
				{ prop: 'outHouse.name', label: '仓库名称', required: true, sortable: true },
				{ prop: 'item.code', label: '品项编号', width: '150px', required: true, sortable: true, sortKey: 'item.code' },
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{ prop: 'itemUnit.name', label: '单位', width: '120px', required: true },
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'price',
					label: '成本单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '成本金额',
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					width: '120px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesTaxMoney',
					label: '含税销售金额',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					required: true,
					formatter: (row) => {
						return row.salesTaxRate * 100 + '%'
					}
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRateMoney',
					label: '税额',
					visible: false,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				}
			],
			expandRows: [
				{ prop: 'detail1', label: '品项其他信息', render: this.renderExpand1, visible: true, required: true },
				{ prop: 'detail2', label: '毛利信息', render: this.renderExpand2, visible: true }
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			haveCostPower: state => state.loginer.haveCostPower,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams']),
		computedColumn () {
			let column = this.tableColumn
			const costPower = ['price', 'money']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			const moneyPower = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'salesTaxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		computedExpandRows () {
			const expandRows = this.expandRows
			if (!this.haveMoneyPower) {
				expandRows.splice(1, 1)
			}
			return expandRows
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_OUTSTORE_ITEM_ORDER', 'value')
		},
		tableExpandEditColumnProp () {
			return EDIT_INPUT_EXPAND_TYPE
		}
	},
	watch: {
		disabled: {
			immediate: true,
			handler (val) {
				this.tableColumn.forEach(item => {
					if (REQUIRE_CHANGE_COLUMN.includes(item.prop)) {
						item.required = !val
						if (!val) item.visible = true
					}
				})
				this.expandRows.forEach(item => {
					if (REQUIRE_CHANGE_COLUMN.includes(item.prop)) {
						item.required = !val
						if (!val) item.visible = true
					}
				})
			}
		}
	},
	methods: {
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.editDetail`, this.organDetails.id, params.id)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				orderData: this.organDetails,
				itemName: organDetails.item.name
			}
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const itemNames = []
				const ids = res.map(item => {
					itemNames.push(item.item.name)
					return item.id
				})
				let params = null
				params = {
					ids,
					batchSetType: 'memo',
					memo: setting.memo
				}
				const settingInfo = `备注:${setting.memo}`
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(`${apiName}.setMulity`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		onAllFoldclick () {
			return this.$refs.detailsTable.onAllFoldclick()
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		renderExpand1 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="批次号：">{row.batchCode || ''}</fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width={200} editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
						<fx-list-cell-input
							ref={`memo-${$index}`}
							vModel={ row.memo }
							isEdit={ row.isEdit }
							row={ row }
							rowIndex={ $index }
							columnProp='memo'
							maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
							regType={this.$fxCommon.getFxInputReg('memo')}
						></fx-list-cell-input>
					</fx-list-extend-cell>
					<fx-list-extend-cell title="存放位置："></fx-list-extend-cell>
					<fx-list-extend-cell title="当前库存：">{row.stock}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="毛利金额："></fx-list-extend-cell>
					<fx-list-extend-cell title="毛利率："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		fpExpandAsync (row) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const params = [row.id]
				if (row.stock || row.stock === 0) return Promise.resolve()
				return this.$fxApi(`${apiName}.stockAmount`, billId, organId)({ data: params }).then(res => {
					row.stock = res[row.id] || 0
					return Promise.resolve()
				})
			})
		},
		fpExpandAllAsync (tableData) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const params = tableData.map(item => item.id)
				return this.$fxApi(`${apiName}.stockAmount`, billId, organId)({ data: params }).then(res => {
					tableData.forEach(item => {
						item.stock = res[item.id] || 0
					})
					return Promise.resolve()
				})
			})
		},
		extendCellClick (type, row) {
			return () => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
