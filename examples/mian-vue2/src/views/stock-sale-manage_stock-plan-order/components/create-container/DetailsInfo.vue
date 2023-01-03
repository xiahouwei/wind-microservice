<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="采购明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.stock-sale-manage_stock-plan-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
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
			:canAdd="authCanAdd"
			showSummary
			showMistakeCheck
			:defaultSortParam="defaultSortParam"
			:showDeleteBtn="showDeleteBtn"
			:deleteDisabled="deleteDisabled"
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
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['storeCode', 'code', 'unit', 'amount', 'assistUnitAmount', 'expectArrivalDate']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const REQUIRE_CHANGE_COLUMN = ['storeCode', 'code', 'item.assistUnit', 'assistUnitAmount', 'expectArrivalDate']
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
		deleteDisabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'storeCode',
					label: '仓库编号',
					width: '170px',
					required: true,
					editColumn: true,
					sortable: true,
					sortKey: 'inHouse.code',
					fxRender: this.storeCodeRender,
					click: this.onCellClick('storeCode')
				},
				{ prop: 'inHouse.name', label: '仓库名称', required: true, sortable: true, width: '170px' },
				{
					prop: 'code',
					label: '品项编号',
					width: '170px',
					required: true,
					editColumn: true,
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true, width: '170px' },
				{ prop: 'item.spec', label: '规格', width: '170px' },
				{
					prop: 'unit',
					label: '单位',
					width: '170px',
					required: true,
					editColumn: () => {
						return (this.sysStockPlanEditUnit || !this.organDetails.stockPlan.id) && !this.disabled
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '申请数量',
					width: '170px',
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
				{ prop: 'item.assistUnit', label: '辅助单位', width: '170px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '170px',
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
				{ prop: 'stock', label: '当前库存', width: '120px' },
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '228px',
					editColumn: true,
					fxRender: this.expectArrivalDateRender,
					click: this.onCellClick('expectArrivalDate')
				},
				{
					prop: 'inquiryFlag',
					label: '参与询定价',
					formatter: (row) => {
						return row.inquiryFlag === 1 ? '√' : 'x'
					}
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
					const repeat = this.tableDetails.find(item => item.item.id === row.item.id && item.inHouse.id === row.inHouse.id && item.id !== row.id)
					if (!row.item.id) {
						error('品项编号不能为空')
					} else {
						if (repeat) {
							error()
							this.$fxMessage.warning('同一仓库下同一品项不得重复添加')
						} else {
							success()
						}
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
						error('期望到货时间不得小于申请时间')
					} else {
						success()
					}
				}
			}],
			expandRows: [
				{ prop: 'sendRow', label: '分派状态', render: this.renderExpand1, visible: true }
			],
			fxCalculation: this.$fxCalculation('stockPlanOrder'),
			itemList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			selectedRows: [],
			tableExpandEditColumnProp: EDIT_INPUT_EXPAND_TYPE,
			fxCache: this.$fxUtils.fxCache('stock-plan'),
			itemUnitList: [],
			unitSelectLoading: false,
			codeSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let tableColumn = this.isSingleHouse ? this.tableColumn.slice(2) : this.tableColumn
			if (!this.sysStockPlanCheckedPrice) {
				tableColumn = tableColumn.filter(item => {
					return item.prop !== 'inquiryFlag'
				})
			}
			return tableColumn
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		assignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(val)[key]
			}
		},
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		sysArrivalInterval () {
			return this.getSysParams('CXGL_CGJHD_SJQZL_EXPECTTIME', 'value')
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_STOCKPLAN_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		sysStockPlanEditUnit () {
			return this.getSysParams('SJXZL_STOCK_SALES_CHANGE_PLAN_UNIT', 'value')
		},
		sysStockPlanCheckedPrice () {
			return this.getSysParams('SJXZL_STOCKPLAN_CHECKED_PRICE', 'value')
		},
		authCanAdd () {
			return this.detailsAuthGetter('stock-sale-manage_stock-plan-order.add-stock-plan')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('stock-sale-manage_stock-plan-order.delete-stock-plan')
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
				inHouseId: storeId,
				buyerOrganId: this.organDetails.organ.id,
				stockPlanId: this.organDetails.stockPlan.id,
				businessDate: this.organDetails.businessDate,
				urgent: this.organDetails.urgent,
				extraItemId
			}
			const key = `itemList.${this.organDetails.id}.${storeId}.${extraItemId}.${params.buyOrganId}.${params.stockPlanId}.${params.businessDate}.${params.urgent}`
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
				row.mainUnitId = ''
				return this.getUnitList(item.id).then(res => {
					this.itemUnitList = res
					row.itemUnit = res[0]
					return Promise.resolve()
				}).then(() => {
					if (item.stockPlanDetail) {
						row.stockPlanDetail = item.stockPlanDetail
						const arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(item.stockPlanDetail.arrivalCycle)
						row.expectArrivalDate = this.$fxUtils.setDateTime(new Date(arrivalDate))
						row.mainUnitId = item.stockPlanDetail.unitId
						row.itemUnit = this.itemUnitList[0]
					} else {
						const mainUnit = this.itemUnitList.find(item => {
							return !!item.mainFlag
						}) || {}
						row.mainUnitId = mainUnit.id
					}
					this.fxCalculation.changeUnit(row, this.itemUnitList[0])
					if (this.itemUnitList.length === 1 || item.stockPlanDetail) {
						this.$refs.detailsTable.setListCellFocus('amount')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
					resolve()
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
					const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
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
				disabled={!this.sysStockPlanEditUnit && !!this.organDetails.stockPlan.id}
				vOn:on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (this.organDetails.stockPlan && this.organDetails.stockPlan.id) {
				this.fxCalculation.changeUnitCompSupperLimitOrLowerLimit(row, item)
			}
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
					vOn:on-change={this.onAmountChange}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					vOn:focus={this.onAmountFocus}
					vOn:blur={this.onAmountBlur}
					vOn:on-input-enter={this.onAmountEnter}
					vOn:on-input-tab={this.onAmountEnter}
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
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit && this.tableEditColumnProp.includes('assistUnitAmount')}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)}
				columnProp='assistUnitAmount'
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
				rowIndex={$index}
				valueFormat='yyyy-MM-dd HH:mm:SS'
				columnProp='expectArrivalDate'
				cellText={this.$fxUtils.formatterDateTime(row.expectArrivalDate)}
				pickerOptions={pickerOptions}
			>
			</fx-list-cell-date>
		},
		beforeRowEdit (row) {
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type = 'storeCode') {
			return new Promise(resolve => {
				if (type === 'storeCode' && this.isSingleHouse) {
					this.$refs.detailsTable.setListCellFocus('code')
				} else if (type === 'storeCode' && !row.id) {
					if (this.storeSelectList.length === 1 || row.inHouse.id) {
						type = 'code'
					}
				}
				this.$refs.detailsTable.setListCellFocus(type)
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
				const arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(this.sysArrivalInterval)
				if (this.isSingleHouse) {
					house.id = this.organDetails.inHouse.id
				} else {
					if ($index > 0) {
						house = this.tableDetails[$index - 1].inHouse || {}
					} else {
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
					assistUnitAmount: '',
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate)),
					abortAssign: 0,
					memo: '',
					assignState: 0,
					assignAmount: 0
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, params.billId)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.addDetails', { orderData: this.organDetails, addItemInfo })
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
				storeName = this.storeSelectList.find(item => item.id === this.organDetails.inHouse.id).name
			} else {
				storeName = params.inHouse.name
			}
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},申请数量:${amount}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			let storeName = ''
			if (this.isSingleHouse) {
				storeName = this.storeSelectList.find(item => item.id === this.organDetails.inHouse.id).name
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
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},申请数量:${amount}`
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
				if (setting.type === 1) {
					params = {
						ids,
						filedType: 'expectArrivalDate',
						filedValue: setting.expectArrivalDate
					}
					settingInfo = `期望到货时间:${setting.expectArrivalDate}`
				} else if (setting.type === 2) {
					params = {
						ids,
						filedType: 'memo',
						filedValue: setting.memo
					}
					settingInfo = `备注:${setting.memo}`
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
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
					<fx-list-extend-cell title="分派状态：" width = { 80 }>{this.assignState(row.assignState, 'label')}</fx-list-extend-cell>
					<fx-list-extend-cell title="已分派数量：" width = { 80 }>{row.assignAmount}</fx-list-extend-cell>
					<fx-list-extend-cell title="已放弃数量：" width = { 80 }>{row.giveUpAmount}</fx-list-extend-cell>
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
							class = 'cell-input'
						></fx-list-cell-input>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
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
.cell-input {
	>>>.form-item-input {
		width 100%
	}
}
</style>
