<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="PickList"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在应领数量为0的品项，请修改数量或删除！</div>
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
				:showColumnFilterBtn="false"
				:fpDeleteDetails="onDeleteClick"
				:showDeleteBtn='isHand'
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

const EDIT_ISHAND_TYPE = ['inHouse', 'outHouse', 'code', 'proCode', 'unit', 'planTotal', 'actualTotal']
const EDIT_NOHAND_TYPE = ['outHouse', 'actualTotal']

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
					prop: 'inHouse.name',
					label: '入库仓库',
					width: '150px'
				},
				{
					prop: 'outHouse.name',
					label: '出库仓库',
					width: '150px'
				},
				{
					prop: 'item.code',
					label: '原料编号',
					width: '150px'
				},
				{ prop: 'item.name', label: '原料名称' },
				{
					prop: 'proItem.code',
					label: '产品编号',
					width: '150px'
				},
				{ prop: 'proItem.name', label: '产品名称' },
				{
					prop: 'itemUnit.name',
					label: '领料单位',
					width: '120px'
				},
				{
					prop: 'composeBom.name',
					label: '产品BOM',
					width: '200px'
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
					width: '120px'
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px'
				}
			],
			tableData: [],
			tableValiDate: [{
				columnProp: 'planTotal',
				rule (row, success, error) {
					if (!row.planTotal) {
						error('应领数量不能为0')
					} else {
						success()
					}
				}
			}],
			tableEditEnterColumnProp: this.isHand ? EDIT_ISHAND_TYPE : EDIT_NOHAND_TYPE,
			itemUnitList: [],
			unitSelectLoading: false,
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
					this.$refs.detailsTable.setRowEdit(this.tableData[0], 'planTotal')
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
				this.$emit('on-finish', 'PickZeroAmount')
			})
		},
		onDetailsRefresh () {
			this.$fxApi('pickingList.pickZeroAmount', this.organDetails.id).then(res => {
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
		onDeleteClick (delData) {
			const deleteItemInfo = this.getDeleteItemInfo(delData)
			const logger = this.$fxLogger.createInfo('production-manage.picking-list.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi('pickingList.delDetailMulity', this.organDetails.id, true)({ data: delData, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.outHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				return `出库仓库:${storeName},品项名称:${name},单位:${itemUnit}`
			}).join(';')
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		planTotalRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`planTotal-${$index}`}
				vModel={row.planTotal}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('planTotal')}
				row={row}
				rowIndex={$index}
				columnProp='planTotal'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}
			>
			</fx-list-cell-input-number>
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
