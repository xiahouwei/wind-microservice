<template>
<div class="setting-detail-container">
	<fx-details-table
		ref="detailsTable"
		:tableColumn="tableColumn"
		:tableData="tableData"
		:tableEditColumnProp="tableEditColumnProp"
		:fpOnRowEdit="fpOnRowEdit"
		:canAdd="false"
		:showTools="false"
		:selectable="false"
		:showIndex="false"
		minHeight="60px"
		class="item-setting-table"
	>
	</fx-details-table>
	<w-link
		type="primary"
		icon="table-details-setting"
		class="setting-link"
		@click="onSaveClick"
	>
		将以上价格方案明细添加至选中的价格方案
	</w-link>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'pricePlanSettingDetail',
	props: {
		itemDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'item.code', label: '品项编号', width: '100px' },
				{ prop: 'item.name', label: '品项名称', width: '100px' },
				{ prop: 'item.spec', label: '规格', width: '100px' },
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
						return row.strategy === 1
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
						return row.strategy === 1
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
			tableEditColumnProp: ['code', 'unit', 'strategy', 'strategy-input', 'taxPrice', 'price', 'taxRate', 'memo'],
			strategyList: this.$fxTypeMiddleware.getCommonTypeList('strategyType'),
			tableData: [{
				item: {},
				itemUnit: {},
				mainUnitId: '',
				strategy: 1,
				price: 0,
				taxRate: 0,
				taxPrice: 0,
				enableFlag: 1,
				memo: '',
				sortNum: 0
			}],
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			itemUnitList: []
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
		initData () {
			this.getItemUnitList().then(() => {
				this.tableData = [{
					item: this.itemDetails,
					itemUnit: this.itemUnitList[0],
					mainUnitId: this.itemUnitList[0].id,
					strategy: 1,
					price: 0,
					taxRate: 0,
					taxPrice: 0,
					enableFlag: 1,
					memo: '',
					sortNum: 0
				}]
			})
		},
		getItemUnitList () {
			return this.$fxApi('item.getItemUnitList', this.itemDetails.id, 'PricePlan').then(res => {
				this.itemUnitList = res
				return Promise.resolve()
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
				selectOptionList={this.itemUnitList}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
			row.mainUnitId = item.id
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
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpOnRowEdit (row, index, type = 'unit') {
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
		onSaveClick () {
			this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
				this.$emit('on-save-detail', this.tableData[0])
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.item-setting-table {
	height 90px
	.strategy-cell{
		display: flex
	}
}
.setting-link {
	display inline-block
	margin-top 5px
	margin-bottom 15px
}
</style>
