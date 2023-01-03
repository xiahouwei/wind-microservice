<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="新增品项" heightFullscreen :beforeClose="onBeforeClose">
		<template slot="sub">第二步</template>
		<div class="create-organ">
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:tableColumn="tableColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpDeleteDetails="fpDeleteDetails"
				:fpOnRowEdit="fpOnRowEdit"
				:canAdd="false"
				:virtual="true"
				:selectedRows="selectedRows"
			>
				<settingMulity
					slot="setting-mulity"
					slot-scope="{ visible }"
					:visible="visible"
					@on-save-click="onSettingMulitySave"
					@on-cancel-click="onSettingMulityClose"
				></settingMulity>
			</fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="preStepBtn"
				v-fx-tab:focus.detailsTable
				@click="onPreStepClick"
			>上一步</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-tab:focus.preStepBtn
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import settingMulity from '../create-container/SettingMulity.vue'
const EDIT_INPUT_TYPE = ['unit', 'strategy', 'price', 'taxRate', 'taxPrice', 'memo']
export default {
	name: 'addMulityStep1',
	components: {
		settingMulity
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		fpPreStep: Function
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'item.code', label: '品项编号', width: '100px', fixed: true },
				{ prop: 'item.name', label: '品项名称', width: '100px', fixed: true },
				{ prop: 'item.spec', label: '规格', width: '100px', fixed: true },
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
					prop: 'enableFlag',
					label: '启停用',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.enableFlagRender,
					click: this.onCellClick('enableFlag')
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px',
					required: true,
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
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
			tableData: [],
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			selectedRows: []
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
		open (items) {
			const tableData = items.map((_item, index) => {
				const itemUnit = _item.itemUnitList[0] || {}
				const mainUnitId = itemUnit.id
				return {
					planId: this.organDetails.id,
					id: this.$fxUtils.createUUID(),
					item: _item,
					itemUnitList: _item.itemUnitList,
					itemUnit,
					mainUnitId,
					strategy: 1,
					price: 0,
					taxRate: 0,
					taxPrice: 0,
					enableFlag: 1,
					memo: ''
				}
			})
			this.tableData = tableData
			this.selectedRows = Array.prototype.slice.call(tableData)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
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
				selectOptionList={row.itemUnitList}
				vOn:on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
		},
		strategyRender (h, { row, $index }) {
			h = this.$createElement
			return (
				<div class="strategy-cell">
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
						vOn:on-select-tab={this.onStrategySelectEnter}
						asyncClick={this.onStrategySelectClick}
					>
					</fx-list-cell-select>
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
					this.$refs.detailsTable.setListCellFocus('price')
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
				vOn:on-change={this.onPriceChange}
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
			return (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price'])(row.strategy)) ? '' : row.price
		},
		onPriceChange (val, row) {
			row.taxPrice = this.$fxUtils.toFixed(row.price * (1 + row.taxRate), 4, false)
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
				vOn:on-change={this.onTaxSelectChange}
				vOn:on-select-enter={this.onTaxSelectEnter}
				vOn:on-select-tab={this.onTaxSelectEnter}
				asyncClick={this.onTaxSelectClick}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
				row.price = this.$fxUtils.toFixed(row.taxPrice / (1 + row.taxRate), this.sysPricePointSize, false)
			}
		},
		onTaxSelectEnter (row, index) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['cost', 'proportion', 'price'])(row.strategy)) {
				this.$refs.detailsTable.setListCellFocus('memo')
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
			}
		},
		onTaxSelectClick (item, row) {
			return new Promise(() => {
				this.onTaxSelectEnter(row)
			})
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
			return (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion', 'price', 'cost'])(row.strategy)) ? '' : row.taxPrice
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
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpDeleteDetails (ids) {
			this.tableData = this.tableData.filter(item => {
				return !ids.includes(item.id)
			})
			return Promise.resolve()
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				let params = null
				if (setting.type === 0) {
					if (setting.strategyRadio === 1) {
						params = {
							strategy: setting.strategyRadio
						}
						if (setting.priceFlag) {
							params.price = setting.price
						} else if (setting.taxPriceFlag) {
							params.taxPrice = setting.taxPrice
						}
					} else if (setting.strategyRadio === 2) {
						params = {
							strategy: setting.strategyRadio,
							price: setting.price,
							taxPrice: setting.taxPrice
						}
					} else {
						params = {
							strategy: setting.strategyRadio
						}
						if (setting.priceFlag) {
							params.price = setting.price
							params.taxPrice = setting.taxPrice
						}
					}
					if (setting.taxRateFlag) {
						params.taxRate = setting.strategyTax
					}
				} else if (setting.type === 1) {
					params = {
						taxRate: setting.tax
					}
				} else if (setting.type === 2) {
					params = {
						memo: setting.memo
					}
				}
				res.forEach(item => {
					Object.assign(item, params)
					if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(item.strategy)) {
						if (setting.priceFlag) {
							item.taxPrice = this.$fxUtils.toFixed(item.price * (1 + item.taxRate), this.sysPricePointSize, false)
						} else {
							item.price = this.$fxUtils.toFixed(item.taxPrice / (1 + item.taxRate), this.sysPricePointSize, false)
						}
					}
				})
				this.$fxMessage.success('批量设置成功')
			})
		},
		onPreStepClick () {
			this.fpPreStep(this.tableData).then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.addMulityDetails', { selectRows: this.tableData, name: this.organDetails.name })
			return this.$fxApi('planPrice.addDetailsMulity', this.organDetails.id)({ data: this.tableData, logger }).then(res => {
				this.dialogVisible = false
				this.$emit('on-details-refresh', this.tableData)
				return Promise.resolve()
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
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
		onBeforeClose (close) {
			this.$fxConfirm('当前页面存在未保存数据，是否确定取消并退出操作？').then(() => {
				close()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
	.strategy-cell {
		display: flex
	}
}
</style>
