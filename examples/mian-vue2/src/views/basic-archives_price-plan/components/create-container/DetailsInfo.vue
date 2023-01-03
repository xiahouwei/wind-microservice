<template>
	<w-collapse v-model="collapseVisible" contentHeight="400px" :fullScreen="isFullScreen" disabled :showArrow="false" title="方案明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.basic-archives_price-plan_details.detailsInfo
			:disabled="disabled"
			:deleteDisabled="delDisabled"
			:canAdd="canAdd"
			:tableColumn="tableColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:fpOnRowEdit="fpOnRowEdit"
			showMistakeCheck
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click="onMistakeCheckClick"
		>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
		</fx-details-table>
		<addMulityStep1
			ref="addMulityStep1"
			@on-next-step-click="onNextStepClick"
		></addMulityStep1>
		<addMulityStep2
			ref="addMulityStep2"
			:organDetails="organDetails"
			:fpPreStep="fpPreStep"
			@on-details-refresh="onDetailsRefresh"
		></addMulityStep2>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulityStep1 from '../add-mulity-details/AddMulityStep1.vue'
import addMulityStep2 from '../add-mulity-details/AddMulityStep2.vue'
const EDIT_INPUT_TYPE = ['code', 'unit', 'strategy', 'strategy-input', 'taxPrice', 'price', 'taxRate', 'memo']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulityStep1,
		addMulityStep2
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
		itemList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		disabled: Boolean,
		delDisabled: Boolean,
		canAdd: Boolean
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
					fixed: false,
					editColumn: true,
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', width: '100px', fixed: false },
				{ prop: 'item.spec', label: '规格', width: '100px', fixed: false },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'strategy',
					label: '价格策略',
					width: '250px',
					required: true,
					editColumn: true,
					fxRender: this.strategyRender,
					click: this.onCellClick('strategy')
				},
				{
					prop: 'taxPrice',
					label: '含税单价（元）',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return row.strategy === 1 && !this.disabled
					},
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'price',
					label: '非税单价（元）',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return row.strategy === 1 && !this.disabled
					},
					fxRender: this.priceRender,
					click: this.onCellClick('price')
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'enableFlag',
					label: '启停用',
					width: '100px',
					required: true,
					editColumn: true,
					fxRender: this.enableFlagRender,
					click: this.onCellClick('enableFlag')
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '300px',
					required: true,
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'code',
				rule: (row, success, error) => {
					const repeat = this.tableDetails.find(item => item.item.id === row.item.id && item.id !== row.id)
					if (!row.item.id) {
						error('品项编号不能为空')
					} else if (repeat) {
						this.$fxMessage.warning('同一品项不得重复添加')
						error()
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
			strategyList: this.$fxTypeMiddleware.getCommonTypeList('strategyType'),
			editRowItemList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			addMulitySelectItemList: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			taxesList: state => state.system.taxesList
		})
	},
	methods: {
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
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				cellText={row.item.code}
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				selectOptionList={this.editRowItemList}
				filterKeys={this.filterKeys}
				asyncChange={this.onCodeSelectChange}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				row.itemUnitList = item.itemUnitList
				row.itemUnit = item.itemUnitList[0] || {}
				row.mainUnitId = row.itemUnit.id
				resolve()
			})
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (item.itemUnitList.length === 1) {
					this.$refs.detailsTable.setListCellFocus('strategy')
				} else {
					resolve()
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (item.itemUnitList.length === 1) {
				this.$refs.detailsTable.setListCellFocus('strategy')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
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
				selectOptionList={row.itemUnitList}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
		},
		strategyRender (h, { row, $index }) {
			h = this.$createElement
			return (
				<div class="strategy-cell">
					<el-tooltip enterable={false} disabled={row.isEdit} effect="dark" content={this.tipInfo(row)} placement="top">
						<fx-list-cell-select
							ref={`strategy-${$index}`}
							vModel={row.strategy}
							isEdit={row.isEdit}
							row={row}
							rowIndex={$index}
							columnProp='strategy'
							cellText={this.strategySelectText(row)}
							selectOptionList={this.strategyList}
							selectOptionProp={this.optionProp}
							vOn:on-change={this.onStrategySelectChange}
							vOn:on-select-enter={this.onStrategySelectEnter}
							asyncClick={this.onStrategySelectClick}
							vOn:on-select-tab={this.onStrategySelectEnter}
						>
						</fx-list-cell-select>
					</el-tooltip>
					<fx-list-cell-input-number
						v-show={this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price'])(row.strategy)}
						ref={`strategy-input-${$index}`}
						vModel={row.price}
						isEdit={row.isEdit}
						row={row}
						rowIndex={$index}
						columnProp='strategy-input'
						placeholder={this.pricePlaceholder(row)}
						cellText={this.priceText(row)}
						pointSize={this.sysMoneyPointSize}
						vOn:on-change={this.onPriceChange}
						vOn:on-input-enter={this.onStrategyInputEnter}
						vOn:on-input-tab={this.onStrategyInputEnter}
					>
						<span slot="suffix">{this.priceSuffixSlot(row)}</span>
					</fx-list-cell-input-number>
				</div>
			)
		},
		tipInfo (row) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
				return '按固定价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['cost'])(row.strategy)) {
				return '按成本价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion'])(row.strategy)) {
				return `按成本加价${row.price}%`
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['price'])(row.strategy)) {
				return `按成本加价${row.price}元`
			} else {
				return ''
			}
		},
		strategySelectText (row) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
				return '固定价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['cost'])(row.strategy)) {
				return '成本价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion'])(row.strategy)) {
				return `成本 + ${row.price}%`
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['price'])(row.strategy)) {
				return `成本 + ${row.price}`
			} else {
				return ''
			}
		},
		onStrategySelectChange (item, row) {
			row.price = 0
			row.taxPrice = 0
		},
		onStrategySelectEnter (row, index) {
			this.$nextTick(() => {
				if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
					this.$refs.detailsTable.setListCellFocus('taxPrice')
				} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['cost'])(row.strategy)) {
					this.$refs.detailsTable.setListCellFocus('taxRate')
				} else {
					this.$refs.detailsTable.setListCellFocus('strategy-input')
				}
			})
		},
		onStrategySelectClick (item, row, $index) {
			return new Promise(resolve => {
				this.onStrategySelectEnter(row)
			})
		},
		onStrategyInputEnter (row, index) {
			this.$refs.detailsTable.setListCellFocus('taxRate')
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				v-show={this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)}
				ref={`price-${$index}`}
				vModel={row.price}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='price'
				placeholder={this.pricePlaceholder(row)}
				cellText={this.priceText(row)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onPriceChange}
			>
				<span slot="suffix">{this.priceSuffixSlot(row)}</span>
			</fx-list-cell-input-number>
		},
		priceSuffixSlot (row) {
			return this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion'])(row.strategy) ? '%' : ''
		},
		pricePlaceholder (row) {
			return this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion'])(row.strategy) ? '请输入比例' : '请输入'
		},
		priceText (row) {
			return (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price', 'cost'])(row.strategy)) ? '' : this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
		},
		onPriceChange (val, row) {
			row.taxPrice = this.$fxUtils.toFixed(row.price * (1 + row.taxRate), this.sysPricePointSize, false)
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				on-on-change={this.onTaxSelectChange}
				on-on-select-enter={this.onTaxSelectEnter}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
				row.price = this.$fxUtils.toFixed(row.taxPrice / (1 + row.taxRate), this.sysPricePointSize, false)
			}
		},
		onTaxSelectEnter (row, index) {
			this.$refs.detailsTable.setListCellFocus('memo')
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				v-show={this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)}
				ref={`taxPrice-${$index}`}
				vModel={row.taxPrice}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxPrice'
				disabled={this.taxPriceDisable(row)}
				cellText={this.taxPriceText(row)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onTaxPriceChange}
			>
			</fx-list-cell-input-number>
		},
		taxPriceText (row) {
			return (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price', 'cost'])(row.strategy)) ? '' : this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)
		},
		taxPriceDisable (row) {
			return this.$fxTypeMiddleware.isCommonType('strategyType')(['cost', 'proportion', 'price'])(row.strategy)
		},
		onTaxPriceChange (val, row) {
			row.price = this.$fxUtils.toFixed(row.taxPrice / (1 + row.taxRate), this.sysPricePointSize, false)
		},
		enableFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`enableFlag-${$index}`}
				vModel={row.enableFlag}
				activeText='已启用'
				inactiveText='未启用'
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='enableFlag'
			></fx-list-cell-switch>
		},
		memoRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`memo-${$index}`}
				vModel={row.memo}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='memo'
				class='cell-input-memo'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getEditItemList(row.item.id).then(res => {
					this.editRowItemList = res
					const itemUnitList = (res.find(item => {
						return item.id === row.item.id
					}) || {}).itemUnitList
					row.itemUnitList = itemUnitList
					resolve()
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpOnRowEdit (row, index, type = 'code') {
			return new Promise(resolve => {
				switch (type) {
				case 'strategy-input':
					if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price'])(row.strategy)) {
						this.$refs.detailsTable.setListCellFocus('strategy-input')
					} else {
						this.$refs.detailsTable.setListCellFocus('strategy')
					}
					break
				case 'price':
					if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
						this.$refs.detailsTable.setListCellFocus('price')
					} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price'])(row.strategy)) {
						this.$refs.detailsTable.setListCellFocus('strategy-input')
					} else {
						this.$refs.detailsTable.setListCellFocus('strategy')
					}
					break
				case 'taxPrice':
					if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
						this.$refs.detailsTable.setListCellFocus('taxPrice')
					} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price'])(row.strategy)) {
						this.$refs.detailsTable.setListCellFocus('strategy-input')
					} else {
						this.$refs.detailsTable.setListCellFocus('strategy')
					}
					break
				default:
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		fpInitAddDetailsData () {
			return new Promise(resolve => {
				this.editRowItemList = this.itemList
				resolve({
					item: {},
					itemUnit: {},
					mainUnitId: '',
					strategy: 1,
					price: 0,
					taxRate: 0,
					taxPrice: 0,
					enableFlag: 1,
					itemUnitList: [],
					memo: ''
				})
			})
		},
		fpSaveDetails (detail, origin) {
			detail.planId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.updateDetails', { name: this.organDetails.name, cur: params, pre: origin, itemName: params.item.name })
				return this.$fxApi('planPrice.saveDetails', this.organDetails.id, params.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.addDetails', { name: this.organDetails.name, details: params })
				return this.$fxApi('planPrice.addDetails', this.organDetails.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		fpDeleteDetails (ids) {
			const select = this.tableDetails.filter(item => {
				return ids.includes(item.id)
			})
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.deleteDetails', { name: this.organDetails.name, select })
			if (ids.length > 0) {
				return this.$fxApi('planPrice.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else if (ids.length === 0) {
				return this.$fxApi('planPrice.delDetail', this.organDetails.id, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			const addedItemMap = this.$fxUtils.compareArrayUtils(this.tableDetails, { key: 'item.id' })
			this.addMulitySelectItemList = this.itemList.filter(item => {
				return !addedItemMap.has(item.id)
			})
			this.$refs.addMulityStep1.open([], this.addMulitySelectItemList)
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const saveApi = ['planPrice.settingMulityStrategy', 'planPrice.settingMulityTax', 'planPrice.settingMulityMemo']
				const ids = res.map(item => {
					return item.id
				})
				let params = null
				if (setting.type === 0) {
					const price = setting.priceFlag ? setting.price : 0
					const taxPrice = setting.taxPriceFlag ? setting.taxPrice : 0
					params = {
						planId: this.organDetails.id,
						ids,
						strategy: setting.strategyRadio,
						price,
						taxRate: setting.strategyTax,
						taxPrice,
						taxRateFlag: setting.taxRateFlag,
						priceFlag: setting.priceFlag,
						taxPriceFlag: setting.taxPriceFlag
					}
				} else if (setting.type === 1) {
					params = {
						planId: this.organDetails.id,
						ids,
						taxRate: setting.tax
					}
				} else if (setting.type === 2) {
					params = {
						planId: this.organDetails.id,
						ids,
						memo: setting.memo
					}
				}
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.settingMulityDetails', { name: this.organDetails.name, select: res, type: setting.type, params })
				this.$fxApi(saveApi[setting.type], this.organDetails.id)({ data: params, logger }).then(() => {
					this.onDetailsRefresh()
				})
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onNextStepClick (items) {
			this.$refs.addMulityStep2.open(items)
		},
		fpPreStep (list) {
			const ids = list.map(item => {
				return item.item.id
			})
			return this.$refs.addMulityStep1.open(ids, this.addMulitySelectItemList)
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		getEditItemList (itemId) {
			return this.$fxApi('planPrice.getItemList')({ data: [itemId] })
		},
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		defaultFocus () {
			if (this.tableDetails.length) {
				this.$refs.detailsTable.onTabSetRowEdit()
			} else if (this.canAdd) {
				this.$refs.detailsTable.onAddOnce()
			}
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.strategy-cell {
	display: flex
}
.cell-input-memo {
	>>>.form-item-input {
		width 100%
	}
}
</style>
