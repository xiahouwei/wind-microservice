<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="销售明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.stock-sale-manage_sale-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:tableEditEnterColumnProp="tableEditEnterColumnProp"
			:expandRows="expandRows"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:canAdd="!hasParentBill && authCanAdd"
			:showDeleteBtn="!hasParentBill && showDeleteBtn"
			:deleteDisabled="deleteDisabled"
			showSummary
			showMistakeCheck
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
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
const EDIT_INPUT_TYPE = ['code', 'unit', 'amount', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount', 'expectArrivalDate']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const EDIT_INPUT_ENTER_TYPE = ['taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount']
const REQUIRE_CHANGE_COLUMN = ['code', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'item.assistUnit', 'assistUnitAmount', 'expectArrivalDate']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulity
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
		disabled: Boolean,
		deleteDisabled: Boolean,
		itemName: String
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return this.isHand && !this.disabled
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
					editColumn: () => {
						return this.isHand && !this.disabled && !this.organDetails.stockPlan.id
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '销售数量',
					width: '140px',
					required: true,
					editColumn: () => {
						return this.isHand && !this.disabled
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
					prop: 'taxPrice',
					label: '含税销售单价',
					width: '130px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'taxMoney',
					label: '含税销售金额',
					width: '130px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('taxMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '销项税率',
					width: '100px',
					editColumn: (row) => {
						return !row.giftFlag && this.organDetails.organ.taxPlayerFlag === 1 && !this.disabled
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'price',
					label: '非税销售单价',
					width: '120px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.priceRender,
					click: this.onCellClick('price')
				},
				{
					prop: 'money',
					label: '非税销售金额',
					width: '120px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('money'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRateMoney',
					label: '税额',
					width: '120px',
					sortable: true,
					visible: false,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '120px',
					editColumn: (row) => {
						return row.item && row.item.assistUnit && !this.disabled && this.isHand
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
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px',
					editColumn: true,
					fxRender: this.expectArrivalDateRender,
					click: this.onCellClick('expectArrivalDate')
				}
			],
			tableValiDate: [{
				columnProp: 'code',
				rule: (row, success, error) => {
					let repeat = null
					if (this.isHand) {
						repeat = this.tableDetails.find(item => item.item.id === row.item.id && item.giftFlag === row.giftFlag && item.id !== row.id)
					} else {
						repeat = this.tableDetails.find(item => item.inHouse.id === row.inHouse.id && item.item.id === row.item.id && item.giftFlag === row.giftFlag && item.id !== row.id)
					}
					if (!row.item.id) {
						error('品项编号不能为空')
					} else if (repeat) {
						if (!row.giftFlag) {
							this.$fxMessage.warning('同一品项不得重复添加')
							error()
						} else {
							this.$fxMessage.warning('该品项已有赠品，不能再添加赠品')
							error()
						}
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
				columnProp: 'amount',
				rule (row, success, error) {
					if (row.stockPlanDetail) {
						if (
							row.amount < row.stockPlanDetail.lowerLimit ||
							(row.stockPlanDetail.supperLimit > 0 && row.amount > row.stockPlanDetail.supperLimit) ||
							(row.stockPlanDetail.roundingWay && row.amount % row.stockPlanDetail.roundingNum !== 0)
						) {
							error()
						} else {
							success()
						}
					} else {
						success()
					}
				}
			}, {
				columnProp: 'expectArrivalDate',
				rule: (row, success, error) => {
					if (!row.expectArrivalDate) {
						error('期望到货日期不能为空')
					} else if (!this.$fxUtils.compareDate(row.expectArrivalDate, this.organDetails.businessDate)) {
						error('期望到货时间不得小于订货时间')
					} else {
						success()
					}
				}
			}],
			expandRows: [
				{ prop: 'sendRow', label: '分派状态', render: this.renderExpand1, visible: true },
				{ prop: 'giftFlag', label: '赠品', render: this.renderExpand2, visible: true }
			],
			fxCalculation: this.$fxCalculation('common'),
			itemList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('saleOrderGenerateType', 'rules'),
			selectedRows: [],
			tableExpandEditColumnProp: EDIT_INPUT_EXPAND_TYPE,
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			fxCache: this.$fxUtils.fxCache('sale-order'),
			itemUnitList: [],
			unitSelectLoading: false,
			codeSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let column = this.tableColumn
			const moneyPower = ['taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'taxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		inAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('inAssignState')(val)[key]
			}
		},
		outAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('outAssignState')(val)[key]
			}
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.organ.organType)
		},
		isPurchase () {
			return this.isCommonTypeByRules('purchase-subb')(this.organDetails.billType, this.organDetails.subBillType)
		},
		tableEditColumnProp () {
			if (this.hasParentBill) {
				return ['taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'expectArrivalDate']
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		sysArrivalInterval () {
			return this.getSysParams('CXGL_XSDD_SJQZL_EXPECTTIME', 'value')
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_SALESTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authCanAdd () {
			return this.detailsAuthGetter('stock-sale-manage_sale-order.add-sale')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('stock-sale-manage_sale-order.delete-sale')
		},
		isJsdOrder () {
			return this.isCommonTypeByRules('jsd-sub')(this.organDetails.sourceType)
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
		getItemList (extraItemId = '') {
			const params = {
				urgent: this.organDetails.urgent,
				stockPlanId: this.organDetails.stockPlan.id,
				sellerOrganId: this.organDetails.organ.id,
				orderDate: this.organDetails.businessDate,
				extraItemId
			}
			if (this.isHand && this.isSupplier && !this.organDetails.stockPlan.id) {
				params.supplierId = this.organDetails.organ.id
			}
			const key = `itemList.${this.organDetails.id}.${extraItemId}.${params.urgent}.${params.stockPlanId}.${params.sellerOrganId}.${params.orderDate}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemList`)({ data: params }))
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
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
				selectOptionList={this.itemList}
				loading={this.codeSelectLoading}
				asyncChange={this.onCodeSelectChange}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
				on-on-select-tab={this.onCodeSelectTab}
				fpSelectShow={this.onCodeSelectShow(row)}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				return this.getUnitList(item.id).then(res => {
					this.itemUnitList = res
					row.itemUnit = res[0]
					return Promise.resolve()
				}).then(() => {
					row.mainUnitId = this.itemUnitList.find(item => {
						return item.mainFlag
					}).id
					if (item.stockPlanDetail) {
						row.stockPlanDetail = item.stockPlanDetail
						const arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(item.stockPlanDetail.arrivalCycle)
						row.expectArrivalDate = this.$fxUtils.setDateTime(new Date(arrivalDate))
					}
					this.getItemPrice(row.item.id, this.itemUnitList[0].id).then(res => {
						row.taxPrice = res.taxPrice || 0
						row.price = res.price || 0
						row.taxRate = res.taxRate || 0
						const unit = this.itemUnitList.find(item => item.id === res.unitId)
						row.itemUnit = unit || row.itemUnit
						this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
						this.fxCalculation.changeAmount(row)
						if (this.itemUnitList.length === 1 || item.stockPlanDetail) {
							this.$refs.detailsTable.setListCellFocus('amount')
						} else {
							this.$refs.detailsTable.setListCellFocus('unit')
						}
						resolve()
					})
				})
			})
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (unchangedFlag) {
					this.getUnitList(item.id).then(res => {
						if (res.length === 1 || item.stockPlanDetail) {
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
					if (res.length === 1 || item.stockPlanDetail) {
						this.$refs.detailsTable.setListCellFocus('amount')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
				})
			}
		},
		onCodeSelectTab (row, $index) {
			if (row.stockPlanDetail) {
				this.$refs.detailsTable.setListCellFocus('amount')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					this.getItemList(row.item.id).then(res => {
						this.codeSelectLoading = false
						this.itemList = res
						resolve()
					})
				})
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('unit')}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				disabled={!!this.organDetails.stockPlan.id}
				vOn:on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			this.fxCalculation.changeUnit(row, item)
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
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}.${this.organDetails.stockPlan.id}.${this.organDetails.organ.id}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemUnitList`, this.organDetails.id, itemId)({ data }))
		},
		getItemPrice (itemId, unitId) {
			const params = {
				buyerOrganId: this.organDetails.otherOrgan.id,
				sellerOrganId: this.organDetails.organ.id,
				bizDate: this.organDetails.businessDate,
				stockPlanId: this.organDetails.stockPlan.id,
				itemId,
				unitId
			}
			return this.$fxApi(`${apiName}.getItemPirce`)({ data: params })
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <el-tooltip value={row.tipFlag && !!row.stockPlanDetail} manual={true} effect="light" placement="top">
				<div slot="content">
					<span>上限:{row.stockPlanDetail && row.stockPlanDetail.supperLimit}</span>
					<span>下限:{row.stockPlanDetail && row.stockPlanDetail.lowerLimit}</span>
					<br/>
					<span>取整:{(row.stockPlanDetail && row.stockPlanDetail.roundingWay) ? row.stockPlanDetail.roundingNum : '不取整'}</span>
				</div>
				<fx-list-cell-input-number
					ref={`amount-${$index}`}
					vModel={row.amount}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('amount')}
					row={row}
					rowIndex={$index}
					columnProp='amount'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					class="cell-amount__input"
					vOn:on-change={this.onAmountChange}
					vOn:focus={this.onAmountFocus}
					vOn:blur={this.onAmountBlur}
					vOn:on-input-enter={this.onAmountEnter}
					vOn:on-input-tab={this.onAmountTab}
				>
				</fx-list-cell-input-number>
			</el-tooltip>
		},
		onAmountFocus (row, index) {
			this.$set(this.tableDetails[index], 'tipFlag', true)
		},
		onAmountBlur (row, index) {
			row.tipFlag = false
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
		},
		onAmountEnter (row, index) {
			if (row.giftFlag || !this.haveMoneyPower) {
				this.$refs.detailsTable.doRowEditEnter()
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
			}
		},
		onAmountTab (row, index) {
			if ((row.giftFlag || !this.haveMoneyPower) && row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else if (row.giftFlag || !this.haveMoneyPower) {
				this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`taxPrice-${$index}`}
				vModel={row.taxPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('taxPrice')}
				row={row}
				rowIndex={$index}
				columnProp='taxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onTaxPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.changePriceWithTax(row)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`taxMoney-${$index}`}
				vModel={row.taxMoney}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('taxMoney')}
				row={row}
				rowIndex={$index}
				columnProp='taxMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onTaxMoneyChange}
				on-on-input-tab={this.onTaxMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
		},
		onTaxMoneyTab (row, $index) {
			if (this.organDetails.organ.taxPlayerFlag !== 1) {
				this.$refs.detailsTable.setListCellFocus('price')
			} else {
				this.$refs.detailsTable.setListCellFocus('taxRate')
			}
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
				selectOptionList={this.taxesList}
				disabled={this.organDetails.organ.taxPlayerFlag !== 1 || !!row.giftFlag}
				vOn:on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`price-${$index}`}
				vModel={row.price}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('price')}
				row={row}
				rowIndex={$index}
				columnProp='price'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changePrice(row)
		},
		moneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`money-${$index}`}
				vModel={row.money}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('money')}
				row={row}
				rowIndex={$index}
				columnProp='money'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onMoneyChange}
				vOn:on-input-tab={this.onMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		onMoneyTab (row, $index) {
			if (row.item.assistUnit && !this.hasParentBill) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else {
				this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
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
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				pointSize={this.sysPointSize}
				on-on-change={this.onAssistUnitAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onAssistUnitAmountChange (val, row) {
			if (row.itemUnit.assistFlag) {
				this.fxCalculation.changeAssistAmount(row)
			}
		},
		expectArrivalDateRender (h, { row, $index }) {
			h = this.$createElement
			const pickerOptions = {
				disabledDate: (time) => {
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.businessDate)
				}
			}
			return <fx-list-cell-date
				ref={`expectArrivalDate-${$index}`}
				vModel={row.expectArrivalDate}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('expectArrivalDate')}
				row={row}
				valueFormat='yyyy-MM-dd HH:mm:SS'
				rowIndex={$index}
				columnProp='expectArrivalDate'
				pickerOptions={pickerOptions}
				cellText={this.$fxUtils.formatterDateTime(row.expectArrivalDate)}
			>
			</fx-list-cell-date>
		},
		beforeRowEdit (row) {
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type = 'code') {
			return new Promise(resolve => {
				this.$refs.detailsTable.setListCellFocus(type)
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpInitAddDetailsData () {
			return Promise.resolve(this.initDetailsRow())
		},
		initDetailsRow () {
			const arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(this.sysArrivalInterval)
			return {
				item: {},
				itemUnit: {},
				mainUnitId: '',
				amount: 0,
				taxPrice: 0,
				taxMoney: 0,
				taxRate: 0,
				price: 0,
				money: 0,
				taxRateMoney: 0,
				giftFlag: 0,
				assistUnitAmount: '',
				expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate)),
				abortAssign: 0,
				memo: ''
			}
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi(`${apiName}.addDetails`, this.organDetails.id)({ data: params, logger }).then(res => {
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
				orderData: this.organDetails,
				itemName: organDetails.item.name
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			const taxPrice = params.taxPrice
			return `品项名称:${name},单位:${itemUnit},销售数量:${amount},含税单价:${taxPrice}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetail`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.taxPrice
				return `品项名称:${name},单位:${itemUnit},销售数量:${amount},含税单价:${taxPrice}`
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
						taxRate: setting.tax,
						batchSetType: 'taxRate'
					}
					settingInfo = `税率:${setting.tax}`
				} else if (setting.type === 1) {
					params = {
						ids,
						expectArrivalDate: setting.expectArrivalDate,
						batchSetType: 'expectArrivalDate'
					}
					settingInfo = `期望到货时间:${setting.expectArrivalDate}`
				} else if (setting.type === 2) {
					params = {
						ids,
						memo: setting.memo,
						batchSetType: 'memo'
					}
					settingInfo = `备注:${setting.memo}`
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(`${apiName}.settingMulity`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		renderExpand1 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="入库状态：" labelWidth='72px' width = { 60 }>{this.inAssignState(row.inAssignStatus, 'label')}</fx-list-extend-cell>
					<fx-list-extend-cell title="入库已分派数量：" width = { 60 }>{row.inAssignAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="入库放弃分派：" width = { 60 }>{row.inGiveUpAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="出库状态：" labelWidth='72px' width = { 60 }>{this.outAssignState(row.outAssignStatus, 'label')}</fx-list-extend-cell>
					<fx-list-extend-cell title="出库已分派数量：" width = { 60 }>{row.outAssignAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="出库放弃分派：" width = { 60 }>{row.outGiveUpAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="预估申请数量：" width = { 60 }>{row.preditApplyAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="买方仓库：" labelWidth='72px' width = { 120 }>{row.inHouse && row.inHouse.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width = { 200 } editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
						<fx-list-cell-input
							ref={`memo-${$index}`}
							vModel = { row.memo }
							isEdit = { row.isEdit }
							row = { row }
							rowIndex = { $index }
							columnProp = 'memo'
							maxlength = { this.$fxCommon.getFxInputMaxLength('memo') }
							regType = { this.$fxCommon.getFxInputReg('memo') }
						></fx-list-cell-input>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-extend-row>
				<fx-list-extend-cell title="赠品：" labelWidth='72px' width = { 60 } editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('', row)}>
					<el-checkbox
						vModel={ row.giftFlag }
						disabled={ !row.isEdit }
						true-label={ 1 }
						false-label={ 0 }
						vOn:change={checked => this.onGiftFlagChange(checked, row)}
					></el-checkbox>
				</fx-list-extend-cell>
				<fx-list-extend-cell vShow={this.isJsdOrder} title="优惠类型：" labelWidth='72px' width = { 88 }>{row.discountType}</fx-list-extend-cell>
				<fx-list-extend-cell vShow={this.isJsdOrder} title="优惠金额：" labelWidth='72px' width = { 60 }>{row.discountMoney}</fx-list-extend-cell>
			</fx-list-extend-row>
		},
		onGiftFlagChange (checked, row) {
			checked && this.fxCalculation.calculateGift(row)
		},
		clear () {
			this.$refs.detailsTable.clear()
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
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
