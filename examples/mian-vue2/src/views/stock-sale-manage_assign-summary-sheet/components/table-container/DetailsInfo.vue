<template>
	<w-dialog
		v-model="dialogVisible"
		width="1200px"
		title="单据明细"
		top="10vh"
		:beforeClose="onBeforeClose"
		:modalAppendToBody="false"
		:appendToBody="false"
		@close="onClose"
	>
		<div class="table-container">
			<div class="item-name">{{itemName}}</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumnComputed"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:tableValiDate="tableValiDateComputed"
				:fpSaveDetails="fpSaveDetails"
				border
				:showIndex="false"
				:selectable="false"
				:showTools="false"
				:canAdd="false"
				:highlightCurrentRow="true"
			>
			</fx-details-table>
		</div>
		<template slot="footer-right">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存数量</el-button>
		</template>
	</w-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['amount']
export default {
	name: 'detailsInfo',
	props: {
		searchData: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [{
				prop: 'sysBillCode',
				label: '系统单号',
				width: '150px',
				headerAlign: 'center',
				align: 'center',
				rowMerge: 'rowSpan',
				fxRender: this.sysBillCodeRender
			}, {
				prop: 'billState',
				label: '单据状态',
				width: '80px',
				headerAlign: 'center',
				align: 'center',
				rowMerge: 'rowSpan',
				fxRender: this.billStateRender
			}, {
				prop: 'businessDate',
				label: '',
				width: '150px',
				headerAlign: 'center',
				align: 'center',
				rowMerge: 'rowSpan',
				formatter: (row) => {
					return this.$fxUtils.formatterDateTime(row.businessDate)
				}
			}, {
				prop: 'otherOrgan.name',
				label: '',
				headerAlign: 'center',
				align: 'center'
			}, {
				prop: 'billType',
				label: '单据类型',
				width: '100px',
				headerAlign: 'center',
				align: 'center',
				rowMerge: 'rowSpan',
				formatter: (row) => {
					switch (this.searchData.datasource) {
					case 0:
						return this.$fxTypeMiddleware.getCommonTypeItemById('billTypeInStore')(row.billType).name
					case 1:
						return this.$fxTypeMiddleware.getCommonTypeItemById('billTypeOutStore')(row.billType).name
					default:
						return ''
					}
				}
			}, {
				prop: 'inHouse.name',
				label: '入库仓库',
				headerAlign: 'center',
				align: 'center'
			}, {
				prop: 'outHouse.name',
				label: '出库仓库',
				headerAlign: 'center',
				align: 'center'
			}, {
				prop: 'itemUnit.name',
				label: '单位',
				width: '80px',
				headerAlign: 'center',
				align: 'center'
			}, {
				prop: 'amount',
				label: '',
				headerAlign: 'center',
				align: 'center',
				editColumn: (row) => {
					return this.canEditAmount(row)
				},
				fxRender: this.amountRender,
				click: this.onCellClick('amount')
			}, {
				prop: 'item.assistUnit',
				label: '辅助单位',
				width: '80px',
				headerAlign: 'center',
				align: 'center'
			}, {
				prop: 'assistUnitAmount',
				label: '辅助数量',
				headerAlign: 'center',
				align: 'center',
				formatter: (row) => {
					return row.item.assistUnit && row.assistUnitAmount
				}
			}, {
				prop: 'editResult',
				label: '修改结果',
				width: '80px',
				headerAlign: 'center',
				align: 'center',
				fxRender: this.editResultRender
			}],
			tableData: [],
			originData: [],
			tableValiDateSaleOrder: [{
				columnProp: 'amount',
				rule (row, success, error) {
					if (row.stockPlanDetail) {
						if (
							row.amount < row.stockPlanDetail.lowerLimit ||
							(row.stockPlanDetail.supperLimit > 0 && row.amount > row.stockPlanDetail.supperLimit) ||
							(row.stockPlanDetail.roundingWay && row.amount % row.stockPlanDetail.roundingNum !== 0)
						) {
							error(`上限：${row.stockPlanDetail.supperLimit}下限：${row.stockPlanDetail.lowerLimit}取整：${row.stockPlanDetail.roundingWay ? row.stockPlanDetail.roundingNum : '不取整'}`)
						} else {
							success()
						}
					} else {
						success()
					}
				}
			}],
			isCommonTypeByRulesInStore: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			isCommonTypeByRulesOutStore: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules'),
			isCommonTypeByRulesSaleOrder: this.$fxTypeMiddleware.isCommonType('saleOrderGenerateType', 'rules'),
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCalculation: this.$fxCalculation('common'),
			saveQueueMap: {},
			editResult: {},
			editFlag: false
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		billState (val, key) {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		tableColumnComputed () {
			const tableColumn = this.$fxUtils.deepClone(this.tableColumn)
			switch (this.searchData.datasource) {
			case 0:
				tableColumn[2].label = '入库时间'
				tableColumn[3].label = '出库方'
				tableColumn[8].label = '入库数量'
				tableColumn.splice(6, 1)
				return tableColumn
			case 1:
				tableColumn[2].label = '出库时间'
				tableColumn[3].label = '入库方'
				tableColumn[8].label = '出库数量'
				tableColumn.splice(5, 1)
				return tableColumn
			case 2:
				tableColumn[2].label = '订货时间'
				tableColumn[8].label = '销售数量'
				tableColumn.splice(3, 4)
				return tableColumn
			default:
				return []
			}
		},
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		canEditAmount () {
			return (row) => {
				switch (this.searchData.datasource) {
				case 0:
					return this.canEidtInStore && this.isUnSubmit(row) && !this.isDiffInStore(row)
				case 1:
					return this.canEidtOutStore && this.isUnSubmit(row) && !this.isDiffOutStore(row)
				case 2:
					return this.canEidtSaleOrder && this.isUnSubmit(row) && this.isHandSaleOrder(row)
				default:
					return []
				}
			}
		},
		tableValiDateComputed () {
			switch (this.searchData.datasource) {
			case 0:
				return []
			case 1:
				return []
			case 2:
				return this.tableValiDateSaleOrder
			default:
				return []
			}
		},
		canEidtInStore () {
			return this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
		},
		canEidtOutStore () {
			return this.detailsAuthGetter('store-manage_out-store-order.edit-outstore')
		},
		canEidtSaleOrder () {
			return this.detailsAuthGetter('stock-sale-manage_sale-order.edit-sale')
		},
		isUnSubmit () {
			return (row) => {
				return this.$fxStateMiddleware.isState('billState')(['unSubmit'])(row.billState)
			}
		},
		isDiffInStore () {
			return (row) => {
				return this.isCommonTypeByRulesInStore(['diff'])(row.billType, row.subBillType)
			}
		},
		isDiffOutStore () {
			return (row) => {
				return this.isCommonTypeByRulesOutStore(['diff'])(row.billType, row.subBillType)
			}
		},
		isHandSaleOrder () {
			return (row) => {
				return this.isCommonTypeByRulesSaleOrder(['hand'])(row.billType, row.subBillType)
			}
		},
		itemName () {
			return this.tableData[0] && this.tableData[0].item.name
		},
		saveQueueArr () {
			return Object.values(this.saveQueueMap)
		},
		updateAssignSummaryDetailsApi () {
			switch (this.searchData.datasource) {
			case 0:
				return 'updateAssignSummaryInStoreDetails'
			case 1:
				return 'updateAssignSummaryOutStoreDetails'
			case 2:
				return 'updateAssignSummarySaleOrderDetails'
			default:
				return ''
			}
		},
		updateAssignSummaryDetailsLogger () {
			switch (this.searchData.datasource) {
			case 0:
				return 'updateInStore'
			case 1:
				return 'updateOutStore'
			case 2:
				return 'updateSaleOrder'
			default:
				return ''
			}
		},
		checkData () {
			return this.tableData.map(item => {
				return {
					id: item.id,
					amount: item.amount
				}
			})
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.originData = this.$fxUtils.deepClone(tableData)
			this.saveQueueMap = {}
			this.editResult = {}
			this.editFlag = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.doLayout()
				this.fxDataVerification.resetData(this.checkData)
			})
		},
		sysBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <span class='fx-list-table__cell-span'>
				<w-link
					class="check-link"
					on-click={() => this.onJumpLink(row)}
				>
					{row.sysBillCode}
				</w-link>
			</span>
		},
		billStateRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
				class='bill-state-tag'
			></fx-list-state-tag>
		},
		onJumpLink (row) {
			let billClass = ''
			switch (this.searchData.datasource) {
			case 0:
				billClass = 'InStore'
				break
			case 1:
				billClass = 'OutStore'
				break
			case 2:
				billClass = 'SalesOrder'
				break
			}
			this.$fxGoToBillBlank(billClass, { id: row.billId, itemName: row.item.name }, 'detail')
		},
		onSaveClick () {
			this.editResult = {}
			this.$refs.detailsTable.checkDetailsUnSaving().then(this.onSaveHandler)
		},
		onSaveHandler (i = 0, lastBillId = '', newestBillVersion = 0) {
			if (this.saveQueueArr.length === 0) {
				this.$fxMessage.warning('未修改品项数量')
				return false
			}
			this.tableData.forEach(item => {
				if (item.billId === lastBillId) {
					item.billVersion = newestBillVersion
				}
			})
			if (i >= this.saveQueueArr.length) {
				this.saveQueueMap = {}
				this.fxDataVerification.resetData(this.checkData)
				this.originData = this.$fxUtils.deepClone(this.tableData)
				this.$fxMessage.success('修改完成')
				this.editFlag = true
				return false
			}
			const { billId, id, amount, assistUnitAmount, billVersion } = this.saveQueueArr[i]
			const params = {
				billId,
				id,
				amount,
				assistUnitAmount,
				billVersion
			}
			const logger = this.$fxLogger.createInfo(`stock-sale-manage.assign-summary-sheet.${this.updateAssignSummaryDetailsLogger}`, this.createLoggerParams(this.saveQueueArr[i]))
			return this.$fxApi(`${apiName}.${this.updateAssignSummaryDetailsApi}`)({ data: params, logger }).then(res => {
				const { billId, billVersion } = res.data || {}
				this.saveQueueArr[i].billVersion = billVersion || 0
				this.$set(this.editResult, id, { res: true })
				this.onSaveHandler(i + 1, billId, billVersion)
			}).catch(err => {
				this.$set(this.editResult, id, { res: false, message: err.message })
				this.onSaveHandler(i + 1)
			})
		},
		createLoggerParams (row) {
			const originAmount = this.originData.find(item => item.id === row.id).amount
			return {
				orderData: {
					id: row.billId,
					sysBillCode: row.sysBillCode
				},
				itemName: row.item.name,
				originAmount,
				amount: row.amount
			}
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
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
					isEdit={row.isEdit && this.canEditAmount(row)}
					row={row}
					rowIndex={$index}
					columnProp='amount'
					pointSize={this.sysPointSize}
					class="cell-amount__input"
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					vOn:on-change={this.onAmountChange}
					vOn:focus={this.onAmountFocus}
					vOn:blur={this.onAmountBlur}
				>
				</fx-list-cell-input-number>
			</el-tooltip>
		},
		onAmountFocus (row, index) {
			this.$set(this.tableData[index], 'tipFlag', true)
		},
		onAmountBlur (row, index) {
			row.tipFlag = false
		},
		onAmountChange (val, row) {
			if (!row.preDetailIsAssistUnit) {
				this.fxCalculation.calculateAssistAmount(row, row.item.itemUnitList)
			}
		},
		editResultRender (h, { row, $index }) {
			h = this.$createElement
			if (this.editResult[row.id]) {
				if (this.editResult[row.id].res) {
					return <span class='fx-list-table__cell-span fx-green-font'>修改成功</span>
				} else {
					return <span class='fx-list-table__cell-span fx-warn-font'>修改失败</span>
				}
			}
		},
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				close()
			})
		},
		onClose () {
			this.editFlag && this.$emit('on-refresh')
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.checkData)
		},
		fpSaveDetails (row) {
			const originAmount = this.originData[row.$fxIndex].amount
			if (!this.$fxUtils.compareStrNum(row.amount, originAmount) && !this.saveQueueMap[row.id]) {
				this.$set(this.saveQueueMap, row.id, row)
			} else if (this.$fxUtils.compareStrNum(row.amount, originAmount) && this.saveQueueMap[row.id]) {
				this.$delete(this.saveQueueMap, row.id)
			}
			return Promise.resolve()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.check-link {
	color $fxBlue5
	text-decoration-line underline
}
.table-container {
	display flex
	flex-direction column
	height 65vh
	padding 0 10px
	.item-name {
		margin-bottom 10px
		margin-left 10px
		font-size 13px
		color $fxBlack1
	}
	>>>.bill-state-tag {
		justify-content center
	}
	>>>.list-state-tag__dot {
		margin-right 0
	}
}
</style>
