<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
      <fx-mistake-check-step :activeStep="2" type="PickList"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在仓库与品项关联关系不匹配，请修改仓库或品项信息！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:fpBeforeRowEdit="beforeRowEdit"
				:tableEditColumnProp="tableEditColumnProp"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:mainId="organDetails.id"
				:fpSaveDetails="fpSaveDetails"
				:fpOnRowEdit="fpOnRowEdit"
				:canAdd="false"
				:showDeleteBtn="false"
				:showColumnFilterBtn="false"
				@on-details-refresh="onDetailsRefresh"
			></fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.detailsTable
				@click="onSaveReturnClick"
			>保存并返回</el-button>
			<fx-button
				ref="saveBtn"
				:type="actionType"
				v-fx-tab:focus.saveReturnBtn
				@click="onSaveClick"
			>{{actionText}}</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

const EDIT_ISHAND_TYPE = ['inHouse', 'outHouse', 'code', 'unit']
const EDIT_NOHAND_TYPE = ['outHouse', 'actualTotal']

export default {
	name: 'mistakeCheckStep2',
	components: {
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		storeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		actionText: String,
		actionType: String,
		systemParamAmountNegative: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			dialogVisible: false,
			tableColumn: [
				{
					prop: 'inHouse',
					label: '入库仓库',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.disabled && this.isHand
					},
					fxRender: this.inHouseRender,
					click: this.onCellClick('inHouse')
				},
				{
					prop: 'outHouse',
					label: '出库仓库',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.outHouseRender,
					click: this.onCellClick('outHouse')
				},
				{
					prop: 'code',
					label: '原料编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.disabled && this.isHand
					},
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '原料名称' },
				{
					prop: 'proItem.code',
					label: '产品编号',
					width: '150px'
				},
				{ prop: 'proItem.name', label: '产品名称' },
				{
					prop: 'unit',
					label: '领料单位',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.disabled && this.isHand
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'composeBom.name',
					label: '产品BOM',
					width: '200px'
				},
				{
					prop: 'planTotal',
					label: '应领数量',
					width: '120px'
				},
				{
					prop: 'actualTotal',
					label: '已领数量',
					width: '120px'
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px'
				}
			],
			tableData: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			tableValiDate: [{
				columnProp: 'inHouse',
				rule: (row, success, error) => {
					if (!row.inHouse.id) {
						error('入库仓库不能为空')
					} else {
						success()
					}
				}
			},
			{
				columnProp: 'outHouse',
				rule: (row, success, error) => {
					if (!row.outHouse.id) {
						error('出库仓库不能为空')
					} else if (row.outHouse.id === row.inHouse.id) {
						error('出库仓库与入库仓库不可相同')
					} else {
						success()
					}
				}
			}],
			tableEditEnterColumnProp: this.isHand ? EDIT_ISHAND_TYPE : EDIT_NOHAND_TYPE,
			itemUnitList: [],
			codeSelectLoading: false,
			fxCache: this.$fxUtils.fxCache('pick-list'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('pickListGenerateType', 'rules')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['detailsAuthGetter', 'getSysParams']),
		authDisabled () {
			return !this.detailsAuthGetter('production-manage_picking-list.delete-pickingList')
		},
		computedTableColumn () {
			return this.tableColumn
		},
		tableEditColumnProp () {
			return this.isHand ? EDIT_ISHAND_TYPE : EDIT_NOHAND_TYPE
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType)
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'saveBtn')
				} else {
					this.$refs.detailsTable.setRowEdit(this.tableData[0], 'code')
				}
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveTableListCheck () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
				this.$emit('on-finish', 'Belong')
			})
		},
		onDetailsRefresh () {
			this.$fxApi('pickingList.getZeroAmount', this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billVersion = this.organDetails.version
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('production-manage.picking-list.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi('pickingList.editDetail', this.organDetails.id, params.id)({ data: params, logger }).then(res => {
				this.$emit('set-version', res.billVersion)
				return Promise.resolve(res)
			})
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
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		inHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`inHouse-${$index}`}
				value={row.inHouse.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('inHouse')}
				row={row}
				rowIndex={$index}
				columnProp='inHouse'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				cellText={row.inHouse.name}
				selectOptionList={this.storeSelectList}
				on-on-change={this.onInHouseCodeSelectChange}
			></fx-list-cell-select>
		},
		onInHouseCodeSelectChange (item, row) {
			row.inHouse = item
		},
		outHouseRender (h, { row, $index }) {
			if (!row.outHouse) {
				this.$set(row, 'outHouse', {})
			}
			h = this.$createElement
			return <fx-list-cell-select
				ref={`outHouse-${$index}`}
				value={row.outHouse.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('outHouse')}
				row={row}
				rowIndex={$index}
				columnProp='outHouse'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				cellText={row.outHouse.name}
				selectOptionList={this.storeSelectList}
				on-on-change={this.onOutHouseCodeSelectChange}
			></fx-list-cell-select>
		},
		onOutHouseCodeSelectChange (item, row) {
			row.outHouse = item
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
			></fx-list-cell-select>
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onCodeSelectChange (item, row) {
			row.item = item
			row.itemUnit = item.itemUnitList[0]
			row.itemUnitId = row.itemUnit.id
			if (!this.isHand) {
				return this.getbomList(item.id).then(res => {
					this.bomList = res
					if (this.bomList.length > 0) {
						row.composeBom = res[0]
						return Promise.resolve()
					} else {
						row.composeBom = {}
					}
				})
			}
		},
		async getbomList (itemId) {
			const bomList = await this.$fxApi('productionPlan.getBomList', itemId)
			return Promise.resolve(bomList)
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					if (row.outHouse.id) {
						this.getItemList(row.outHouse.id, row.item.id).then(res => {
							this.codeSelectLoading = false
							this.itemList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择出库仓库')
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
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.unitSelectLoading = false
						this.itemUnitList = row.item.itemUnitList
						resolve()
						// })
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		getItemList (storeId, itemId = 0, withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}`
			return this.fxCache.cacher(key, this.$fxApi('productionPlan.getItemUnitList', itemId, storeId, withUnit))
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	.mistake-check-warning {
		height: 24px
		line-height: 24px
	}
}
</style>
