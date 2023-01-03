<template>
	<w-dialog v-model="dialogVisible" title="选择退货品项" fullscreen >
		<filterBar ref="filterBar" @on-search="getListData"></filterBar>
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:focus.saveBtn
			:tableColumn="tableColumn"
			:tableEditColumnProp="tableEditColumnProp"
			:tableData="tableData"
			:tableValiDate="tableValiDate"
			:canAdd="false"
			:showDeleteBtn="false"
			:showColumnFilterBtn="false"
			:fullScreenBtn="false"
			:tableSearchInput='false'
			:fpOnRowEdit="fpOnRowEdit"
			showPagination
			indexContinuous
			@on-page-change="onPageChange"
		>
			<template slot="btn-tools-left">
				<el-button
					ref="saveReturnBtn"
					v-fx-tab:focus.detailsTable
					class="order-btn"
					@click="onCancelClick"
				>取消</el-button>
				<fx-button
					ref="saveBtn"
					type="save"
					v-fx-tab:focus.saveReturnBtn
					class="order-btn"
					@click="onSaveClick"
				>确认退货</fx-button>
			</template>
		</fx-details-table>
	</w-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
const EDIT_INPUT_TYPE = ['amount', 'assistUnitAmount', 'itemUnit.name']
export default {
	name: 'returnGoodsMulity',
	components: {
		filterBar
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'businessDate', label: '入库时间', width: '160px' },
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', width: '120px' },
				{ prop: 'item.spec', label: '规格', width: '120px' },
				{
					prop: 'itemUnit.name',
					label: '单位',
					editColumn: (row) => {
						return this.canEditAmount(row)
					},
					fxRender: this.unitRender,
					click: this.onCellClick('itemUnit.name')
				},
				{
					prop: 'amount',
					label: '本次退货数量',
					width: '120px',
					className: 'bold-text',
					labelClassName: 'amount-label',
					editColumn: (row) => {
						return this.canEditAmount(row)
					},
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
				}, {
					prop: 'storeAmount',
					label: '当前剩余数量',
					width: '120px',
					className: 'bold-text',
					labelClassName: 'amount-label',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.storeAmount, this.sysPointSize)
					}
				},
				{
					prop: 'inStoreAmount',
					label: '入库数量',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inStoreAmount, this.sysPointSize)
					}
				},
				{
					prop: 'price',
					label: '入库成本单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '入库成本金额',
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
					prop: 'inTaxPrice',
					label: '含税单价',
					width: '120px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'inTaxMoney',
					label: '含税金额',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '辅助退货数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit && this.canEditAmount(row)
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					formatter: (row) => {
						return row.taxRate * 100 + '%'
					}
				},
				{
					prop: 'inPrice',
					label: '非税单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'inMoney',
					label: '非税金额',
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inStoreAssistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inStoreAssistUnitAmount, this.sysPointSize)
					}
				},
				{ prop: 'otherOrganName', label: '出库方', width: '120px', required: true },
				{ prop: 'productDate', label: '生产时间', width: '150px', required: true },
				{
					prop: 'item.shelfLife',
					label: '保质期天数',
					width: '100px',
					required: true,
					formatter: (row) => {
						return this.systemParamAccountingWay ? (row.item.shelfLifeFlag ? row.item.shelfLife : '') : ''
					}
				},
				{ prop: 'batchCode', label: '批次号', width: '180px', required: true },
				{
					prop: 'giftFlag',
					label: '赠品',
					width: '80px',
					required: true,
					formatter: (row) => {
						return row.giftFlag ? '是' : '否'
					}
				},
				{ prop: 'memo', label: '明细备注', width: '120px', required: true },
				{ prop: 'sysBillCode', label: '系统单号', width: '120px', required: true },
				{ prop: 'userBillCode', label: '手工单号', width: '120px', required: true }
			],
			tableValiDate: [
				{
					columnProp: 'amount',
					rule: (row, success, error) => {
						if (row.storeAmount >= 0 && row.amount > row.storeAmount) {
							error(`本次退货数量不可大于${row.storeAmount}`)
						} else if (row.storeAmount < 0 && row.amount !== 0) {
							error('本次退货数量只能为0')
						} else {
							success()
						}
					}
				}],
			tableData: [],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			fxCalculation: this.$fxCalculation('inStore'),
			unitSelectLoading: false,
			fxCalculationReturnGoods: this.$fxCalculation('inStoreReturnGoods')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams']),
		systemParamAmountNegative () {
			return this.getSysParams('KCGL_FKC', 'value')
		},
		systemParamAccountingWay () {
			return this.getSysParams('JCHS_HSFS', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		canEditAmount () {
			return (row) => {
				return !!row.storeAmount || this.systemParamAmountNegative
			}
		}
	},
	methods: {
		open () {
			this.tableData = []
			this.$refs.detailsTable && this.$refs.detailsTable.clear()
			this.$refs.detailsTable && this.$refs.detailsTable.setPaginationCurrent(1)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.filterBar.initSelectData().then(this.$refs.filterBar.getSelectData).then(this.getListData)
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		getListData () {
			const _params = {
				sortParams: { businessDate: 'desc' },
				...this.$refs.filterBar.getFilterParams()
			}
			const params = {
				...this.$refs.detailsTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('inStoreList')(_params)
			}
			return this.$fxApi('inStore.getReturnGoods')({ data: params }).then(res => {
				this.$refs.detailsTable.setPaginationTotal(res.total || 0)
				this.tableData = res.result || []
				this.tableData.forEach(item => {
					item.inStoreAmount = item.amount
					item.inStoreAssistUnitAmount = item.assistUnitAmount
					if (item.storeAmount < 0) {
						item.amount = 0
					} else {
						item.amount = item.storeAmount
					}
					this.fxCalculation.calculateAssistAmount(item)
				})
			})
		},
		onPageChange () {
			return this.getListData()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.checkDetailsUnSaving().then(() => {
				this.$refs.detailsTable.getSelectRows().then(this.onSaveHandler)
			})
		},
		onSaveHandler (items) {
			const billIdMap = {}
			items.forEach(item => {
				const params = {
					detailId: item.id,
					itemUnit: item.itemUnit,
					returnAmount: item.amount,
					returnAssistUnitAmount: item.assistUnitAmount || 0
				}
				if (!item.amount) return
				if (billIdMap[item.billId]) {
					billIdMap[item.billId].push(params)
				} else {
					billIdMap[item.billId] = [params]
				}
			})
			const params = Object.keys(billIdMap).map(item => {
				return {
					billId: item,
					details: billIdMap[item]
				}
			})
			const orderData = this.createLogInfo(items)
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.returnGoodsMulity', { orderData })
			return this.$fxApi('inStore.returnGoodsMulity')({ data: params, logger }).then(() => {
				this.dialogVisible = false
				this.$emit('on-refresh')
			})
		},
		createLogInfo (items) {
			const billIdMap = {}
			items.forEach(item => {
				const params = {
					sysBillCode: item.sysBillCode,
					id: item.billId,
					details: [`仓库名称:${item.inHouse.name},退货品项:${item.item.name},本次退货数量:${item.amount},辅助退货数量:${item.assistUnitAmount}`]
				}
				if (billIdMap[item.billId]) {
					billIdMap[item.billId].details.push(params.details[0])
				} else {
					billIdMap[item.billId] = params
				}
			})
			return Object.keys(billIdMap).map(key => {
				billIdMap[key].info = billIdMap[key].details.join('；\n')
				return billIdMap[key]
			})
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			this.fxCalculationReturnGoods.changeUnit(row, item)
			this.getSingleStockAmount(row).then(res => {
				this.fxCalculationReturnGoods.calculateAssistAmount(row, this.itemUnitList)
			})
		},
		getSingleStockAmount (row) {
			const billId = row.billId
			const organId = row.organId
			const params = {
				detailId: row.id,
				unitId: row.itemUnit.id
			}
			return this.$fxApi('inStore.singleStockAmount', billId, organId)({ data: params }).then(res => {
				row.storeAmount = res[row.id] || 0
				if (row.storeAmount < 0) {
					row.amount = 0
				} else {
					row.amount = row.storeAmount
				}
			})
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.getUnitList(row.item.id, row.itemUnit.id, row).then(res => {
							this.unitSelectLoading = false
							this.itemUnitList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		getUnitList (itemId, itemUnitId = '', row) {
			const data = itemUnitId ? { itemUnitId } : {}
			return this.$fxApi('inStore.getUnitList', itemId, row.billId)({ data })
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`amount-${$index}`}
				vModel={row.amount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='amount'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
				disabled={!row.storeAmount && !this.systemParamAmountNegative}
				on-on-change={this.onAmountChange}
				on-on-input-enter={this.onAmountEnter}
				on-on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row)
			}
		},
		onAmountEnter (row) {
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditEnter()
		},
		onAmountTab (row, $index) {
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditTab({ row, index: $index })
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit}
				row={row}
				rowIndex={$index}
				columnProp='assistUnitAmount'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)}
			>
			</fx-list-cell-input-number>
		},
		onCellClick (type) {
			return (row) => {
				if (this.canEditAmount(row)) {
					this.$refs.detailsTable.setRowEdit(row, type)
				}
			}
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (this.canEditAmount(row)) {
					this.$refs.detailsTable.setListCellFocus('amount')
					resolve()
				} else {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
.amount-label {
	font-weight bold
}
.bold-text {
	font-weight bold
}
</style>
