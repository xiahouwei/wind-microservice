<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1300px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="6" type="MachiningOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在制造费用、人工费用、其他费用为0的（成品）品项和生产成本、生产成本单价为0的（附成品）品项，会导致成品、附成品入库成本与实际有出入，请注意是否输入错误！</div>
			<fx-details-table-plus
				ref="detailsTable"
				v-fx-tab:loop.store-manage_in-store-order_details.detailsInfo
				:tableColumn="computedColumn"
				:tableData="tableData"
				:subColumns="subColumns"
				:tableEditColumnProp="tableEditColumnProp"
				:tableEditSubColumnProp="tableEditSubColumnProp"
				:mainId="organDetails.id"
				:showDeleteBtn='false'
				:selectable="false"
				:canAdd="false"
				:showColumnFilterBtn="false"
				:showSummary="false"
				:cellClassName="cellClassNameHandler"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpBeforeSubRowEdit="beforeSubRowEdit"
				:fpOnRowEdit="fpOnRowEdit"
				:fpSaveDetails="fpSaveDetails"
				:fpSaveSubDetails="fpSaveSubDetails"
				:fpDeleteDetails="fpDeleteDetails"
				@on-details-refresh="onDetailsRefresh"
			>
			</fx-details-table-plus>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.saveBtn
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
import { mapState } from 'vuex'

// const EDIT_ISHAND_TYPE = ['house', 'code', 'bomCode', 'unit', 'planTotal', 'actualTotal', 'makeCharge', 'manualCharge', 'otherChargeTypeList', 'otherCharge', 'productionCostPrice', 'productionCost', 'taxRate', 'memo']
const EDIT_PRODUCT_TYPE = ['planMakeCharge', 'makeCharge', 'manualCharge', 'otherCharge']
const EDIT_ADDITION_TYPE = ['productionCostPrice', 'productionCost']
const EDIT_SUB_TYPE = ['subHouse', 'subCode', 'subUnit', 'subActualTotal', 'subMemo']
export default {
	name: 'mistakeCheckStep1',
	components: {
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		otherChargeTypeList: {
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
		actionText: String,
		actionType: String
	},
	data () {
		return {
			collapseVisible: true,
			dialogVisible: false,
			tableColumn: [
				{
					prop: 'house',
					label: '仓库编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return false
					},
					fxRender: this.houseRender,
					click: this.onCellClick('house')
				},
				{ prop: 'house.name', label: '仓库名称', width: '120px' },
				{
					prop: 'code',
					label: '品项编号',
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
				{ prop: 'item.name', label: '品项名称', required: true, fxRender: this.itemNameRender },
				{
					prop: 'bomCode',
					label: '产品BOM',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled && this.isHand
					},
					fxRender: this.bomRender,
					click: this.onCellClick('bomCode')
				},
				{ prop: 'unit.name', label: '单位', width: '120px' },
				{
					prop: 'planTotal',
					label: '计划产量',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					summary: true,
					fxRender: this.planTotalRender,
					click: this.onCellClick('planTotal'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'actualTotal',
					label: '实际产量',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.actualTotalRender,
					click: this.onCellClick('actualTotal'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'materialCostCharge',
					label: '材料成本费用',
					required: true,
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.materialCostCharge, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'planMakeCharge',
					label: '计划制造费用',
					width: '120px',
					summary: true,
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.planMakeChargeRender,
					click: this.onCellClick('planMakeCharge'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.planMakeCharge, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'makeCharge',
					label: '实际制造费用',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.makeChargeRender,
					click: this.onCellClick('makeCharge'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.makeCharge, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'manualCharge',
					label: '人工费用',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.manualChargeRender,
					click: this.onCellClick('manualCharge'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'otherChargeTypeList',
					label: '其他费用类型',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.otherChargeTypeRender,
					click: this.onCellClick('otherChargeTypeList')
				},
				{
					prop: 'otherCharge',
					label: '其他费用',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.otherChargeRender,
					click: this.onCellClick('otherCharge'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'productionCostPrice',
					label: '生产成本单价',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.productionCostPriceRender,
					click: this.onCellClick('productionCostPrice'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPricePointSize)
					}
				},
				{
					prop: 'productionCost',
					label: '生产成本',
					width: '120px',
					required: true,
					summary: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.productionCostRender,
					click: this.onCellClick('productionCost'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'planProductionCostPrice',
					label: '计划生产成本单价',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPricePointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.planProductionCostPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'planProductionCost',
					label: '计划生产成本',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.planProductionCost, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
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
			tableData: [],
			subColumns: [
				{
					prop: 'house',
					label: '仓库编号',
					render: this.subHouseRender
				},
				{ prop: 'house.name', label: '仓库名称' },
				{
					prop: 'code',
					label: '配料编号',
					render: this.subCodeRender
				},
				{ prop: 'item.name', label: '配料名称' },
				{ prop: '', label: '' },
				{
					prop: 'unit',
					label: '单位',
					render: this.subUnitRender
				},
				{
					prop: 'planTotal',
					label: '计划用量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'theoryTotal',
					label: '理论用量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.theoryTotal, this.sysPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'actualTotal',
					label: '实际用量',
					render: this.subActualTotalRender,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'theoryNetMaterialTotal',
					label: '理论净料用量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.theoryNetMaterialTotal, this.sysPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'money',
					label: '成本金额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'price',
					label: '成本单价',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPricePointSize)
					}
				},
				{
					prop: 'dataType',
					label: '录入方式',
					formatter: (row) => {
						return this.subDataTypeFormatter(row)
					}
				},
				{
					prop: 'memo',
					label: '明细备注',
					render: this.subMemoRender
				},
				{ prop: '', label: '' },
				{ prop: '', label: '' },
				{ prop: '', label: '' },
				{ prop: '', label: '' },
				{ prop: '', label: '' },
				{ prop: '', label: '' },
				{ prop: '', label: '' }
			]
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
		computedColumn () {
			return this.tableColumn
		},
		productEditColumnProp () {
			return EDIT_PRODUCT_TYPE
		},
		additionEditColumnProp () {
			return EDIT_ADDITION_TYPE
		},
		tableEditColumnProp () {
			return EDIT_PRODUCT_TYPE
		},
		tableEditSubColumnProp () {
			return EDIT_SUB_TYPE
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.setRowEdit(this.tableData[0], 'planMakeCharge')
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveTableListCheck () {
			return new Promise(resolve => {
				this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
					if (this.tableData.length === 0) {
						resolve()
					} else {
						resolve()
					}
				})
			})
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
				this.$emit('on-finish', 'CostZero')
			})
		},
		onDetailsRefresh () {
			return this.$fxApi('machiningOrder.actualZeroAmount', this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.inHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.inTaxPrice
				return `入库仓库:${storeName},品项名称:${name},单位:${itemUnit},入库数量:${amount},含税单价:${taxPrice}`
			}).join(';')
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
		},
		// 主明细
		houseRender (h, { row, $index }) {
			h = this.$createElement
			return <div ref={`house-${$index}`}>{row.house.code}</div>
		},
		onHouseCodeSelectChange (item, row) {
			row.house = item
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <div ref={`code-${$index}`}>{row.item.code}</div>
		},
		onCodeSelectChange (item, row, rowIndex) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('planTotal')
				this.onBomChangeConfirm(row.id).then(() => {
					row.item = item
					return this.getBomList(item.id).then(res => {
						this.bomList = res
						if (this.bomList.length > 0) {
							const composeBom = res.find(bomItem => {
								return bomItem.isDefault === true
							})
							row.composeBom = composeBom || res[0]
							if (row.composeBom) {
								this.getLastDosing(row.composeBom.id, row.planTotal).then(res => {
									row.dosingDetails = res
									row.dosingDetails.map(item => {
										// item.isEdit = true
										item.detailProductId = row.id
									})
									this.$refs.detailsTable.setBomCurrentExpand(row)
								})
							}
							row.unit.id = row.composeBom.unitId
							row.unit.name = row.item.itemUnitList.find((item) => {
								return item.id === row.composeBom.unitId
							}).name
						} else {
							row.composeBom = {}
							row.unit.name = ''
						}
					})
				}).catch(() => {
					this.$refs[`code-${rowIndex}`].setCurrentInputValue(row.item.id)
				})
			} else {
				row.item = item
				row.unit = row.item.itemUnitList[0]
			}
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					if (row.house.id) {
						this.getItemList(row.house.id, row.item.id).then(res => {
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
		getItemList (storeId, itemId = 0, withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}`
			return this.fxCache.cacher(key, this.$fxApi('productionPlan.getItemUnitList', itemId, storeId, withUnit))
		},
		onCodeSelectClick (item, row, $index) {
			return new Promise(resolve => {
				if (!row.additionFlag) {
					this.$refs.detailsTable.setListCellFocus('bomCode')
					resolve()
				} else {
					this.$refs.detailsTable.setListCellFocus('unit')
					resolve()
				}
			})
		},
		onCodeSelectEnter (row, $index, item) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('bomCode')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		onCodeSelectTab (row, $index, item) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('bomCode')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		itemNameRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <div>{row.item.name}</div>
			} else {
				return <div class='name-render'>
					{row.item.name}
					<div class="triangle">
					</div>
					<div class="tag-name">附</div>
				</div>
			}
		},
		bomRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <div ref={`bomCode-${$index}`}>{row.composeBom.name}</div>
			} else {
				return <div ref={`bomCode-${$index}`}></div>
			}
		},
		onBomSelectClick (selectItem, row, rowIndex, unchangedFlag) {
			this.$refs.detailsTable.setListCellFocus('planTotal')
			return Promise.resolve()
		},
		onBomSelectEnter () {
			this.$refs.detailsTable.setListCellFocus('planTotal')
		},
		bomSelectChange (item, row, rowIndex) {
			this.onBomChangeConfirm(row.id).then(() => {
				row.composeBom = item
				if (!row.additionFlag) {
					row.unit.id = row.composeBom.unitId
					row.unit.name = row.item.itemUnitList.find((item) => {
						return item.id === row.composeBom.unitId
					}).name
					this.getLastDosing(item.id, row.planTotal).then(res => {
						row.dosingDetails = res
						row.dosingDetails.map(item => {
							item.dataType = 'AUTO_IMPORT'
							item.detailProductId = row.id
						})
						this.$refs.detailsTable.setBomCurrentExpand(row)
					})
				}
			}).catch(() => {
				this.$refs[`bomCode-${rowIndex}`].setCurrentInputValue(row.composeBom.id)
			})
		},
		onBomChangeConfirm (id) {
			return this.$fxConfirm('该操作会清空配料信息，确定继续？').then(() => {
				return this.clearDetails(id)
			})
		},
		clearDetails (id) {
			return this.$fxApi('machiningOrder.relationProduct', this.organDetails.id)({ data: [id] }).then(res => {
				return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
					this.$emit('set-version', res.version)
					return Promise.resolve()
				})
			})
		},
		async getLastDosing (bomId, planTotal = 0) {
			return await this.$fxApi('machiningOrder.getLastDosing', bomId, planTotal)
		},
		bomSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					if (row.item.id) {
						this.getBomList(row.item.id).then(res => {
							this.bomList = res
							if (this.bomList.length === 1) {
								row.composeBom = res[0]
							}
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		async getBomList (itemId) {
			return await this.$fxApi('productionPlan.getBomList', itemId)
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <div ref={`unit-${$index}`}>{row.unit.name}</div>
			} else {
				return <fx-list-cell-select
					ref={`unit-${$index}`}
					value={row.unit.id}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='unit'
					cellText={row.unit.name}
					loading={this.unitSelectLoading}
					selectOptionList={this.itemUnitList}
					asyncClick={this.onUnitSelectClick}
					on-on-change={this.onUnitSelectChange}
					fpSelectShow={this.onUnitSelectShow(row)}
					on-on-select-enter={this.onUnitSelectEnter}
				></fx-list-cell-select>
			}
		},
		onUnitSelectClick (item, row, $index) {
			return new Promise(resolve => {
				if (!row.additionFlag) {
					this.$refs.detailsTable.setListCellFocus('planTotal')
					resolve()
				} else {
					this.$refs.detailsTable.setListCellFocus('actualTotal')
					resolve()
				}
			})
		},
		onUnitSelectChange (item, row) {
			row.unit = item
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
		onUnitSelectEnter (row) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('planTotal')
			} else {
				this.$refs.detailsTable.setListCellFocus('actualTotal')
			}
		},
		planTotalRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-input-number
					ref={`planTotal-${$index}`}
					vModel={row.planTotal}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('planTotal')}
					row={row}
					rowIndex={$index}
					columnProp='planTotal'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}
					on-on-change={this.onPlanTotalChange}
					on-on-input-enter={this.onPlanTotalEnter}
					on-on-input-tab={this.onPlanTotalTab}
				>
				</fx-list-cell-input-number>
			} else {
				return <div ref={`planTotal-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}</div>
			}
		},
		onPlanTotalChange (val, row) {
			row.planTotalChange = true
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
				isEdit={row.isEdit && this.tableEditColumnProp.includes('actualTotal')}
				row={row}
				rowIndex={$index}
				columnProp='actualTotal'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.actualTotal, this.sysPointSize)}
				on-on-change={this.actualTotalChange}
				on-on-input-enter={this.onActualTotalEnter}
				on-on-input-tab={this.onActualTotalTab}
			>
			</fx-list-cell-input-number>
		},
		actualTotalChange (val, row) {
			row.productionCost = val * row.productionCostPrice
		},
		onActualTotalEnter (row) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('makeCharge')
			} else {
				this.$refs.detailsTable.setListCellFocus('productionCostPrice')
			}
		},
		onActualTotalTab (row) {
			if (!row.additionFlag) {
				this.$refs.detailsTable.setListCellFocus('makeCharge')
			} else {
				this.$refs.detailsTable.setListCellFocus('productionCostPrice')
			}
		},
		planMakeChargeRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-input-number
					ref={`planMakeCharge-${$index}`}
					vModel={row.planMakeCharge}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('planMakeCharge')}
					row={row}
					rowIndex={$index}
					columnProp='planMakeCharge'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.planMakeCharge, this.sysMoneyPointSize)}
					on-on-input-enter={this.onPlanMakeChargeEnter}
				>
				</fx-list-cell-input-number>
			} else {
				return <div ref={`planMakeCharge-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.planMakeCharge, this.sysMoneyPointSize)}</div>
			}
		},
		onPlanMakeChargeEnter () {
			this.$refs.detailsTable.setListCellFocus('makeCharge')
		},
		makeChargeRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-input-number
					ref={`makeCharge-${$index}`}
					vModel={row.makeCharge}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('makeCharge')}
					row={row}
					rowIndex={$index}
					columnProp='makeCharge'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.makeCharge, this.sysMoneyPointSize)}
					on-on-input-enter={this.onMakeChargeEnter}
					on-on-input-tab={this.onMakeChargeTab}
				>
				</fx-list-cell-input-number>
			} else {
				return <div ref={`makeCharge-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.makeCharge, this.sysMoneyPointSize)}</div>
			}
		},
		onMakeChargeEnter () {
			this.$refs.detailsTable.setListCellFocus('manualCharge')
		},
		onMakeChargeTab () {
			this.$refs.detailsTable.setListCellFocus('manualCharge')
		},
		manualChargeRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-input-number
					ref={`manualCharge-${$index}`}
					vModel={row.manualCharge}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('manualCharge')}
					row={row}
					rowIndex={$index}
					columnProp='manualCharge'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.manualCharge, this.sysMoneyPointSize)}
					on-on-input-enter={this.onManualChargeEnter}
					on-on-input-tab={this.onManualChargeTab}
				>
				</fx-list-cell-input-number>
			} else {
				return <div ref={`manualCharge-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.manualCharge, this.sysMoneyPointSize)}</div>
			}
		},
		onManualChargeEnter () {
			this.$refs.detailsTable.setListCellFocus('otherCharge')
		},
		onManualChargeTab () {
			this.$refs.detailsTable.setListCellFocus('otherCharge')
		},
		otherChargeTypeRender (h, { row, $index }) {
			row.otherChargeTypeList = row.otherChargeTypeList ? row.otherChargeTypeList : []
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-select-mulity
					ref={`otherChargeTypeList-${$index}`}
					vModel={row.otherChargeTypeList}
					isEdit={row.isEdit && this.productEditColumnProp.includes('otherChargeTypeList')}
					row={row}
					selectOptionProp={this.optionProp}
					loading={this.otherChargeTypeSelectLoading}
					rowIndex={$index}
					columnProp='otherChargeTypeList'
					dropdownWidth='180px'
					selectOptionList={this.otherChargeTypeList}
				></fx-list-cell-select-mulity>
			} else {
				return <div ref={`otherChargeTypeList-${$index}`}>{}</div>
			}
		},
		otherChargeRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <fx-list-cell-input-number
					ref={`otherCharge-${$index}`}
					vModel={row.otherCharge}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('otherCharge')}
					row={row}
					rowIndex={$index}
					columnProp='otherCharge'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.otherCharge, this.sysMoneyPointSize)}
					on-on-input-enter={this.onOtherChargeEnter}
					on-on-input-tab={this.onOtherChargeTab}
				>
				</fx-list-cell-input-number>
			} else {
				return <div ref={`otherCharge-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.otherCharge, this.sysMoneyPointSize)}</div>
			}
		},
		onOtherChargeEnter () {
			this.$refs.detailsTable.setListCellFocus('productionCostPrice')
		},
		onOtherChargeTab () {
			this.$refs.detailsTable.setListCellFocus('productionCostPrice')
		},
		productionCostPriceRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <div ref={`productionCostPrice-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.productionCostPrice, this.sysPricePointSize)}</div>
			} else {
				return <fx-list-cell-input-number
					ref={`productionCostPrice-${$index}`}
					vModel={row.productionCostPrice}
					isEdit={row.isEdit && this.additionEditColumnProp.includes('productionCostPrice')}
					row={row}
					rowIndex={$index}
					columnProp='productionCostPrice'
					pointSize={this.sysPricePointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.productionCostPrice, this.sysPricePointSize)}
					on-on-change={this.productionCostPriceChange}
					on-on-input-enter={this.onProductionCostPriceEnter}
					on-on-input-tab={this.onProductionCostPriceTab}
				>
				</fx-list-cell-input-number>
			}
		},
		productionCostPriceChange (val, row) {
			row.productionCost = val * row.actualTotal
		},
		onProductionCostPriceEnter () {
			this.$refs.detailsTable.setListCellFocus('productionCost')
		},
		onProductionCostPriceTab () {
			this.$refs.detailsTable.setListCellFocus('productionCost')
		},
		productionCostRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.additionFlag) {
				return <div ref={`productionCost-${$index}`}>{this.$fxCommon.toFixedAutoZeroFill(row.productionCost, this.sysMoneyPointSize)}</div>
			} else {
				return <fx-list-cell-input-number
					ref={`productionCost-${$index}`}
					vModel={row.productionCost}
					isEdit={row.isEdit && this.additionEditColumnProp.includes('productionCost')}
					row={row}
					rowIndex={$index}
					columnProp='productionCost'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.productionCost, this.sysMoneyPointSize)}
					on-on-change={this.productionCostChange}
					on-on-input-enter={this.onProductionCostEnter}
				>
				</fx-list-cell-input-number>
			}
		},
		productionCostChange (val, row) {
			row.productionCostPrice = val / row.actualTotal
		},
		onProductionCostEnter () {
			this.$refs.detailsTable.setListCellFocus('taxRate')
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit && this.productEditColumnProp.includes('taxRate')}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				asyncClick={this.onTaxSelectClick}
				class={this.billColor}
			></fx-list-cell-select>
		},
		onTaxSelectClick () {
			return new Promise(resolve => {
				this.$refs.detailsTable.setListCellFocus('memo')
				resolve()
			})
		},
		onTaxSelectTab (row, $index) {
			this.$refs.detailsTable.setListCellFocus('memo')
		},
		memoRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`memo-${$index}`}
				vModel={row.memo}
				isEdit={row.isEdit && this.productEditColumnProp.includes('memo')}
				row={row}
				rowIndex={$index}
				columnProp='memo'
				class='cell-input-memo'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		subHouseRender (h, { row, $rowIndex, $subIndex }) {
			row.$rowIndex = $rowIndex
			if (!row.house) {
				this.$set(row, 'house', {})
			}
			h = this.$createElement
			return <fx-list-cell-select
				ref={`subHouse-${$rowIndex}-${$subIndex}`}
				value={row.house.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$subIndex}
				columnProp='house'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				asyncClick={this.onSubHouseSelectClick}
				selectOptionProp={this.selectOptionProp}
				cellText={row.house.code}
				selectOptionList={this.storeSelectList}
				on-on-change={this.onSubHouseCodeSelectChange}
			></fx-list-cell-select>
		},
		onSubHouseSelectClick (item, row, $index) {
			return new Promise(resolve => {
				if (row.dataType === 'MANUAL') {
					this.$refs[`subCode-${row.$rowIndex}-${row.$fxIndex}`].focus()
				} else {
					this.$refs[`subActualTotal-${row.$rowIndex}-${row.$fxIndex}`].focus()
				}
				resolve()
			})
		},
		onSubHouseCodeSelectChange (item, row) {
			row.house = item
		},
		subCodeRender (h, { row, $rowIndex, $subIndex }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`subCode-${$rowIndex}-${$subIndex}`}
				value={row.item.id}
				isEdit={false}
				row={row}
				rowIndex={$rowIndex}
				subRowIndex={$subIndex}
				columnProp='code'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				filterKeys={this.filterKeys}
				cellText={row.item.code}
				loading={this.codeSelectLoading}
				selectOptionList={this.itemList}
				asyncClick={this.onSubCodeSelectClick}
				on-on-change={this.onSubCodeSelectChange}
				fpSelectShow={this.onCodeSelectShow(row)}
			></fx-list-cell-select>
		},
		onSubCodeSelectChange (item, row) {
			row.item = item
			row.unit = item.itemUnitList.find(item => {
				return item.mainFlag === 1
			})
		},
		onSubCodeSelectClick (item, row, $index) {
			return new Promise(resolve => {
				if (row.dataType === 'MANUAL') {
					this.$refs[`subUnit-${row.$rowIndex}-${row.$fxIndex}`].focus()
				} else {
					this.$refs[`subActualTotal-${row.$rowIndex}-${row.$fxIndex}`].focus()
				}
				resolve()
			})
		},
		subUnitRender (h, { row, $rowIndex, $subIndex }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`subUnit-${$rowIndex}-${$subIndex}`}
				value={row.unit.id}
				isEdit={false}
				row={row}
				rowIndex={$subIndex}
				columnProp='unit'
				cellText={row.unit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				asyncClick={this.onSubUnitSelectClick}
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onSubUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onSubUnitSelectClick (item, row, $index) {
			return new Promise(resolve => {
				if (row.dataType === 'MANUAL') {
					this.$refs[`subActualTotal-${row.$rowIndex}-${row.$fxIndex}`].focus()
				} else {
					this.$refs[`subActualTotal-${row.$rowIndex}-${row.$fxIndex}`].focus()
				}
				resolve()
			})
		},
		onSubUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.unitSelectLoading = false
						this.itemUnitList = row.item.itemUnitList
						resolve()
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		subActualTotalRender (h, { row, $rowIndex, $subIndex }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`subActualTotal-${$rowIndex}-${$subIndex}`}
				vModel={row.actualTotal}
				isEdit={false}
				row={row}
				rowIndex={$subIndex}
				columnProp='actualTotal'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.actualTotal, this.sysPointSize)}
				on-on-input-enter={this.onSubActualTotalEnter}
			>
			</fx-list-cell-input-number>
		},
		onSubActualTotalEnter (row) {
			this.$refs[`subMemo-${row.$rowIndex}-${row.$fxIndex}`].focus()
		},
		subMemoRender (h, { row, $rowIndex, $subIndex }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`subMemo-${$rowIndex}-${$subIndex}`}
				vModel={row.memo}
				isEdit={false}
				row={row}
				rowIndex={$subIndex }
				columnProp='memo'
				class='cell-input-memo'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		subDataTypeFormatter (row) {
			return row.dataType === 'MANUAL' ? '手工新建' : '自动录入'
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.unit) ? [] : [row.unit]
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			if (!row.additionFlag) {
				this.bomList = this.$fxUtils.isEmptyObj(row.composeBom) ? [] : [row.composeBom]
			}
			return Promise.resolve()
		},
		beforeSubRowEdit (subRow) {
			this.itemList = this.$fxUtils.isEmptyObj(subRow.item) ? [] : [subRow.item]
			return Promise.resolve(subRow)
		},
		fpOnRowEdit (row, $index, type, focusType) {
			if (focusType) {
				return new Promise(resolve => {
					this.$refs[`${type}-${row.$fxIndex}-${$index}`].focus()
					resolve()
				})
			} else {
				return new Promise(resolve => {
					row.planTotalChange = false
					// this.$refs[`${type}-${$index}`].focus()
					this.$refs.detailsTable.setListCellFocus(type)
					resolve()
				})
			}
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			detail.billVersion = this.organDetails.version
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const paramsData = { ...params }
			if (!paramsData.additionFlag) {
				paramsData.composeBom = { id: params.composeBom.id }
			}
			const mainUnit = params.item.itemUnitList.find(item => {
				return item.mainFlag === 1
			})
			paramsData.mainUnitId = mainUnit.id
			paramsData.unitRatio = params.unit.ratio
			if (params.id) {
				delete paramsData.modifyMan
				delete paramsData.modifyDate
				paramsData.createMan = this.organDetails.createMan
				const logger = this.$fxLogger.createInfo('production-manage.machining-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('machiningOrder.editDetailProduct', this.organDetails.id, params.id)({ data: paramsData, logger }).then(res => {
					// 成品保存
					if (!res.additionFlag) {
						// 配料未批量保存则先批量保存
						if (params.dosingDetails.length > 0 && !params.dosingDetails[0].id) {
							params.planTotalChange = true
							params.dosingDetails.map(item => {
								item.mainUnitId = item.item.itemUnitList.find(unit => {
									return unit.mainFlag === 1
								}).id
								item.detailProductId = res.id
								item.dataType = 'AUTO_IMPORT'
								item.billVersion = res.billVersion
							})
							return this.$fxApi('machiningOrder.addDetailDosingMulity', this.organDetails.id)({ data: params.dosingDetails }).then(res => {
								// 改变计划产量则重置子表
								if (params.planTotalChange) {
									return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
										params.dosingDetails = res.details.find(item => {
											return item.id === params.id
										}).dosingDetails
										this.$emit('set-version', res.version)
										return Promise.resolve(params.dosingDetails)
									})
								} else {
									params.dosingDetails = res.dosingDetails
									this.$emit('set-version', res[0].billVersion)
									return Promise.resolve(res)
								}
							})
						} else {
							// 改变计划产量则重置子表
							if (params.planTotalChange) {
								return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
									params.dosingDetails = res.details.find(item => {
										return item.id === params.id
									}).dosingDetails
									this.$emit('set-version', res.version)
									return Promise.resolve(params.dosingDetails)
								})
							} else {
								this.$emit('set-version', res.billVersion)
								return Promise.resolve(params.dosingDetails)
							}
						}
					} else {
						// 附成品保存
						this.$emit('set-version', res.billVersion)
						return Promise.resolve(res)
					}
				})
			} else {
				// const logger = this.$fxLogger.createInfo('store-manage.in-store-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi('machiningOrder.addDetailProduct', this.organDetails.id)({ data: paramsData }).then(res => {
					params.id = res.id
					if (!res.additionFlag) {
						params.dosingDetails.map(item => {
							item.mainUnitId = item.item.itemUnitList.find(unit => {
								return unit.mainFlag === 1
							}).id
							item.detailProductId = res.id
							item.dataType = 'AUTO_IMPORT'
							item.billVersion = res.billVersion
						})
						return this.$fxApi('machiningOrder.addDetailDosingMulity', this.organDetails.id)({ data: params.dosingDetails }).then(() => {
							if (params.planTotalChange) {
								return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
									params.dosingDetails = res.details.find(item => {
										return item.id === params.id
									}).dosingDetails
									this.$emit('set-version', res.version)
									return Promise.resolve(params.dosingDetails)
								})
							} else {
								params.dosingDetails = res
								this.$emit('set-version', res.billVersion)
								return Promise.resolve(res)
							}
						})
						// 附成品
					} else {
						this.$emit('set-version', res.billVersion)
						return Promise.resolve(res)
					}
				})
			}
		},
		fpSaveSubDetails (detail, origin) {
			detail.billId = this.organDetails.id
			detail.billVersion = this.organDetails.version
			return this.onSaveSubDetailsHandler(detail, origin)
		},
		onSaveSubDetailsHandler (params, origin) {
			const mainUnit = params.item.itemUnitList.find(item => {
				return item.mainFlag === 1
			})
			params.mainUnitId = mainUnit.id
			if (params.id) {
				params.createMan = this.organDetails.createMan
				return this.$fxApi('machiningOrder.editDetailDosing', this.organDetails.id, params.id)({ data: params }).then(res => {
					this.$emit('set-version', res.billVersion)
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('machiningOrder.addDetailDosing', this.organDetails.id)({ data: params }).then(res => {
					this.$emit('set-version', res.billVersion)
					return Promise.resolve(res)
				})
			}
		},
		fpDeleteDetails (selectedIds) {
			return this.$fxApi('machiningOrder.delDetailMulity', this.organDetails.id)({ data: selectedIds }).then(res => {
				this.$refs.detailsTable.clearSelected()
				return Promise.resolve(res)
			})
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
		onCellClick (type) {
			return (row) => {
				if (!EDIT_ADDITION_TYPE.includes(type) && row.additionFlag) {
					return false
				} else if (!EDIT_PRODUCT_TYPE.includes(type) && !row.additionFlag) {
					return false
				} else {
					this.$refs.detailsTable.setRowEdit(row, type)
				}
			}
		},
		onCellSubClick (type, editList) {
			return (subRow, row) => {
				if (editList.includes(subRow.dataType)) {
					this.$refs.detailsTable.setSubEdit(subRow, row, type)
				}
			}
		},
		cellClassNameHandler (rowItem, rowIndex, columnItem) {
			if (!this.additionEditColumnProp.includes(columnItem.prop) && rowItem.additionFlag) {
				return 'addition-col'
			} else if (!this.productEditColumnProp.includes(columnItem.prop) && !rowItem.additionFlag) {
				return 'addition-col'
			} else {
				return ''
			}
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
	>>>.name-render{
		display: block;
		width: 100%;
		height: 35px;
		position: relative;
		overflow: hidden;

		.triangle{
			width: 125px;
			height: 140px;
			background-color: #008CD5;
			position: absolute;
			right: -100px;
			bottom: 0;
			transform: rotate(45deg);
		}
		.tag-name {
			color: #fff;
			position: absolute;
			top: calc(50% - 27px);
			right: 2px;
		}
	}
}
>>>.addition-col::after {
	cursor: auto !important;
	border: none !important;
}
</style>
