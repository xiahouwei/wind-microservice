<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="采购明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.stock-sale-manage_stock-order_details.detailsInfo
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
			:canAdd="!(isAssign || isPlanAssign) && authCanAdd"
			showSummary
			showMistakeCheck
			:defaultSortParam="defaultSortParam"
			:showDeleteBtn="showDeleteBtn"
			:deleteDisabled="deleteDisabled"
			:mistakeDisabled="mistakeDisabled"
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
			:storeSelectList="storeSelectList"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
const EDIT_INPUT_TYPE = ['storeCode', 'code', 'unit', 'amount', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount', 'expectArrivalDate']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const EDIT_INPUT_ENTER_TYPE = ['taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount']
const REQUIRE_CHANGE_COLUMN = ['storeCode', 'code', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'item.assistUnit', 'assistUnitAmount', 'expectArrivalDate']
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
		storeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		disabled: Boolean,
		deleteDisabled: Boolean,
		mistakeDisabled: Boolean
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
						return this.isHand && !this.disabled
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
						return this.isHand && !this.disabled && !this.organDetails.purchasePlan
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '订货数量',
					width: '140px',
					required: true,
					editColumn: true,
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
					label: '含税单价',
					width: '120px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'taxMoney',
					label: '含税金额',
					width: '120px',
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
					label: '税率',
					width: '100px',
					editColumn: (row) => {
						return !row.giftFlag && this.organDetails.organ.taxPlayerFlag === 1 && !this.disabled
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'price',
					label: '非税单价',
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
					label: '非税金额',
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
						return row.item && row.item.assistUnit && !this.disabled
					},
					sortable: true,
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{ prop: 'organAmount', label: '当前库存', width: '120px' },
				{ prop: 'otherOrganAmount', label: '卖方参考库存', width: '120px' },
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
				rule: (row, success, error) => {
					const repeat = this.tableDetails.find(item => item.item.id === row.item.id && item.inHouse.id === row.inHouse.id && item.giftFlag === row.giftFlag && item.id !== row.id)
					if (!row.item.id) {
						error('品项编号不能为空')
					} else if (repeat) {
						if (!row.giftFlag) {
							this.$fxMessage.warning('同一仓库下同一品项不得重复添加')
							error()
						} else {
							this.$fxMessage.warning('该品项在该仓库下已有赠品，不能再添加赠品')
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
				rule: (row, success, error) => {
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
					} else if (!this.$fxUtils.compareDate(row.expectArrivalDate, this.organDetails.orderDate)) {
						error('期望到货时间不得小于订货时间')
					} else {
						success()
					}
				}
			}],
			expandRows: [
				{ prop: 'sendRow', label: '品项其他信息', render: this.renderExpand1, visible: true }
			],
			fxCalculation: this.$fxCalculation('common'),
			itemList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('stockOrderGenerateType', 'rules'),
			selectedRows: [],
			tableExpandEditColumnProp: EDIT_INPUT_EXPAND_TYPE,
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			fxCache: this.$fxUtils.fxCache('stock-order'),
			itemUnitList: [],
			unitSelectLoading: false,
			codeSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let column = this.isSingleHouse ? this.tableColumn.slice(2) : this.tableColumn
			const moneyPower = ['taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'taxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		isSingleHouse () {
			return this.organDetails.singleHouse === 1
		},
		assignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(val)[key]
			}
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.otherOrganType)
		},
		isAssign () {
			return this.isCommonTypeByRules('assignCross-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isPlanAssign () {
			return this.isCommonTypeByRules('assignStockPlan-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		tableEditColumnProp () {
			if (this.isAssign || this.isPlanAssign) {
				return ['amount', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount']
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		sysArrivalInterval () {
			return this.getSysParams('CXGL_CGDD_SJQZL_EXPECTTIME', 'value')
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_STOCKSTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authCanAdd () {
			return this.detailsAuthGetter('stock-sale-manage_stock-order.add-stock')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('stock-sale-manage_stock-order.delete-stock')
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
		}
	},
	methods: {
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
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				cellText={row.inHouse.code}
				selectOptionList={this.storeSelectList}
				asyncChange={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		onStoreCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.inHouse = item
				this.getItemList(item.id).then(res => {
					this.itemList = res
					resolve()
				})
			})
		},
		getItemList (storeId, extraItemId = '') {
			const params = {
				houseId: storeId,
				extraItemId,
				buyerOrganId: this.organDetails.organ.id,
				stockPlanId: this.organDetails.purchasePlan,
				sellerOrganId: this.organDetails.otherOrganId,
				orderDate: this.organDetails.orderDate,
				urgent: this.organDetails.urgent
			}
			if (this.isHand && this.isSupplier && !this.organDetails.purchasePlan) {
				params.supplierId = this.organDetails.otherOrganId
			}
			const key = `itemList.${this.organDetails.id}.${storeId}.${extraItemId}.${params.buyerOrganId}.${params.stockPlanId}.${params.sellerOrganId}.${params.orderDate}.${params.urgent}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemList`)({ data: params }))
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
					if (item.stockPlanDetail) {
						row.stockPlanDetail = item.stockPlanDetail
						const arrivalDate = new Date(this.organDetails.orderDate).getTime() + this.$fxUtils.h2ms(item.stockPlanDetail.arrivalCycle)
						row.expectArrivalDate = this.$fxUtils.setDateTime(new Date(arrivalDate), '时分')
					}
					this.getItemPrice(row.item.id, this.itemUnitList[0].id).then(res => {
						row.taxPrice = res.taxPrice || 0
						row.price = res.price || 0
						row.taxRate = res.taxRate || 0
						row.mainUnitId = this.itemUnitList.find(item => {
							return item.mainFlag
						}).id
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
					const storeId = this.isSingleHouse ? this.organDetails.inHouse : row.inHouse.id
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
				disabled={!!this.organDetails.purchasePlan}
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
			const key = `unitList.${itemId}.${this.organDetails.purchasePlan}.${this.organDetails.organ.id}.${itemUnitId}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemUnitList`, this.organDetails.id, itemId)({ data }))
		},
		getItemPrice (itemId, unitId) {
			const params = {
				buyerOrganId: this.organDetails.organ.id,
				sellerOrganId: this.organDetails.otherOrganId,
				bizDate: this.organDetails.orderDate,
				stockPlanId: this.organDetails.purchasePlan,
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
					class="cell-amount__input"
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
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
		onAmountTab (row, $index) {
			if (row.giftFlag || !this.haveMoneyPower) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else if (this.isAssign || this.isPlanAssign) {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
				} else {
					this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
				}
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
			if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else if (this.isAssign || this.isPlanAssign) {
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
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
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.orderDate)
				}
			}
			return <fx-list-cell-date
				ref={`expectArrivalDate-${$index}`}
				vModel={row.expectArrivalDate}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('expectArrivalDate')}
				row={row}
				rowIndex={$index}
				columnProp='expectArrivalDate'
				pickerOptions={pickerOptions}
			>
			</fx-list-cell-date>
		},
		beforeRowEdit (row) {
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (this.isSingleHouse && type === EDIT_INPUT_TYPE[0]) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (!this.isSingleHouse && type === 'storeCode' && !row.id && $index > 0) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (!this.isSingleHouse && type === 'storeCode' && !row.id && $index === 0) {
					if (this.storeSelectList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('code')
					} else {
						this.$refs.detailsTable.setListCellFocus('storeCode')
					}
				} else if (this.isAssign && !this.tableEditColumnProp.includes(`${type}`)) {
					this.$refs.detailsTable.setListCellFocus('amount')
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
				const arrivalDate = new Date(this.organDetails.orderDate).getTime() + this.$fxUtils.h2ms(this.sysArrivalInterval)
				if (this.isSingleHouse) {
					house.id = this.organDetails.inHouse.id
				} else {
					if ($index > 0) {
						house = this.tableDetails[$index - 1].inHouse || {}
					} else if (!this.isSingleHouse && $index === 0) {
						if (this.storeSelectList.length === 1) {
							house = this.storeSelectList[0]
						}
					}
				}
				const data = {
					inHouse: house,
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
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate), '时分'),
					abortAssign: 0,
					memo: ''
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, params.id, params.billId)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi(`${apiName}.addDetails`, params.billId)({ data: params, logger }).then(res => {
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
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.storeSelectList.find(item => item.id === this.organDetails.inHouse).name
			} else {
				storeName = params.inHouse.name
			}
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			const taxPrice = params.taxPrice
			return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},采购数量:${amount},含税单价:${taxPrice}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 1) {
				return this.$fxApi(`${apiName}.delDetailMulity`)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi(`${apiName}.delDetail`, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.storeSelectList.find(item => item.id === this.organDetails.inHouse).name
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
				const taxPrice = item.taxPrice
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},采购数量:${amount},含税单价:${taxPrice}`
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
				const saveApi = [
					`${apiName}.settingMulityTax`,
					`${apiName}.settingMulityExpectArrivalDate`,
					`${apiName}.settingMulityMemo`]
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
						taxRate: setting.tax
					}
					settingInfo = `税率:${setting.tax}`
				} else if (setting.type === 1) {
					params = {
						ids,
						expectArrivalDate: setting.expectArrivalDate
					}
					settingInfo = `期望到货时间:${setting.expectArrivalDate}`
				} else if (setting.type === 2) {
					params = {
						ids,
						memo: setting.memo
					}
					settingInfo = `备注:${setting.memo}`
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(saveApi[setting.type], this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
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
			const giftEdit = this.isHand || this.isAssign
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="预估申请数量：">{row.preApplyAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width = { 200 } editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
						<fx-list-cell-input
							vModel = { row.memo }
							isEdit = { row.isEdit }
							row = { row }
							rowIndex = { $index }
							columnProp = 'memo'
							maxlength = { this.$fxCommon.getFxInputMaxLength('memo') }
							regType = { this.$fxCommon.getFxInputReg('memo') }
						></fx-list-cell-input>
					</fx-list-extend-cell>
					<fx-list-extend-cell title="赠品：" editColumn={ giftEdit } disabled={ this.disabled } vOn:click={this.extendCellClick('', row)}>
						<el-checkbox
							vModel={ row.giftFlag }
							true-label={ 1 }
							false-label={ 0 }
							disabled={this.isPlanAssign || !row.isEdit}
							vOn:change={checked => this.onGiftFlagChange(checked, row)}
						></el-checkbox>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
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
