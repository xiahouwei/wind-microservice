<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="领料明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_in-store-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:canAdd="isHand"
			:showSummary="false"
			:canAddMulity="false"
			:showMistakeCheck="true"
			@on-details-refresh="onDetailsRefresh"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
			:showDeleteBtn='showDeleteBtn'
			:deleteDisabled="deleteDisabled"
		>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
const EDIT_ISHAND_TYPE = ['inHouse', 'outHouse', 'code', 'proCode', 'unit', 'planTotal', 'actualTotal']
const EDIT_NOHAND_TYPE = ['outHouse', 'actualTotal']
export default {
	name: 'detailsInfo',
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
		itemName: String
	},
	data () {
		return {
			collapseVisible: true,
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
				{ prop: 'item.name', label: '原料名称', required: true },
				{
					prop: 'proCode',
					label: '产品编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return false
					},
					sortable: true,
					sortKey: 'proItem.code',
					fxRender: this.proItemRender,
					click: this.onCellClick('proCode')
				},
				{ prop: 'proItem.name', label: '产品名称', required: true },
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
					width: '200px',
					required: true
				},
				{
					prop: 'planTotal',
					label: '应领数量',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.disabled && this.isHand
					},
					fxRender: this.planTotalRender,
					click: this.onCellClick('planTotal'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'actualTotal',
					label: '已领数量',
					width: '120px',
					required: true,
					editColumn: () => {
						return false
					},
					fxRender: this.actualTotalRender,
					click: this.onCellClick('actualTotal'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
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
			},
			{
				columnProp: 'code',
				rule (row, success, error) {
					if (!row.item.id) {
						error('原料编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'unit',
				rule (row, success, error) {
					if (!row.itemUnit.id) {
						error('领料单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'planTotal',
				rule (row, success, error) {
					if (!row.planTotal) {
						error('应领数量不能为0')
					} else {
						success()
					}
				}
			}],
			itemList: [],
			itemUnitList: [],
			bomList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			fxCache: this.$fxUtils.fxCache('pick-list'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('pickListGenerateType', 'rules'),
			codeSelectLoading: false,
			proCodeSelectLoading: false,
			unitSelectLoading: false,
			bomSelectLoading: false,
			selectedRows: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			return this.tableColumn
		},
		showDeleteBtn () {
			return this.isHand && this.detailsAuthGetter('production-manage_picking-list.delete-pickingList')
		},
		tableEditColumnProp () {
			return this.isHand ? EDIT_ISHAND_TYPE : EDIT_NOHAND_TYPE
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
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType)
		}
	},
	watch: {
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
				on-on-select-enter={this.onCodeSelectEnter}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			row.item = item
			row.itemUnit = item.itemUnitList[0]
			row.itemUnitId = row.itemUnit.id
			if (row.item.itemUnitList.length === 1) {
				this.$refs.detailsTable.setListCellFocus('planTotal')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
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
		setItemList (storeId) {
			this.getItemList(storeId).then(res => {
				this.itemList = res
			})
		},
		getItemList (storeId, itemId = 0, withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}`
			return this.fxCache.cacher(key, this.$fxApi('productionPlan.getItemUnitList', itemId, storeId, withUnit))
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (unchangedFlag) {
					if (row.item.itemUnitList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('planTotal')
					} else {
						resolve()
					}
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (unchangedFlag) {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		proItemRender (h, { row, $index }) {
			h = this.$createElement
			if (this.isHand) {
				return <div ref={`proCode-${$index}`} ></div>
			} else {
				return <fx-list-cell-select
					ref={`proCode-${$index}`}
					value={row.proItem.id}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('proCode')}
					row={row}
					rowIndex={$index}
					columnProp='proCode'
					dropdownWidth='300px'
					optionRender={this.optionRender}
					selectOptionProp={this.selectOptionProp}
					filterKeys={this.filterKeys}
					cellText={row.proItem.code}
					loading={this.proCodeSelectLoading}
					selectOptionList={this.itemList}
					asyncChange={this.onProCodeSelectChange}
					fpSelectShow={this.onProCodeSelectShow(row)}
					on-on-select-enter={this.onProCodeSelectEnter}
				></fx-list-cell-select>
			}
		},
		onProCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					resolve()
				})
			}
		},
		onProCodeSelectChange (item, row) {
			row.proItem = item
			this.$refs.detailsTable.setListCellFocus('unit')
			return this.getbomList(item.id).then(res => {
				this.bomList = res
				if (this.bomList.length > 0) {
					row.composeBom = res[0]
					return Promise.resolve()
				} else {
					row.composeBom = {}
				}
			})
		},
		onProCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (unchangedFlag) {
				this.$refs.detailsTable.setListCellFocus('unit')
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
		onDateChange (item, row) {
			row.productDate = item
		},
		planTotalRender (h, { row, $index }) {
			h = this.$createElement
			if (this.billColor) {
				return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.organDetails.billSign === 1 ? '+' : ''}{this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}</span>
			} else {
				return <fx-list-cell-input-number
					ref={`planTotal-${$index}`}
					vModel={row.planTotal}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('planTotal')}
					row={row}
					rowIndex={$index}
					columnProp='planTotal'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}
					on-on-input-enter={this.onPlanTotalEnter}
					on-on-input-tab={this.onPlanTotalTab}
				>
				</fx-list-cell-input-number>
			}
		},
		onPlanTotalEnter () {
			this.$refs.detailsTable.setListCellFocus('actualTotal')
		},
		onPlanTotalTab () {
			this.$refs.detailsTable.setListCellFocus('actualTotal')
		},
		actualTotalRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`actualTotal-${$index}`}
				vModel={row.actualTotal}
				isEdit={false}
				row={row}
				rowIndex={$index}
				columnProp='actualTotal'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.actualTotal, this.sysPointSize)}
				on-on-input-enter={this.onActualTotalEnter}
				on-on-input-tab={this.onActualTotalTab}
			>
			</fx-list-cell-input-number>
		},
		onActualTotalEnter () {
			this.$refs.detailsTable.setListCellFocus('memo')
		},
		onActualTotalTab () {
			this.$refs.detailsTable.setListCellFocus('memo')
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
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.bomList = this.isHand ? [] : [row.item]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpInitAddDetailsData () {
			return new Promise(resolve => {
				const data = {
					inHouse: {}, // 入库仓库
					outHouse: {}, // 出库仓库
					item: {}, // 原料
					proItem: {}, // 产品
					itemUnit: {},
					itemId: '',
					itemUnitId: '',
					mainUnitId: '',
					composeBom: {},
					planTotal: 0,
					actualTotal: 0,
					memo: ''
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			detail.billVersion = this.organDetails.version
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const mainUnit = params.item.itemUnitList.find(item => {
				return item.mainFlag === 1
			})
			params.mainUnitId = mainUnit.id
			params.unitRatio = params.itemUnit.ratio
			if (params.id) {
				delete params.modifyMan
				delete params.modifyDate
				params.createMan = this.organDetails.createMan
				const logger = this.$fxLogger.createInfo('production-manage.picking-list.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('pickingList.editDetail', this.organDetails.id, params.id)({ data: params, logger }).then(res => {
					this.$emit('set-version', res.billVersion)
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('production-manage.picking-list.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi('pickingList.addDetail', this.organDetails.id)({ data: params, logger }).then(res => {
					this.$emit('set-version', res.billVersion)
					return Promise.resolve(res)
				})
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const inHouse = params.inHouse.name
			const outHouse = params.outHouse.name
			const actualTotal = params.actualTotal || 0
			const planTotal = params.planTotal || 0
			// const taxPrice = item.inTaxPrice
			return `入库仓库:${inHouse},出库仓库:${outHouse},原料名称:${name},单位:${itemUnit},已领数量:${actualTotal},应领数量:${planTotal}`
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
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('production-manage.picking-list.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi('pickingList.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('pickingList.delDetail', this.organDetails.id, ids[0]).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res.details)
				})
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.inHouse.name
				const outHouse = item.outHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const actualTotal = item.actualTotal
				const planTotal = item.planTotal
				return `入库仓库:${storeName},出库仓库:${outHouse},原料名称:${name},单位:${itemUnit},应领数量:${planTotal},已领数量:${actualTotal}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		getSelectArr () {
			return this.$refs.detailsTable.$refs.listTable.selectedArr
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		},
		stateFlagmatter (row) {
			return '未开始'
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
</style>
