<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="出库明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_out-store-order_details.detailsInfo
			:disabled="disabled || isStock"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:tableEditEnterColumnProp="tableEditEnterColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:expandRows="computedExpandRows"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:fpExpandAsync="fpExpandAsync"
			:fpExpandAllAsync="fpExpandAllAsync"
			:mistakeDisabled="mistakeDisabled"
			:canAdd="canAdd && authCanadd"
			showSummary
			showMistakeCheck
			:showDeleteBtn='showDeleteBtn'
			:deleteDisabled="deleteDisabled"
			:defaultSortParam="defaultSortParam"
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
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
		<addMulity
			ref="addMulity"
			:organDetails="organDetails"
			:outStoreWareList="outStoreWareList"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
		<batchCodeDialog
			ref="batchCodeDialog"
			:organDetails="organDetails"
		></batchCodeDialog>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
import batchCodeDialog from './BatchCodeDialog.vue'
const EDIT_INPUT_TYPE = ['storeCode', 'code', 'unit', 'amount', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'assistUnitAmount', 'outReason', 'batchCode']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const EDIT_INPUT_ENTER_TYPE = ['salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney']
const REQUIRE_CHANGE_COLUMN = ['storeCode', 'code', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'item.assistUnit', 'assistUnitAmount', 'outReason']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulity,
		batchCodeDialog
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
		outStoreWareList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		disabled: Boolean,
		deleteDisabled: Boolean,
		itemName: String
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'storeCode',
					label: '仓库编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !(this.isAssign || this.isAmount || this.isLimited || this.disabled || this.isSaleReturnAmount)
					},
					sortable: true,
					sortKey: 'outHouse.code',
					fxRender: this.storeCodeRender,
					click: this.onCellClick('storeCode')
				},
				{ prop: 'outHouse.name', label: '仓库名称', required: true, sortable: true },
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !(this.isAssign || this.isAmount || this.isLimited || this.disabled || this.isSaleReturnAmount)
					},
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return (this.isHand || row.preDetailIsAssistUnit) && !this.disabled && !this.isOffset && !this.isSaleReturnAmount
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return (this.commonAmountEditState || !this.disabled) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'price',
					label: '成本单价',
					width: '120px',
					sortable: true,
					fxRender: this.costPriceRender
				},
				{
					prop: 'money',
					label: '成本金额',
					width: '120px',
					sortable: true,
					fxRender: this.costMoneyRender,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag && this.strategyMoneyEdit(row) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('salesTaxPrice')
				},
				{
					prop: 'salesTaxMoney',
					label: '含税销售金额',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag && this.strategyMoneyEdit(row) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('salesTaxMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && this.organDetails.organ.taxPlayerFlag === 1 && !row.giftFlag && !this.isSaleReturnAmount
					},
					fxRender: this.taxRender,
					click: this.onCellClick('salesTaxRate')
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '120px',
					visible: false,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag && this.strategyMoneyEdit(row) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.priceRender,
					click: this.onCellClick('salesPrice')
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					width: '120px',
					visible: false,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag && this.strategyMoneyEdit(row) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('salesMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRateMoney',
					label: '税额',
					visible: false,
					sortable: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit && (this.commonAmountEditState || !this.disabled) && !this.isSaleReturnAmount
					},
					sortable: true,
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'distributeFlag',
					label: '配货标记',
					align: 'center',
					editColumn: (row) => {
						return !this.disabled
					},
					fxRender: this.distributeFlagRender,
					click: this.onCellClick('distributeFlag')
				},
				{
					prop: 'productDate',
					label: '生产日期',
					width: '150px'
				},
				{
					prop: 'outReason',
					label: '出库原因',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return !this.isSaleReturnAmount && !this.disabled
					},
					fxRender: this.outReasonRender,
					click: this.onCellClick('outReason')
				},
				{
					prop: 'outPutShelfInfo',
					label: '出库货位',
					width: '200px'
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px',
					editColumn: false,
					fxRender: this.expectArrivalDateRender
				},
				{
					prop: 'batchCode',
					label: '批次号',
					width: '260px',
					editColumn: (row) => {
						return !this.isMoney && this.systemBatchCode && !this.disabled
					},
					fxRender: this.batchCodeRender,
					click: this.onCellClick('batchCode')
				}
			],
			tableValiDate: [{
				columnProp: 'storeCode',
				rule: (row, success, error) => {
					if (!row.outHouse.id && !this.isSingleHouse) {
						error('仓库编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'code',
				rule (row, success, error) {
					if (!row.item.id) {
						error('品项编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'unit',
				rule (row, success, error) {
					if (!row.itemUnit.id) {
						error('单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'assistUnitAmount',
				rule: (row, success, error) => {
					if (row.amount && this.commonAmountEditState && row.item.assistUnit && !Number(row.assistUnitAmount)) {
						error('辅助数量不能为0')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('outStore'),
			expandRows: [
				{ prop: 'detail1', label: '品项其他信息', render: this.renderExpand1, visible: true, required: true },
				{ prop: 'detail2', label: '库存信息', render: this.renderExpand2, visible: true, required: true },
				{ prop: 'detail3', label: '毛利信息', render: this.renderExpand3, visible: true, required: true },
				{ prop: 'detail4', label: '称重信息', render: this.renderExpand4, visible: true, required: true }
			],
			itemList: [],
			itemUnitList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules'),
			fxCache: this.$fxUtils.fxCache('out-store'),
			codeSelectLoading: false,
			unitSelectLoading: false,
			houseSelectLoading: false,
			selectedRows: [],
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			tableExpandEditColumnProp: EDIT_INPUT_EXPAND_TYPE,
			outReasonList: [],
			outReasonSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let column = this.isSingleHouse ? this.tableColumn.slice(2) : this.tableColumn
			const moneyPower = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'salesTaxRateMoney']
			const costPower = ['price', 'money']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			if (!this.showHouseItemLocation) {
				column = column.filter(item => {
					return item.prop !== 'outPutShelfInfo'
				})
			}
			if (!this.isSale && !this.isDiff) {
				column = column.filter(item => {
					return item.prop !== 'expectArrivalDate'
				})
			}
			return column
		},
		computedExpandRows () {
			const expandRows = this.expandRows
			if (!this.haveMoneyPower) {
				expandRows.splice(2, 1)
			}
			return expandRows
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		billColor () {
			switch (this.organDetails.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isCarryForward () {
			return this.organDetails.balanceFlag === 1
		},
		mistakeDisabled () {
			if (this.isChecked && !this.isCarryForward) {
				return false
			} else {
				return this.disabled || this.isOffset
			}
		},
		isHand () {
			return !this.organDetails.parentBill
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isCrossAssign () {
			return this.organDetails.sourceBillType === 'InStore'
		},
		isAmount () {
			return this.isCommonTypeByRules('amount-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isMoney () {
			return this.isCommonTypeByRules('money-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isDiff () {
			return this.isCommonTypeByRules('diff')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSale () {
			return this.isCommonTypeByRules('sale')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStock () {
			return this.isCommonTypeByRules(['stockLoss', 'stockProfit'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules('offset')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOther () {
			return this.isCommonTypeByRules('other')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isLimited () {
			return this.isStock || this.isMove || this.isMoney || this.isOffset || this.isAmount || this.isCrossAssign
		},
		commonAmountEditState () {
			return !(this.isAmount || this.isLimited || this.disabled)
		},
		commonPriceEditState () {
			return !(
				(this.isAssign && !this.systemParamMoneyEdit) ||
				(this.isAmount && !this.systemParamMoneyEdit) ||
				(this.isLimited && !this.isAmount) ||
				this.disabled
			)
		},
		canAdd () {
			return !(this.isLimited || this.isAmount || this.isMoney || this.isAssign || this.isSaleReturnAmount)
		},
		authCanadd () {
			return this.detailsAuthGetter('store-manage_out-store-order.add-outstore')
		},
		isSalesAssign () {
			return this.organDetails.parentBill && this.organDetails.parentBill.billClass === 'SalesOrder' && !this.organDetails.sourceBillType
		},
		showDeleteBtn () {
			return (this.isHand || this.isSalesAssign) && this.detailsAuthGetter('store-manage_out-store-order.delete-outstore') && !this.isOffset && !this.isDiff
		},
		tableEditColumnProp () {
			if (this.isAssign && !this.isCrossAssign && this.systemParamMoneyEdit) {
				return ['amount', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'assistUnitAmount', 'outReason']
			} else if (this.isAssign && !this.isCrossAssign && !this.systemParamMoneyEdit) {
				return ['amount', 'assistUnitAmount', 'outReason']
			} else if (this.isAmount && this.systemParamMoneyEdit) {
				return ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'outReason']
			} else if (this.isMove) {
				return ['amount', 'assistUnitAmount', 'outReason']
			} else if (this.isLimited) {
				return ['outReason']
			} else if (this.isSaleReturnAmount) {
				return []
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_OUTSTORE_MONEY_AUTH', 'value')
		},
		systemParamAccountingWay () {
			return this.getSysParams('JCHS_HSFS', 'value')
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_OUTSTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		systemBatchCode () {
			return this.getSysParams('SJXZL_OUTSTORE_CHOOSE_BATCHCODE', 'value')
		},
		billSign () {
			if (this.organDetails.billSign === 1) {
				return '+'
			} else {
				return ''
			}
		},
		strategyMoneyEdit () {
			return (row) => {
				return [0, 1].includes(row.strategy)
			}
		},
		organCanChangeTax () {
			return this.organDetails.organ.taxPlayerFlag === 1
		},
		showHouseItemLocation () {
			return this.organDetails.organ.enableLocation === 1
		},
		isSaleReturnAmount () {
			return this.isCommonTypeByRules('saleReturnStoreAmount')(this.organDetails.billType, this.organDetails.subBillType)
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
			}
		},
		itemName: {
			immediate: true,
			handler (val) {
				if (val) {
					this.$nextTick(() => {
						this.$refs.detailsTable.setSearchKey(val)
					})
				}
			}
		}
	},
	methods: {
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		storeCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`storeCode-${$index}`}
				value={row.outHouse.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('storeCode')}
				row={row}
				rowIndex={$index}
				columnProp='storeCode'
				dropdownWidth='300px'
				loading={this.houseSelectLoading}
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				cellText={row.outHouse.code}
				fpSelectShow={this.onHouseSelectShow(row)}
				selectOptionList={this.outStoreWareList}
				on-on-change={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		onStoreCodeSelectChange (item, row) {
			row.outHouse = item
		},
		onHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.houseSelectLoading = true
					this.getValidStoreList(row.outHouse.id).then(res => {
						this.houseSelectLoading = false
						this.$emit('update:outStoreWareList', res)
						resolve()
					})
				})
			}
		},
		getValidStoreList (storeId) {
			const key = `outStoreWareList.${this.organDetails.id}.${storeId}.${this.organDetails.organ.id}`
			const ids = [storeId]
			return this.fxCache.cacher(key, this.$fxApi('outStore.getValidStoreList', this.organDetails.organ.id)({ data: ids }))
		},
		getItemList (storeId, itemId) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}`
			return this.fxCache.cacher(key, this.$fxApi('outStore.getItemList', this.organDetails.id, storeId, itemId))
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}.${this.organDetails.organ.id}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi('outStore.getUnitList', itemId, this.organDetails.id)({ data }))
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`code-${$index}`}
				value={row.item.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('code')}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				filterKeys={this.filterKeys}
				cellText={row.item.code}
				loading={this.codeSelectLoading}
				selectOptionList={this.itemList}
				asyncChange={this.onCodeSelectChange}
				fpSelectShow={this.onCodeSelectShow(row)}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				row.assistUnit = item.assistUnit
				return this.getUnitList(item.id).then(res => {
					this.itemUnitList = res
					row.itemUnit = res[0]
					return Promise.resolve()
				}).then(() => {
					const params = {
						sellerOrganId: this.organDetails.organ.id,
						buyerOrganId: this.organDetails.otherOrgan.id,
						bizDate: this.organDetails.businessDate,
						itemId: item.id,
						unitId: row.itemUnit.id
					}
					this.$fxApi('outStore.priceList', this.organDetails.id)({ data: params }).then(res => {
						row.salesPrice = res.price || 0
						row.salesTaxRate = res.taxRate
						row.salesTaxPrice = res.taxPrice || 0
						row.strategy = res.strategy
						row.mainUnitId = res.unitId
						const unit = this.itemUnitList.find(item => item.id === res.unitId)
						row.itemUnit = unit || row.itemUnit
						this.fxCalculation.changeAmount(row)
						this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
						if (this.itemUnitList.length === 1) {
							this.$refs.detailsTable.setListCellFocus('amount')
						} else {
							this.$refs.detailsTable.setListCellFocus('unit')
						}
						resolve()
					})
				})
			})
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					const storeId = this.isSingleHouse ? this.organDetails.outHouse.id : row.outHouse.id
					if (storeId) {
						this.getItemList(storeId, row.item.id).then(res => {
							this.codeSelectLoading = false
							this.itemList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择仓库')
					}
				})
			}
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (unchangedFlag) {
					this.getUnitList(item.id).then(res => {
						if (res.length === 1) {
							this.$refs.detailsTable.setListCellFocus('amount')
						} else {
							resolve()
						}
					})
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (unchangedFlag) {
				this.getUnitList(item.id).then(res => {
					if (res.length === 1) {
						this.$refs.detailsTable.setListCellFocus('amount')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
				})
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit && (this.tableEditColumnProp.includes('unit') || row.preDetailIsAssistUnit)}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
				on-on-select-enter={this.onUnitSelectEnter}
				on-on-select-tab={this.onUnitSelectEnter}
				asyncClick={this.onUnitSelectClick}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (row.preDetailIsAssistUnit) {
				this.fxCalculation.changeUnitNotCalculateAssistAmount(row, item)
			} else {
				this.fxCalculation.changeUnit(row, item)
			}
		},
		onUnitSelectEnter (row, $index) {
			this.$refs.detailsTable.setListCellFocus('amount')
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.getUnitList(row.item.id, row.itemUnit.id).then(res => {
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
		onUnitSelectClick (row, $index) {
			return new Promise(resolve => {
				this.$refs.detailsTable.setListCellFocus('amount')
			})
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			if (this.billColor) {
				return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.billSign}{this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}</span>
			} else {
				return <fx-list-cell-input-number
					ref={`amount-${$index}`}
					vModel={row.amount}
					isEdit={row.isEdit && (this.tableEditColumnProp.includes('amount') || this.isMove)}
					row={row}
					rowIndex={$index}
					columnProp='amount'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					on-on-change={this.onAmountChange}
					vOn:on-input-enter={this.onAmountEnter}
					vOn:on-input-tab={this.onAmountTab}
				>
				</fx-list-cell-input-number>
			}
		},
		onAmountEnter (row, index) {
			if (row.giftFlag || !this.haveMoneyPower || this.isMove) {
				this.$refs.detailsTable.doRowEditEnter()
			} else if (this.strategyMoneyEdit(row)) {
				this.$refs.detailsTable.setListCellFocus('salesTaxPrice')
			} else if (this.organCanChangeTax) {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			} else {
				this.$refs.detailsTable.doRowEditEnter()
			}
		},
		onAmountTab (row, $index) {
			if (row.giftFlag || !this.haveMoneyPower || this.isMove) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else {
					this.$refs.detailsTable.setListCellFocus('outReason')
				}
			} else if (this.strategyMoneyEdit(row)) {
				this.$refs.detailsTable.setListCellFocus('salesTaxPrice')
			} else if (this.organCanChangeTax) {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			} else {
				this.$refs.detailsTable.setListCellFocus('outReason')
			}
		},
		costPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)}</span>
		},
		costMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.billSign}{this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)}</span>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (!row.preDetailIsAssistUnit && (`${oldVal}` === '0' || this.mainAssistAmountTogether)) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesTaxPrice-${$index}`}
				vModel={row.salesTaxPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxPrice')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onTaxPriceChange}
				disabled={row.giftFlag || !this.strategyMoneyEdit(row)}
				class={this.billColor}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.changePriceWithTax(row)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesTaxMoney-${$index}`}
				vModel={row.salesTaxMoney}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxMoney')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxMoney'
				pointSize={this.sysMoneyPointSize}
				on-on-change={this.onTaxMoneyChange}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)}
				vOn:on-input-tab={this.onTaxMoneyTab}
				disabled={row.giftFlag || !this.strategyMoneyEdit(row)}
				class={this.billColor}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyTab (row, $index) {
			if (!this.organCanChangeTax) {
				this.onSalesTaxRateTab(row, $index)
			} else {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			}
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`salesTaxRate-${$index}`}
				vModel={row.salesTaxRate}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxRate')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxRate'
				disabled={!this.organCanChangeTax || row.giftFlag}
				selectOptionList={this.taxesList}
				on-on-change={this.onTaxSelectChange}
				class={this.billColor}
				on-on-select-tab={this.onSalesTaxRateTab}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
		},
		onSalesTaxRateTab (row, $index) {
			if (this.strategyMoneyEdit(row) && this.isNextColVisible(['salesPrice', 'salesMoney'])) {
				if (this.isNextColVisible(['salesPrice'])) {
					this.$refs.detailsTable.setListCellFocus('salesPrice')
				} else if (this.isNextColVisible(['salesMoney'])) {
					this.$refs.detailsTable.setListCellFocus('salesMoney')
				}
			} else if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else {
				this.$refs.detailsTable.setListCellFocus('outReason')
			}
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesPrice-${$index}`}
				vModel={row.salesPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesPrice')}
				row={row}
				rowIndex={$index}
				columnProp='salesPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onPriceChange}
				disabled={row.giftFlag || !this.strategyMoneyEdit(row)}
				class={this.billColor}
				vOn:on-input-tab={this.onPriceTab}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changePrice(row)
		},
		onPriceTab (row, $index) {
			if (this.isNextColVisible(['salesMoney'])) {
				this.$refs.detailsTable.setListCellFocus('salesMoney')
			} else if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else {
				this.$refs.detailsTable.setListCellFocus('outReason')
			}
		},
		moneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesMoney-${$index}`}
				vModel={row.salesMoney}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesMoney')}
				row={row}
				rowIndex={$index}
				columnProp='salesMoney'
				pointSize={this.sysMoneyPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)}
				disabled={row.giftFlag || !this.strategyMoneyEdit(row)}
				class={this.billColor}
				on-on-change={this.onMoneyChange}
				vOn:on-input-tab={this.onMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		onMoneyTab (row, $index) {
			if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else {
				this.$refs.detailsTable.setListCellFocus('outReason')
			}
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			if (this.billColor) {
				return <span class={[this.billColor, 'fx-list-table__cell-span']}>{(() => {
					if (row.assistUnitAmount) {
						return this.billSign
					} else {
						return ''
					}
				})()}{row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}</span>
			} else {
				return <fx-list-cell-input-number
					ref={`assistUnitAmount-${$index}`}
					vModel={row.assistUnitAmount}
					isEdit={row.isEdit && !!row.item.assistUnit && (this.tableEditColumnProp.includes('assistUnitAmount') || this.isMove)}
					row={row}
					rowIndex={$index}
					columnProp='assistUnitAmount'
					pointSize='4'
					cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
					pointSize={this.sysPointSize}
				>
				</fx-list-cell-input-number>
			}
		},
		distributeFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <el-checkbox
				vModel={ row.distributeFlag }
				disabled={ !row.isEdit }
				class="table-cell-checkbox"
			>
			</el-checkbox>
		},
		outReasonRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`outReason-${$index}`}
				value={row.outReason && row.outReason.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('outReason')}
				row={row}
				rowIndex={$index}
				columnProp='outReason'
				clearable
				cellText={row.outReason && row.outReason.name}
				loading={this.outReasonSelectLoading}
				selectOptionList={this.outReasonList}
				on-on-change={this.onOutReasonChange}
				fpSelectShow={this.onOutReasonSelectShow(row)}
				on-on-select-tab={this.onOutReasonTab}
			></fx-list-cell-select>
		},
		onOutReasonChange (item, row) {
			row.outReason = item
		},
		onOutReasonSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.outReasonSelectLoading = true
					this.getOutReasonList(row.outReason && row.outReason.id).then(res => {
						this.outReasonSelectLoading = false
						this.outReasonList = res
						resolve()
					})
				})
			}
		},
		onOutReasonTab (row, $index) {
			this.$refs.detailsTable.doRowEditTab({ row, index: $index })
		},
		getOutReasonList (outReasonId = '') {
			const key = `outReasonList.${outReasonId}`
			return this.fxCache.cacher(key, this.$fxApi('outStore.getOutReasonList', outReasonId))
		},
		expectArrivalDateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-date
				ref={`expectArrivalDate-${$index}`}
				vModel={row.expectArrivalDate}
				row={row}
				rowIndex={$index}
				columnProp='expectArrivalDate'
			>
			</fx-list-cell-date>
		},
		batchCodeRender (h, { row, $index }) {
			h = this.$createElement
			if (!this.isMoney && this.systemBatchCode && row.isEdit) {
				return <div class="batch-code">
					<span class={['fx-list-table__cell-span']}>{row.batchCode || ''}</span>
					<div class="del-btn">
						<i
							vShow={row.batchCode}
							class="el-icon-circle-close"
							on-click={() => this.clearBatchCode(row)}
						></i>
					</div>
					<el-button
						type="primary"
						on-click={() => this.selectBatchCode(row)}
					>选择</el-button>
				</div>
			} else {
				return <span class={['fx-list-table__cell-span']}>{row.batchCode || ''}</span>
			}
		},
		selectBatchCode (row) {
			this.$refs.batchCodeDialog.open(row)
		},
		clearBatchCode (row) {
			row.batchCode = ''
			row.chooseBatch = 0
		},
		beforeRowEdit (row) {
			if (!row.outReason) {
				row.outReason = {
					id: '',
					name: ''
				}
			}
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (this.isSingleHouse && type === EDIT_INPUT_TYPE[0]) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (!this.isSingleHouse && type === 'storeCode' && !row.id && $index > 0) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (!this.isSingleHouse && type === 'storeCode' && !row.id && row.outHouse.code) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (!this.isSingleHouse && type === 'storeCode') {
					this.$refs.detailsTable.setListCellFocus('storeCode')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpInitAddDetailsData ($index) {
			return new Promise(resolve => {
				let house = {}
				const arrivalDate = new Date(this.organDetails.businessDate).getTime()
				if (this.isSingleHouse) {
					house.id = this.organDetails.outHouse.id
				} else if (!this.isSingleHouse && $index > 0) {
					house = this.tableDetails[$index - 1].outHouse || {}
				} else if (!this.isSingleHouse && $index === 0) {
					if (this.outStoreWareList.length === 1) {
						house = this.outStoreWareList[0]
					}
				}
				const data = {
					productDate: this.organDetails.businessDate,
					outHouse: house,
					item: {},
					itemUnit: {},
					mainUnitId: '',
					amount: 0,
					salesTaxPrice: 0,
					salesTaxMoney: 0,
					salesTaxRate: 0,
					salesPrice: 0,
					salesMoney: 0,
					salesTaxRateMoney: 0,
					assistUnitAmount: 0,
					assignAmount: 0,
					abortAssign: 0,
					memo: '',
					chooseBatch: 0,
					outReason: { id: '', name: '' },
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate), '时分')
				}
				if (this.organDetails.singleHouseFlag === 1) {
					data.outHouse.id = this.organDetails.outHouse.id
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			if (origin && this.isOther && (detail.outHouse.id !== origin.outHouse.id || detail.item.id !== origin.item.id)) {
				detail.batchCode = ''
			}
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('outStore.editDetail', this.organDetails.id, params.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi('outStore.addDetail', this.organDetails.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		getAddItemInfo (params) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.organDetails.outHouse.name
			} else {
				storeName = params.outHouse.name
			}
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			const taxPrice = params.salesTaxPrice
			return `出库仓库:${storeName},品项名称:${name},单位:${itemUnit},出库数量:${amount},含税销售单价:${taxPrice}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi('outStore.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('outStore.delDetail', this.organDetails.id, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.organDetails.outHouse.name
			}
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				if (!this.isSingleHouse) {
					storeName = item.outHouse.name
				}
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.salesTaxPrice
				return `出库仓库:${storeName},品项名称:${name},单位:${itemUnit},出库数量:${amount},含税销售单价:${taxPrice}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			this.$refs.addMulity.open()
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const itemNames = []
				let settingInfo = ''
				const ids = res.map(item => {
					itemNames.push(item.item.name)
					return item.id
				})
				let params = null
				if (setting.type === 0) {
					params = {
						ids,
						batchSetType: 'taxRate',
						salesTaxRate: setting.tax
					}
					settingInfo = `销项税率:${setting.tax}`
				} else if (setting.type === 2) {
					params = {
						ids,
						batchSetType: 'memo',
						memo: setting.memo
					}
					settingInfo = `备注:${setting.memo}`
				} else if (setting.type === 3) {
					params = {
						ids,
						batchSetType: 'outReason',
						outReasonId: setting.outReason.id
					}
					settingInfo = `出库原因:${setting.outReason.name}`
				}
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi('outStore.setMulity', this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
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
			const shelfLife = this.systemParamAccountingWay ? (row.item.shelfLifeFlag ? row.item.shelfLife : '') : ''
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="保质期天数：">{shelfLife}</fx-list-extend-cell>
					<fx-list-extend-cell title="赠品：" editColumn={ this.isHand && !this.isOffset && !this.isSaleReturnAmount } disabled={ this.disabled || this.isSaleReturnAmount } vOn:click={this.extendCellClick('', row)}>
						<el-checkbox
							vModel={ row.giftFlag }
							disabled={ !row.isEdit || this.isLimited || this.isAssign}
							on-change={(flag) => { this.giftFlagChange(flag, row) }}
						>
						</el-checkbox>
					</fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width={200} editColumn={ !this.isStock && !this.isSaleReturnAmount } disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
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
				</fx-list-extend-row>
			)
		},
		giftFlagChange (flag, row) {
			flag && this.fxCalculation.calculateGift(row)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			const inHouse = (row.inHouse && row.inHouse.name) || ''
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="存放位置："></fx-list-extend-cell>
					<fx-list-extend-cell title="当前库存：">{row.stock}</fx-list-extend-cell>
					<fx-list-extend-cell title="入库仓库：">{inHouse}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand3 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="毛利金额："></fx-list-extend-cell>
					<fx-list-extend-cell title="毛利率："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand4 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="称重数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="净重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="皮重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="称重单位："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		fpExpandAsync (row) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const params = [row.id]
				if (row.stock || row.stock === 0) return Promise.resolve()
				return this.$fxApi('outStore.stockAmount', billId, organId)({ data: params }).then(res => {
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
				return this.$fxApi('outStore.stockAmount', billId, organId)({ data: params }).then(res => {
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
		},
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		},
		isNextColVisible (colProps) {
			const visibleColumns = this.$refs.detailsTable.getVisibleColumns()
			const index = visibleColumns.findIndex(item => {
				return colProps.includes(item.prop)
			})
			return ~index
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.table-cell-checkbox {
	line-height 33px
}
.batch-code {
	display flex
	align-items center
	.del-btn{
		font-size 14px
		margin 0 5px
	}
}
</style>
