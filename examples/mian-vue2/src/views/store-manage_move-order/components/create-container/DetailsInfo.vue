<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="单据明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_move-order_details.detailsInfo
			:disabled="disabled"
			:canEdit="canEditDetails"
			:canAdd="!disabled && authCanadd"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="computedEditColumn"
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
			:showDeleteBtn='showDeleteBtn'
			:selectedRows="selectedRows"
			:deleteDisabled="deleteDisabled"
			:fpExpandAsync="fpExpandAsync"
			:fpExpandAllAsync="fpExpandAllAsync"
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
			:inHouseSelectList="storeSelectList"
			:outHouseSelectList="outStoreSelectListComputed"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
const EDIT_INPUT_TYPE = ['outStoreCode', 'storeCode', 'code', 'unit', 'amount', 'assistUnitAmount']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const REQUIRE_CHANGE_COLUMN = ['outStoreCode', 'storeCode', 'code', 'assistUnitAmount', 'amount', 'assistUnitAmount']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulity
	},
	props: {
		currentBasicInStoreId: String,
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
		outStoreSelectList: {
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
		btnAuth: {
			type: Object,
			default: () => {
				return {}
			}
		},
		deleteDisabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'outStoreCode',
					label: '出库仓库编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return this.computedEditColumn.includes('outStoreCode') && this.canEditDetails
					},
					sortable: true,
					sortKey: 'outHouse.code',
					fxRender: this.outStoreCodeRender,
					click: this.onCellClick('outStoreCode')
				},
				{ prop: 'outHouse.name', label: '出库仓库', required: true, sortable: true },
				{
					prop: 'storeCode',
					label: '入库仓库编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return this.computedEditColumn.includes('storeCode') && this.canEditDetails
					},
					sortable: true,
					sortKey: 'inHouse.code',
					fxRender: this.storeCodeRender,
					click: this.onCellClick('storeCode')
				},
				{ prop: 'inHouse.name', label: '入库仓库', required: true, sortable: true },
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return this.computedEditColumn.includes('code') && this.canEditDetails
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
						return this.computedEditColumn.includes('unit') && this.canEditDetails
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '调拨数量',
					width: '140px',
					required: true,
					editColumn: () => {
						return this.computedEditColumn.includes('amount') && this.canEditDetails
					},
					sortable: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit && this.computedEditColumn.includes('assistUnitAmount') && this.canEditDetails
					},
					sortable: true,
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				}
			],
			tableValiDate: [{
				columnProp: 'outStoreCode',
				rule: (row, success, error) => {
					if (this.currentApplyType.type !== 'instore' && row.outHouse && !row.outHouse.id && !this.isSingleOutHouse && this.btnAuth.outHouse) {
						error('出库仓库编号不能为空')
					} else if (this.currentApplyType.type === 'inside' && row.outHouse && row.outHouse.id === row.inHouse.id && !this.isSingleOutHouse && !this.isSingleInHouse) {
						error('出库仓库与入库仓库不能相同')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'storeCode',
				rule: (row, success, error) => {
					if (this.currentApplyType.type !== 'outstore' && row.inHouse && !row.inHouse.id && !this.isSingleInHouse && this.btnAuth.inHouse) {
						error('入库仓库编号不能为空')
					} else if (this.currentApplyType.type === 'inside' && row.inHouse && this.isSingleOutHouse && row.inHouse.id === this.organDetails.otherHouse.id) {
						error('入库仓库与出库仓库不能相同')
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
			}],
			expandRows: [
				{ prop: 'sendRow1', label: '明细备注', render: this.renderExpand1, visible: true, required: true },
				{ prop: 'sendRow2', label: '仓库信息', render: this.renderExpand2, visible: true }
			],
			fxCalculation: this.$fxCalculation('common'),
			itemList: [],
			itemUnitList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			fxCache: this.$fxUtils.fxCache('move-order'),
			codeSelectLoading: false,
			unitSelectLoading: false,
			inhouseSelectLoading: false,
			outhouseSelectLoading: false,
			selectedRows: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let _column = this.tableColumn
			switch (this.currentApplyType.type) {
			case 'instore':
				if ((!this.btnAuth.outHouse || this.isSingleOutHouse) && this.organDetails.billState <= 2) {
					_column = this.deleteOutStoreColumn(_column)
				}
				if (this.isSingleInHouse) {
					_column = this.deleteInStoreColumn(_column)
				}
				break
			case 'outstore' :
				if ((!this.btnAuth.inHouse || this.isSingleInHouse) && this.organDetails.billState <= 2) {
					_column = this.deleteInStoreColumn(_column)
				}
				if (this.isSingleOutHouse) {
					_column = this.deleteOutStoreColumn(_column)
				}
				break
			case 'inside' :
				if (this.isSingleOutHouse) {
					_column = this.deleteOutStoreColumn(_column)
				}
				if (this.isSingleInHouse) {
					_column = this.deleteInStoreColumn(_column)
				}
				break
			default :
				return _column
			}
			return _column
		},
		isSingleInHouse () {
			return this.organDetails.singleInHouseFlag === 1
		},
		isSingleOutHouse () {
			return this.organDetails.singleOutHouseFlag === 1
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		},
		outStoreSelectListComputed () {
			if (this.currentApplyType.type === 'inside') {
				return this.storeSelectList.filter((val) => {
					return val.id !== this.currentBasicInStoreId
				})
			} else {
				return this.outStoreSelectList.filter((val) => {
					return val.id !== this.currentBasicInStoreId
				})
			}
		},
		canEditDetails () {
			if (this.organDetails.balanceFlag === 1) {
				return false
			} else if (this.currentApplyType.type === 'instore') {
				return !this.disabled || (this.btnAuth.outHouse && !this.isSingleOutHouse)
			} else if (this.currentApplyType.type === 'outstore') {
				return !this.disabled || (this.btnAuth.inHouse && !this.isSingleInHouse)
			} else if (this.currentApplyType.type === 'inside') {
				return !this.disabled
			} else if (this.currentApplyType.type === 'production') {
				return !this.disabled
			}
			return true
		},
		computedEditColumn () {
			if (this.disabled) {
				if (this.currentApplyType.type === 'instore') {
					return ['outStoreCode']
				} else if (this.currentApplyType.type === 'outstore') {
					return ['storeCode']
				} else if (this.currentApplyType.type === 'inside') {
					return EDIT_INPUT_TYPE
				}
			} else {
				if (this.currentApplyType.type === 'outstore') {
					return ['outStoreCode', 'code', 'unit', 'amount', 'assistUnitAmount']
				} else if (this.currentApplyType.type === 'instore') {
					return ['storeCode', 'code', 'unit', 'amount', 'assistUnitAmount']
				}
			}
			return EDIT_INPUT_TYPE
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_MOVESTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authCanadd () {
			return this.detailsAuthGetter('store-manage_move-order.add-instore|add-outstore|add-inside')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('store-manage_move-order.delete-move')
		},
		tableExpandEditColumnProp () {
			if (this.canEditDetails) {
				return EDIT_INPUT_EXPAND_TYPE
			} else {
				return []
			}
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
		outStoreCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`outStoreCode-${$index}`}
				value={row.outHouse.id}
				isEdit={row.isEdit && this.computedEditColumn.includes('outStoreCode')}
				row={row}
				rowIndex={$index}
				columnProp='outStoreCode'
				dropdownWidth='300px'
				loading={this.outhouseSelectLoading}
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				cellText={row.outHouse.code}
				fpSelectShow={this.outHouseSelectShow(row)}
				selectOptionList={this.outStoreSelectListComputed}
				asyncChange={this.onOutStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		outHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.outhouseSelectLoading = true
					this.getOutStore(row).then(res => {
						this.outhouseSelectLoading = false
						if (this.currentApplyType.type === 'inside') {
							this.$emit('update:storeSelectList', res)
						} else {
							this.$emit('update:outStoreSelectList', res)
						}
						resolve()
					})
				})
			}
		},
		async getOutStore (row) {
			const ids = [row.outHouse.id]
			const outStore = await this.$fxApi(`${apiName}.getValidStoreList`, this.organDetails.otherOrgan.id)({ data: ids })
			return Promise.resolve(outStore)
		},
		onOutStoreCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.outHouse = item
				if (this.currentApplyType.type === 'outstore') {
					this.getItemList(item.id).then(res => {
						this.itemList = res
						resolve()
					})
				} else {
					resolve()
				}
			})
		},
		storeCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`storeCode-${$index}`}
				value={row.inHouse.id}
				isEdit={row.isEdit && this.computedEditColumn.includes('storeCode')}
				row={row}
				rowIndex={$index}
				columnProp='storeCode'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				loading={this.inhouseSelectLoading}
				selectOptionProp={this.selectOptionProp}
				cellText={row.inHouse.code}
				fpSelectShow={this.inHouseSelectShow(row)}
				selectOptionList={this.storeSelectList}
				asyncChange={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		inHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.inhouseSelectLoading = true
					this.getInStore(row).then(res => {
						this.inhouseSelectLoading = false
						this.$emit('update:storeSelectList', res)
						resolve()
					})
				})
			}
		},
		async getInStore (row) {
			if (this.currentApplyType.type === 'outstore') {
				const data = {
					organId: this.organDetails.organ.id,
					itemIdList: [row.item.id]
				}
				if (row.inHouse.id) {
					data.mustShowHouseIdList = [row.inHouse.id]
				}
				const inStore = await this.$fxApi(`${apiName}.getValidOrganItemInStoreList`)({ data })
				return Promise.resolve(inStore)
			} else {
				const ids = [row.inHouse.id]
				const inStore = await this.$fxApi(`${apiName}.getValidStoreList`, this.organDetails.organ.id)({ data: ids })
				return Promise.resolve(inStore)
			}
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
		getItemList (storeId, itemId) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemByStore`, this.organDetails.id, storeId, itemId))
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}.${this.organDetails.organ.id}.${this.organDetails.otherOrgan.id}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemUnitList`, this.organDetails.id, itemId)({ data }))
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`code-${$index}`}
				value={row.item.id}
				isEdit={row.isEdit && this.computedEditColumn.includes('code')}
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
					const mainUnit = this.itemUnitList.find(item => {
						return !!item.mainFlag
					}) || {}
					row.mainUnitId = mainUnit.id
					this.fxCalculation.changeUnit(row, this.itemUnitList[0])
					this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
					if (this.itemUnitList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('amount')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
					resolve()
				})
			})
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					let storeId = ''
					if (this.currentApplyType.type === 'outstore') {
						storeId = this.isSingleOutHouse ? this.organDetails.otherHouse.id : row.outHouse.id
					} else {
						storeId = this.isSingleInHouse ? this.organDetails.inHouse.id : row.inHouse.id
					}
					if (storeId) {
						this.getItemList(storeId, row.item.id).then(res => {
							this.codeSelectLoading = false
							this.itemList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择仓库')
						this.codeSelectLoading = false
						resolve()
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
				isEdit={row.isEdit && this.computedEditColumn.includes('unit')}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
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
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`amount-${$index}`}
				vModel={row.amount}
				isEdit={row.isEdit && this.computedEditColumn.includes('amount')}
				row={row}
				rowIndex={$index}
				columnProp='amount'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
				pointSize={this.sysPointSize}
				class="cell-amount__input"
				vOn:on-change={this.onAmountChange}
				on-on-input-enter={this.onAmountEnter}
				on-on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
		},
		onAmountEnter (row, $index) {
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
				isEdit={row.isEdit && !!row.item.assistUnit && this.computedEditColumn.includes('assistUnitAmount')}
				row={row}
				rowIndex={$index}
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
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
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (!type) {
					type = 'outStoreCode'
				}
				if (type === 'outStoreCode' && (this.isSingleOutHouse || !this.btnAuth.outHouse)) {
					type = 'storeCode'
				}
				if (type === 'storeCode' && (this.isSingleInHouse || !this.btnAuth.inHouse)) {
					type = 'code'
				}
				if ((!this.isSingleInHouse && type === 'storeCode' && !row.id && $index > 0) || (!this.isSingleInHouse && type === 'storeCode' && !row.id && row.inHouse.code)) {
					type = 'code'
				}
				if ((!this.isSingleOutHouse && type === 'outStoreCode' && !row.id && $index > 0) || (!this.isSingleOutHouse && type === 'outStoreCode' && !row.id && row.outHouse.code)) {
					type = 'code'
				}
				this.$refs[`${type}-${$index}`].focus()
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
				let flag = ''
				let storeId = ''
				if (this.currentApplyType.type === 'outstore') {
					flag = !this.isSingleOutHouse
					storeId = this.organDetails.otherHouse.id
				} else {
					flag = !this.isSingleInHouse
					storeId = this.organDetails.inHouse.id
				}
				if (flag) {
					this.itemList = []
					resolve(this.initDetailsRow($index))
				} else {
					this.getItemList(storeId).then(res => {
						this.itemList = res
						resolve(this.initDetailsRow($index))
					})
				}
			})
		},
		initDetailsRow ($index) {
			let inHouse = {}
			if (this.isSingleInHouse) {
				inHouse = this.storeSelectList.find(item => {
					return item.id === this.organDetails.inHouse.id
				})
			} else if (!this.isSingleInHouse && $index > 0) {
				inHouse = this.tableDetails[$index - 1].inHouse || {}
			} else if (!this.isSingleInHouse && $index === 0) {
				if (this.storeSelectList.length === 1) {
					inHouse = this.storeSelectList[0]
				}
			}
			let outHouse = {}
			if (this.isSingleOutHouse) {
				outHouse = this.outStoreSelectListComputed.find(item => {
					return item.id === this.organDetails.otherHouse.id
				})
			} else if (!this.isSingleOutHouse && $index > 0) {
				outHouse = this.tableDetails[$index - 1].outHouse || {}
			} else if (!this.isSingleOutHouse && $index === 0) {
				if (this.outStoreSelectListComputed.length === 1) {
					outHouse = this.outStoreSelectListComputed[0]
				}
			}
			return {
				inHouse,
				outHouse,
				item: {},
				itemUnit: {},
				mainUnitId: '',
				amount: 0,
				assistUnitAmount: '',
				abortAssign: 0,
				memo: ''
			}
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id, params.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('store-manage.move-order.addDetails', { orderData: this.organDetails, addItemInfo })
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
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const amount = params.amount
			const assistUnitAmount = params.assistUnitAmount || ''
			return `品项名称:${name},单位:${itemUnit},调拨数量:${amount},辅助数量:${assistUnitAmount}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 1) {
				return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi(`${apiName}.delDetail`, this.organDetails.id, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const assistUnitAmount = item.assistUnitAmount || ''
				return `品项名称:${name},单位:${itemUnit},调拨数量:${amount},辅助数量:${assistUnitAmount}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			this.$refs.addMulity.open(this.organDetails.inHouse.id, this.organDetails.otherHouse.id)
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
				const params = {
					ids,
					batchSetType: setting.type,
					memo: setting.memo
				}
				settingInfo = `备注:${setting.memo}`
				const logger = this.$fxLogger.createInfo('store-manage.move-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
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
					<fx-list-extend-cell title="明细备注：" width = { 200 } editColumn disabled={ !this.canEditDetails } vOn:click={this.extendCellClick('memo', row)}>
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
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="出库仓库存放位置：" labelWidth="120"></fx-list-extend-cell>
					<fx-list-extend-cell title="出库仓库当前库存：" labelWidth="120">{row.outStoreStock}</fx-list-extend-cell>
					<fx-list-extend-cell title="入库仓库存放位置：" labelWidth="120"></fx-list-extend-cell>
					<fx-list-extend-cell title="入库仓库当前库存：" labelWidth="120">{row.inStoreStock}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		deleteInStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'storeCode'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
		},
		deleteOutStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'outStoreCode'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
		},
		extendCellClick (type, row) {
			return () => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpExpandAsync (row) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const otherOrganId = this.organDetails.otherOrgan.id
				const params = [row.id]
				if ((row.inStoreStock || row.inStoreStock === 0) && (row.outStoreStock || row.outStoreStock === 0)) return Promise.resolve()
				return this.$fxApi(`${apiName}.stockAmount`, billId, organId, otherOrganId)({ data: params }).then(res => {
					row.inStoreStock = (res[row.id] || {}).InStore || 0
					row.outStoreStock = (res[row.id] || {}).OutStore || 0
					return Promise.resolve()
				})
			})
		},
		fpExpandAllAsync (tableData) {
			return this.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const otherOrganId = this.organDetails.otherOrgan.id
				const params = tableData.map(item => item.id)
				return this.$fxApi(`${apiName}.stockAmount`, billId, organId, otherOrganId)({ data: params }).then(res => {
					tableData.forEach(item => {
						item.inStoreStock = (res[item.id] || {}).InStore || 0
						item.outStoreStock = (res[item.id] || {}).OutStore || 0
					})
					return Promise.resolve()
				})
			})
		},
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		},
		getEditingRowData () {
			return this.$refs.detailsTable.getEditingRowData()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
