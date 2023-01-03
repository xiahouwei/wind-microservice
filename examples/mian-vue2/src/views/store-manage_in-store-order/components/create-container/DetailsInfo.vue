<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="入库明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_in-store-order_details.detailsInfo
			:disabled="disabled "
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:tableEditEnterColumnProp="tableEditEnterColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:expandRows="expandRows"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:fpExpandAsync="fpExpandAsync"
			:fpExpandAllAsync="fpExpandAllAsync"
			:canAdd="!commonLimited && authCanadd"
			showSummary
			:showMistakeCheck="showMistakeCheck"
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
			:showDeleteBtn='showDeleteBtn'
			:deleteDisabled="deleteDisabled"
			:defaultSortParam="defaultSortParam"
		>
			<w-link
				slot="btn-tools-left-left"
				type="primary"
				icon="print-blue"
				@click="onLabelPrintClick"
			>品项条码打印</w-link>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				:organDetails="organDetails"
				:inStoreWareList="inStoreWareList"
				:canSetMulityInStore="canSetMulityInStore"
				:commonPriceEditState="commonPriceEditState"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
		</fx-details-table>
		<addMulity
			ref="addMulity"
			:organDetails="organDetails"
			:inStoreWareList="inStoreWareList"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
		<labelPrintDialog ref="labelPrint"></labelPrintDialog>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
import labelPrintDialog from '@/components/label-print/LabelPrintDialog.vue'
const EDIT_INPUT_TYPE = ['storeCode', 'code', 'unit', 'amount', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'assistUnitAmount', 'houseItemLocation']
const EDIT_INPUT_EXPAND_TYPE = ['productDate', 'memo']
const EDIT_INPUT_ENTER_TYPE = ['inTaxMoney', 'taxRate', 'inPrice', 'inMoney']
const REQUIRE_CHANGE_COLUMN = ['storeCode', 'code', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'item.assistUnit', 'assistUnitAmount']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulity,
		labelPrintDialog
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
		inStoreWareList: {
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
						return !((this.commonLimited && !this.isOutStoreSub && !this.isSaleOrderSubOutOrder) || this.disabled)
					},
					sortable: true,
					sortKey: 'inHouse.code',
					fxRender: this.storeCodeRender,
					click: this.onCellClick('storeCode')
				},
				{ prop: 'inHouse.name', label: '仓库名称', required: true, sortable: true },
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !(this.commonLimited || this.disabled)
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
						return (!(this.commonLimited || this.disabled) || (row.preDetailIsAssistUnit && !this.disabled))
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '入库数量',
					width: '120px',
					required: true,
					editColumn: () => {
						return this.commonAmountEditState
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
					label: '入库成本单价',
					width: '120px',
					sortable: true,
					fxRender: this.costPriceRender
				},
				{
					prop: 'money',
					label: '入库成本金额',
					width: '120px',
					sortable: true,
					fxRender: this.costMoneyRender,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxPrice',
					label: '含税单价',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag
					},
					sortable: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('inTaxPrice')
				},
				{
					prop: 'inTaxMoney',
					label: '含税金额',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag
					},
					sortable: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('inTaxMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					editColumn: (row) => {
						return this.commonPriceEditState && this.organDetails.inOrgan.taxPlayerFlag === 1 && !row.giftFlag
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'inPrice',
					label: '非税单价',
					width: '120px',
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag
					},
					sortable: true,
					fxRender: this.priceRender,
					click: this.onCellClick('inPrice')
				},
				{
					prop: 'inMoney',
					label: '非税金额',
					width: '120px',
					editColumn: (row) => {
						return this.commonPriceEditState && !row.giftFlag
					},
					sortable: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('inMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					summary: true,
					sortable: true,
					fxRender: this.inTaxRateMoneyRender,
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
						return row.item && row.item.assistUnit && this.commonAmountEditState
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
					prop: 'receiveFlag',
					label: '验收标记',
					align: 'center',
					editColumn: (row) => {
						return !this.disabled
					},
					fxRender: this.receiveFlagRender,
					click: this.onCellClick('receiveFlag')
				},
				{
					prop: 'houseItemLocation',
					label: '收货货位',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.isReturn && !this.isDiff && !this.disabled && !this.isOutStoreSub
					},
					fxRender: this.houseItemLocationRender,
					click: this.onCellClick('houseItemLocation')
				},
				{
					prop: 'putShelfInfo',
					label: '上架货位',
					width: '200px'
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px',
					editColumn: false,
					fxRender: this.expectArrivalDateRender
				}
			],
			tableValiDate: [{
				columnProp: 'storeCode',
				rule: (row, success, error) => {
					if (!row.inHouse.id && !this.isSingleHouse) {
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
			fxCalculation: this.$fxCalculation('inStore'),
			expandRows: [
				{ prop: 'detail1', label: '品项其他信息', render: this.renderExpand1, visible: true, required: true },
				{ prop: 'detail2', label: '库存信息', render: this.renderExpand2, visible: true },
				{ prop: 'detail3', label: '订货信息', render: this.renderExpand3, visible: true },
				{ prop: 'detail4', label: '供货商发货', render: this.renderExpand4, visible: true },
				{ prop: 'detail5', label: '称重信息', render: this.renderExpand5, visible: true }
			],
			itemList: [],
			itemUnitList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			fxCache: this.$fxUtils.fxCache('in-store'),
			codeSelectLoading: false,
			unitSelectLoading: false,
			houseSelectLoading: false,
			selectedRows: [],
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			houseItemLocationList: [],
			houseItemLocationSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let column = this.isSingleHouse ? this.tableColumn.slice(2) : this.tableColumn
			const costPower = ['price', 'money', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'inTaxRateMoney']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			if (!this.showHouseItemLocation) {
				column = column.filter(item => {
					return item.prop !== 'houseItemLocation'
				})
			}
			if (!this.showPutawayShelf) {
				column = column.filter(item => {
					return item.prop !== 'putShelfInfo'
				})
			}
			if (!this.isDiff && !this.isPurchase) {
				column = column.filter(item => {
					return item.prop !== 'expectArrivalDate'
				})
			}
			return column
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		showHouseItemLocation () {
			return this.organDetails.inOrgan.enableLocation === 1
		},
		showPutawayShelf () {
			return this.organDetails.inOrgan.shelfFlag === 1 && this.organDetails.inOrgan.enableLocation === 1
		},
		organCanChangeTax () {
			return this.organDetails.inOrgan.taxPlayerFlag === 1
		},
		isHand () {
			return this.isCommonTypeByRules('normal-sub')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isReturn () {
			return this.isCommonTypeByRules('return')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isCross () {
			return this.isCommonTypeByRules(['assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAmount () {
			return this.isCommonTypeByRules('amount-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isMoney () {
			return this.isCommonTypeByRules('money-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules(['offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isPurchase () {
			return this.isCommonTypeByRules('purchase')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isDiff () {
			return this.isCommonTypeByRules('diff')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOutStoreSub () {
			return this.isCommonTypeByRules(['outStore-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSaleOrderSubOutOrder () {
			return this.isCommonTypeByRules(['saleOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockOrderSubOutOrder () {
			return this.isCommonTypeByRules(['stockOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.otherOrgan.organType)
		},
		delSaleReturnOutStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['delSaleReturnOutStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		handReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['handReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		outStoreOrderChildInStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['outStoreOrderChildInStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		assigneSaleOrderInStoreOrderReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['assigneSaleOrderInStoreOrderReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSrmSubInStore () {
			return this.isCommonTypeByRules(['srm-sub-inStore'])(this.organDetails.sourceBillType)
		},
		commonLimited () {
			return this.isMove || this.isAssign || this.isAmount || this.isMoney || this.isReturn || this.isOffset || this.isOutStoreSub || this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.delSaleReturnOutStoreOrderSubBlueOrder ||
			this.handReturnSubBlueOrder || this.outStoreOrderChildInStoreOrderSubBlueOrder || this.assigneSaleOrderInStoreOrderReturnSubBlueOrder
		},
		commonPriceEditState () {
			return !(
				(this.isAssign && !this.systemParamMoneyEdit) ||
				(this.isAmount && !this.systemParamMoneyEdit) ||
				this.isMoney ||
				this.isMove ||
				this.isReturn ||
				this.disabled ||
				this.isOffset ||
				this.isOutStoreSub ||
				this.isSaleOrderSubOutOrder ||
				this.isStockOrderSubOutOrder ||
				this.delSaleReturnOutStoreOrderSubBlueOrder ||
				this.handReturnSubBlueOrder ||
				this.outStoreOrderChildInStoreOrderSubBlueOrder ||
				this.assigneSaleOrderInStoreOrderReturnSubBlueOrder
			)
		},
		commonAmountEditState () {
			return !(
				this.isAmount || this.isMoney || this.isMove || this.isReturn || this.disabled || this.isOffset ||
				this.delSaleReturnOutStoreOrderSubBlueOrder || this.handReturnSubBlueOrder ||
				this.outStoreOrderChildInStoreOrderSubBlueOrder || this.assigneSaleOrderInStoreOrderReturnSubBlueOrder ||
				this.isSrmSubInStore
			)
		},
		showDeleteBtn () {
			return !(
				this.isAmount || this.isMoney || this.isMove || this.isCross || this.isReturn ||
				this.isOffset || this.isOutStoreSub || this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder ||
				this.delSaleReturnOutStoreOrderSubBlueOrder || this.isSrmSubInStore
			) &&
			this.detailsAuthGetter('store-manage_in-store-order.delete-instore')
		},
		tableEditColumnProp () {
			let tableEditColumnProp = []
			if (this.isAssign && this.systemParamMoneyEdit) {
				tableEditColumnProp = ['amount', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'assistUnitAmount', 'houseItemLocation']
			} else if (this.isAssign && !this.systemParamMoneyEdit) {
				tableEditColumnProp = ['amount', 'assistUnitAmount', 'houseItemLocation']
			} else if (this.isAmount && this.systemParamMoneyEdit) {
				tableEditColumnProp = ['inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'houseItemLocation']
			} else if (this.isSaleOrderSubOutOrder) {
				tableEditColumnProp = ['storeCode', 'amount', 'assistUnitAmount']
			} else if (this.isStockOrderSubOutOrder) {
				tableEditColumnProp = ['amount']
			} else if (
				this.delSaleReturnOutStoreOrderSubBlueOrder ||
				this.handReturnSubBlueOrder ||
				this.outStoreOrderChildInStoreOrderSubBlueOrder ||
				this.assigneSaleOrderInStoreOrderReturnSubBlueOrder
			) {
				tableEditColumnProp = []
			} else if (this.isOutStoreSub) {
				tableEditColumnProp = this.isSingleHouse ? ['amount', 'assistUnitAmount'] : ['storeCode', 'amount', 'assistUnitAmount']
			} else if (this.commonLimited) {
				tableEditColumnProp = ['houseItemLocation']
			} else {
				tableEditColumnProp = EDIT_INPUT_TYPE
			}
			if (!this.showHouseItemLocation || this.isReturn || this.isDiff) {
				tableEditColumnProp = tableEditColumnProp.filter(item => {
					return item !== 'houseItemLocation'
				})
			}
			return tableEditColumnProp
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
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_INSTORE_MONEY_AUTH', 'value')
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_INSTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authCanadd () {
			return this.detailsAuthGetter('store-manage_in-store-order.add-instore')
		},
		tableExpandEditColumnProp () {
			if (this.isMoney || this.isMove || this.isReturn || this.isOffset || this.isOutStoreSub) {
				return ['memo']
			} else {
				return EDIT_INPUT_EXPAND_TYPE
			}
		},
		showMistakeCheck () {
			return !this.isOffset
		},
		canSetMulityInStore () {
			return !this.organDetails.singleHouseFlag && !((this.commonLimited && !this.isOutStoreSub && !this.isSaleOrderSubOutOrder) || this.disabled)
		},
		isRedOrder () {
			return this.organDetails.billSign === 2
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
				value={row.inHouse.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('storeCode')}
				row={row}
				rowIndex={$index}
				columnProp='storeCode'
				dropdownWidth='300px'
				loading={this.houseSelectLoading}
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				cellText={row.inHouse.code}
				selectOptionList={this.inStoreWareList}
				fpSelectShow={this.onHouseSelectShow(row)}
				on-on-change={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		onStoreCodeSelectChange (item, row) {
			row.inHouse = item
			if (row.houseItemLocation.id && row.item.id) {
				this.getHouseItemLocationList(item.id, '', row.item.id).then(res => {
					this.houseItemLocationList = res
					row.houseItemLocation = res[0] || { id: '', code: '' }
				})
			}
		},
		onHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.houseSelectLoading = true
					this.getValidStoreList(row.inHouse.id).then(res => {
						this.houseSelectLoading = false
						this.$emit('update:inStoreWareList', res)
						resolve()
					})
				})
			}
		},
		getValidStoreList (storeId) {
			const key = `inStoreWareList.${this.organDetails.id}.${storeId}.${this.organDetails.inOrgan.id}`
			const ids = [storeId]
			return this.fxCache.cacher(key, this.$fxApi('inStore.getValidStoreList', this.organDetails.inOrgan.id)({ data: ids }))
		},
		getItemList (storeId, itemId = '', withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}`
			return this.fxCache.cacher(key, this.$fxApi('inStore.getItemList', this.organDetails.id, storeId, itemId, withUnit))
		},
		getSupplierItemList (storeId, supplierId, itemId = '', withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}.${supplierId}`
			return this.fxCache.cacher(key, this.$fxApi('inStore.getSupplierItemList', this.organDetails.id, storeId, supplierId, itemId, withUnit))
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}.${this.organDetails.inOrgan.id}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi('inStore.getUnitList', itemId, this.organDetails.id)({ data }))
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
			row.item = item
			row.assistUnit = item.assistUnit
			return this.getUnitList(item.id).then(res => {
				this.itemUnitList = res
				row.itemUnit = res[0]
				return Promise.resolve()
			}).then(() => {
				const params = {
					buyerOrganId: this.organDetails.inOrgan.id,
					sellerOrganId: this.organDetails.otherOrgan.id,
					bizDate: this.organDetails.businessDate,
					itemId: item.id,
					unitId: row.itemUnit.id
				}
				return this.$fxApi('inStore.priceList', this.organDetails.id)({ data: params }).then(res => {
					row.inPrice = res.price || 0
					row.taxRate = res.taxRate
					row.inTaxPrice = res.taxPrice || 0
					row.strategy = res.strategy
					row.mainUnitId = res.unitId
					const unit = this.itemUnitList.find(item => item.id === res.unitId)
					row.itemUnit = unit || row.itemUnit
					this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
					this.fxCalculation.changeAmount(row)
					row.inTaxMoneyClone = Math.abs(item.inTaxMoney)
					row.inMoneyClone = Math.abs(item.inMoney)
					if (this.showHouseItemLocation) {
						const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
						this.getHouseItemLocationList(storeId, '', row.item.id).then(res => {
							this.houseItemLocationList = res
							row.houseItemLocation = res[0] || { id: '', code: '' }
						})
					}
					if (this.itemUnitList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('amount')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
				})
			})
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
					if (storeId) {
						if (this.isHand && this.isSupplier) {
							this.getSupplierItemList(storeId, this.organDetails.otherOrgan.id, row.item.id).then(res => {
								this.codeSelectLoading = false
								this.itemList = res
								resolve()
							})
						} else {
							this.getItemList(storeId, row.item.id).then(res => {
								this.codeSelectLoading = false
								this.itemList = res
								resolve()
							})
						}
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
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (row.preDetailIsAssistUnit) {
				this.fxCalculation.changeUnitNotCalculateAssistAmount(row, item)
				row.inTaxMoneyClone = Math.abs(item.inTaxMoney)
				row.inMoneyClone = Math.abs(item.inMoney)
			} else {
				this.syncItemAssistUnit(item, row).then(() => {
					this.fxCalculation.changeUnit(row, item)
					row.inTaxMoneyClone = Math.abs(item.inTaxMoney)
					row.inMoneyClone = Math.abs(item.inMoney)
				})
			}
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
		onDateChange (item, row) {
			row.productDate = item
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			if (this.billColor) {
				return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.organDetails.billSign === 1 ? '+' : ''}{this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}</span>
			} else {
				return <fx-list-cell-input-number
					ref={`amount-${$index}`}
					vModel={row.amount}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('amount') && !this.isSrmSubInStore}
					row={row}
					rowIndex={$index}
					columnProp='amount'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					on-on-change={this.onAmountChange}
					on-on-input-enter={this.onAmountEnter}
					on-on-input-tab={this.onAmountTab}
				>
				</fx-list-cell-input-number>
			}
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (!row.preDetailIsAssistUnit && (`${oldVal}` === '0' || this.mainAssistAmountTogether)) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		onAmountEnter (row) {
			if (row.giftFlag || !this.haveCostPower || !this.tableEditColumnProp.includes('inTaxPrice')) {
				this.$refs.detailsTable.doRowEditEnter()
			} else {
				this.$refs.detailsTable.setListCellFocus('inTaxPrice')
			}
		},
		onAmountTab (row, $index) {
			if (this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder) {
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
			} else if (row.giftFlag || !this.haveCostPower || !this.tableEditColumnProp.includes('inTaxPrice')) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else if (this.showHouseItemLocation) {
					this.$refs.detailsTable.setListCellFocus('houseItemLocation')
				} else {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
				}
			} else {
				this.$refs.detailsTable.setListCellFocus('inTaxPrice')
			}
		},
		costPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)}</span>
		},
		costMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.organDetails.billSign === 1 ? '+' : ''}{this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)}</span>
		},
		inTaxRateMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.organDetails.billSign === 1 ? '+' : ''}{this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)}</span>
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inTaxPrice-${$index}`}
				vModel={row.inTaxPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('inTaxPrice')}
				row={row}
				rowIndex={$index}
				columnProp='inTaxPrice'
				pointSize={this.sysPricePointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)}
				on-on-change={this.onTaxPriceChange}
				disabled={row.giftFlag}
				class={this.billColor}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.changePriceWithTax(row)
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flexBox'>
				<div class='minusBox'> {this.isRedOrder && (row.isEdit && this.tableEditColumnProp.includes('inTaxMoney')) ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`inTaxMoney-${$index}`}
					vModel={row.inTaxMoneyClone}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('inTaxMoney')}
					row={row}
					rowIndex={$index}
					columnProp='inTaxMoney'
					pointSize={this.sysMoneyPointSize}
					on-on-change={this.onTaxMoneyChange}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)}
					vOn:on-input-tab={this.onTaxMoneyTab}
					disabled={row.giftFlag}
					class={this.billColor}
				>
				</fx-list-cell-input-number>
			</section>
		},
		onTaxMoneyTab (row, $index) {
			if (!this.organCanChangeTax) {
				this.onTaxSelectTab(row, $index)
			} else {
				this.$refs.detailsTable.setListCellFocus('taxRate')
			}
		},
		onTaxMoneyChange (val, row) {
			row.inTaxMoney = this.isRedOrder ? -val : val
			this.fxCalculation.changeSumPriceWithTax(row)
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('taxRate')}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				disabled={!this.organCanChangeTax || row.giftFlag}
				selectOptionList={this.taxesList}
				on-on-change={this.onTaxSelectChange}
				class={this.billColor}
				on-on-select-tab={this.onTaxSelectTab}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
			row.inMoneyClone = this.isRedOrder ? -row.inMoney : row.inMoney
		},
		onTaxSelectTab (row, $index) {
			if (this.isNextColVisible(['inPrice'])) {
				this.$refs.detailsTable.setListCellFocus('inPrice')
			} else {
				this.onPriceTab(row, $index)
			}
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inPrice-${$index}`}
				vModel={row.inPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('inPrice')}
				row={row}
				rowIndex={$index}
				columnProp='inPrice'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)}
				on-on-change={this.onPriceChange}
				disabled={row.giftFlag}
				class={this.billColor}
				on-on-input-tab={this.onPriceTab}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changePrice(row)
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		onPriceTab (row, $index) {
			if (this.isNextColVisible(['inMoney'])) {
				this.$refs.detailsTable.setListCellFocus('inMoney')
			} else {
				this.onMoneyTab(row, $index)
			}
		},
		moneyRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flexBox'>
				<div class='minusBox'> {this.isRedOrder && (row.isEdit && this.tableEditColumnProp.includes('inMoney')) ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`inMoney-${$index}`}
					vModel={row.inMoneyClone}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('inMoney')}
					row={row}
					rowIndex={$index}
					columnProp='inMoney'
					pointSize={this.sysMoneyPointSize}
					on-on-change={this.onMoneyChange}
					on-on-input-tab={this.onMoneyTab}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)}
					disabled={row.giftFlag}
					class={this.billColor}
				>
				</fx-list-cell-input-number>
			</section>
		},
		onMoneyChange (val, row) {
			row.inMoney = this.isRedOrder ? -val : val
			this.fxCalculation.changeSumPrice(row)
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		onMoneyTab (row, $index) {
			if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else if (this.showHouseItemLocation) {
				this.$refs.detailsTable.setListCellFocus('houseItemLocation')
			} else {
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
			}
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit && this.tableEditColumnProp.includes('assistUnitAmount')}
				row={row}
				rowIndex={$index}
				columnProp='assistUnitAmount'
				pointSize={this.sysPointSize}
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				class={this.billColor}
			>
			</fx-list-cell-input-number>
		},
		receiveFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <el-checkbox
				vModel={ row.receiveFlag }
				disabled={ !row.isEdit}
				class="table-cell-checkbox"
			>
			</el-checkbox>
		},
		houseItemLocationRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`houseItemLocation-${$index}`}
				value={row.houseItemLocation && row.houseItemLocation.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('houseItemLocation')}
				row={row}
				rowIndex={$index}
				columnProp='houseItemLocation'
				clearable
				filterKeys={['code', 'houseItemLocationInfo']}
				cellText={row.houseItemLocation && row.houseItemLocation.houseItemLocationInfo}
				loading={this.houseItemLocationSelectLoading}
				selectOptionList={this.houseItemLocationList}
				selectOptionProp={{ name: 'houseItemLocationInfo' }}
				on-on-change={this.onHouseItemLocationChange}
				fpSelectShow={this.onHouseItemLocationSelectShow(row)}
			></fx-list-cell-select>
		},
		onHouseItemLocationChange (item, row) {
			row.houseItemLocation = item
		},
		onHouseItemLocationSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					const inHouseId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
					this.houseItemLocationSelectLoading = true
					if (inHouseId && row.item.id) {
						this.getHouseItemLocationList(inHouseId, row.houseItemLocation.id, row.item.id).then(res => {
							this.houseItemLocationSelectLoading = false
							this.houseItemLocationList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择仓库/品项')
					}
				})
			}
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
		getHouseItemLocationList (inHouseId, houseItemLocationId = '', itemId = '') {
			if (!inHouseId) return Promise.resolve([])
			const key = `houseItemLocationList.${inHouseId}.${houseItemLocationId}.${itemId}`
			return this.fxCache.cacher(key, this.$fxApi('inStore.getHouseItemLocationList', inHouseId, houseItemLocationId, itemId, this.organDetails.inOrgan.shelfFlag || null))
		},
		beforeRowEdit (row) {
			this.houseItemLocationList = !row.houseItemLocation.id ? [] : [row.houseItemLocation]
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
				} else if (!this.isSingleHouse && type === 'storeCode' && !row.id && row.inHouse.code) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (this.isAssign && !this.tableEditColumnProp.includes(`${type}`)) {
					if (type === 'unit' && row.preDetailIsAssistUnit) {
						this.$refs.detailsTable.setListCellFocus('unit')
					} else if (type === 'receiveFlag') {
						this.$refs.detailsTable.setListCellFocus('receiveFlag')
					} else {
						this.$refs.detailsTable.setListCellFocus('amount')
					}
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
					house.id = this.organDetails.inHouse.id
				} else if (!this.isSingleHouse && $index > 0) {
					house = this.tableDetails[$index - 1].inHouse || {}
				} else if (!this.isSingleHouse && $index === 0) {
					if (this.inStoreWareList.length === 1) {
						house = this.inStoreWareList[0]
					}
				}
				const data = {
					productDate: this.organDetails.businessDate,
					inHouse: house,
					item: {},
					itemUnit: {},
					mainUnitId: '',
					amount: 0,
					inTaxPrice: 0,
					inTaxMoney: 0,
					taxRate: 0,
					inPrice: 0,
					inMoney: 0,
					inTaxRateMoney: 0,
					assistUnitAmount: 0,
					assignAmount: 0,
					abortAssign: 0,
					memo: '',
					houseItemLocation: {},
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate), '时分')
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('inStore.editDetail', this.organDetails.id)({ data: params, logger }).then(res => {
					params.putShelfInfo = res.putShelfInfo || ''
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi('inStore.addDetail', this.organDetails.id)({ data: params, logger }).then(res => {
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
				code: this.organDetails.sysBillCode,
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		getAddItemInfo (params) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.organDetails.inHouse.name
			} else {
				storeName = params.inHouse.name
			}
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			const taxPrice = params.inTaxPrice
			return `入库仓库:${storeName},品项名称:${name},单位:${itemUnit},入库数量:${amount},含税单价:${taxPrice}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi('inStore.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('inStore.delDetail', this.organDetails.id, ids[0])({ logger }).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.organDetails.inHouse.name
			}
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				if (!this.isSingleHouse) {
					storeName = item.inHouse.name
				}
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.inTaxPrice
				return `入库仓库:${storeName},品项名称:${name},单位:${itemUnit},入库数量:${amount},含税单价:${taxPrice}`
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
		onSettingMulitySave (setting, settingMulitySelectedHouse) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const itemNames = []
				let settingInfo = ''
				const ids = []
				res.forEach(item => {
					itemNames.push(item.item.name)
					if (item.mergeIds) {
						return ids.push(...item.mergeIds.split('_'))
					} else {
						return ids.push(item.id)
					}
				})
				let params = null
				if (setting.type === 0) {
					params = {
						ids,
						operColumn: 'taxRate',
						taxRate: setting.tax
					}
					settingInfo = `税率:${setting.tax}`
				} else if (setting.type === 1) {
					params = {
						ids,
						operColumn: 'productDate',
						productDate: setting.productDate
					}
					settingInfo = `生产日期:${setting.productDate}`
				} else if (setting.type === 2) {
					params = {
						ids,
						operColumn: 'memo',
						memo: setting.memo
					}
					settingInfo = `备注:${setting.memo}`
				} else if (setting.type === 3) {
					params = {
						ids,
						billId: this.organDetails.id,
						operColumn: 'inHouse',
						houseId: setting.houseId
					}
					settingInfo = `入库仓库:${settingMulitySelectedHouse.name}`
				}
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi('inStore.setMulity', this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
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
			const disabled = this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.delSaleReturnOutStoreOrderSubBlueOrder
			const shelfLife = row.item.shelfLifeFlag ? row.item.shelfLife : ''
			const dateEdit = !(this.isMoney || this.isMove || this.isReturn || this.isOffset || this.isOutStoreSub || disabled)
			const memoEdit = !disabled
			const pickerOptions = {
				disabledDate: date => {
					return date.getTime() > new Date(this.organDetails.businessDate).getTime()
				}
			}
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="生产日期：" class="productdate" editColumn={ dateEdit } disabled={ this.disabled || disabled } vOn:click={this.extendCellClick('productDate', row)}>
						<fx-list-cell-date
							ref={`productDate-${$index}`}
							vModel={ row.productDate }
							isEdit={ row.isEdit && dateEdit }
							row={ row }
							rowIndex={ $index }
							disabled ={ this.disabled && !row.isEdit }
							columnProp='productDate'
							on-on-change={ this.onDateChange }
							pickerOptions={ pickerOptions }
						>
						</fx-list-cell-date>
					</fx-list-extend-cell>
					<fx-list-extend-cell title="保质期天数：">{shelfLife}</fx-list-extend-cell>
					<fx-list-extend-cell title="批次号：">{row.batchCode || ''}</fx-list-extend-cell>
					<fx-list-extend-cell title="赠品：" editColumn={ this.isHand } disabled={ this.disabled || disabled } vOn:click={this.extendCellClick('', row)}>
						<el-checkbox
							vModel={ row.giftFlag }
							disabled={ !row.isEdit || this.commonLimited }
							class={{ 'can-edit': !row.isEdit && this.isHand }}
							on-change={(flag) => { this.giftFlagChange(flag, row) }}
						>
						</el-checkbox>
					</fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width={200} editColumn={ memoEdit } disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
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
			row.inTaxMoneyClone = Math.abs(row.inTaxMoney)
			row.inMoneyClone = Math.abs(row.inMoney)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			const outHouse = (row.outHouse && row.outHouse.name) || ''
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="存放位置："></fx-list-extend-cell>
					<fx-list-extend-cell title="当前库存：">{ row.stock }</fx-list-extend-cell>
					<fx-list-extend-cell title="运费分摊：">{ row.freight }</fx-list-extend-cell>
					<fx-list-extend-cell title="出库仓库：">{ outHouse }</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand3 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="订货数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="订货辅助数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="订货含税单价："></fx-list-extend-cell>
					<fx-list-extend-cell title="订货含税金额："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand4 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="供货商发货数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="供货商发货单价："></fx-list-extend-cell>
					<fx-list-extend-cell title="供货商发货金额："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand5 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="是否称重：">
						<el-checkbox vModel={row.weight} disabled={true}></el-checkbox>
					</fx-list-extend-cell>
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
				const organId = this.organDetails.inOrgan.id
				const params = [row.id]
				if (row.stock || row.stock === 0) return Promise.resolve()
				return this.$fxApi('inStore.stockAmount', billId, organId)({ data: params }).then(res => {
					row.stock = res[row.id] || 0
					return Promise.resolve()
				})
			})
		},
		fpExpandAllAsync (tableData) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.inOrgan.id
				const params = tableData.map(item => item.id)
				return this.$fxApi('inStore.stockAmount', billId, organId)({ data: params }).then(res => {
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
		syncItemAssistUnit (unit, row) {
			return new Promise(resolve => {
				const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
				if (storeId && row.item.id) {
					if (this.isHand && this.isSupplier) {
						this.getSupplierItemList(storeId, this.organDetails.otherOrgan.id, row.item.id).then(res => {
							const currentItem = res.find(item => item.id === row.item.id)
							if (currentItem) {
								row.item.assistUnit = currentItem.assistUnit
								row.item.assistUnitRatio = currentItem.assistUnitRatio
								resolve()
							} else {
								resolve()
							}
						})
					} else {
						this.getItemList(storeId, row.item.id).then(res => {
							const currentItem = res.find(item => item.id === row.item.id)
							if (currentItem) {
								row.item.assistUnit = currentItem.assistUnit
								row.item.assistUnitRatio = currentItem.assistUnitRatio
								resolve()
							} else {
								resolve()
							}
						})
					}
				} else {
					resolve()
				}
			})
		},
		syncEditItemUnitList () {
			if (this.isRowEditing()) {
				const editingRow = this.$refs.detailsTable.getEditingRowData()
				if (editingRow.item.id) {
					this.getUnitList(editingRow.item.id, editingRow.itemUnit.id).then(res => {
						if (editingRow.itemUnit.id && !res.map(item => item.id).includes(editingRow.itemUnit.id)) {
							editingRow.itemUnit = {}
						}
						this.itemUnitList = res
						this.unitSelectLoading = false
					})
				}
			}
		},
		isNextColVisible (colProps) {
			const visibleColumns = this.$refs.detailsTable.getVisibleColumns()
			const index = visibleColumns.findIndex(item => {
				return colProps.includes(item.prop)
			})
			return ~index
		},
		onLabelPrintClick () {
			const itemList = this.tableDetails.filter(item => {
				return !!item.itemUnit.barcode
			}).map(item => {
				return {
					name: item.item.name,
					unit: item.itemUnit.name,
					code: item.item.code,
					spec: item.item.spec,
					itemTypeName: item.item.itemTypeRef && item.item.itemTypeRef.name,
					amount: item.amount,
					barcode: item.itemUnit.barcode,
					price: item.price,
					money: item.money,
					productDate: item.productDate ? this.$fxUtils.setDate(item.productDate) : '',
					batchCode: item.batchCode,
					printDate: this.$fxUtils.setDate(item.printDate),
					shelfLife: item.item.shelfLife
				}
			})
			if (itemList.length === 0) {
				this.$fxMessage.warning('当前无可打印条码')
				return false
			}
			this.$refs.labelPrint.open(itemList, 'inStore')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.productdate{
	>>>.fx-list-extend-cell__container{
		width 170px!important
		margin-left -20px
		.fx-ellipsis {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
}
.flexBox {
	display flex
}
.minusBox {
	font-size 22px
	margin-right 3px
}
.can-edit {
	>>>.el-checkbox__inner {
		cursor: pointer
		&::after {
			cursor: pointer
		}
	}
}
.table-cell-checkbox {
	line-height 33px
}
</style>
