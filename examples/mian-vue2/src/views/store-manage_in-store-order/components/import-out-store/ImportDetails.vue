<template>
	<w-dialog
		v-model="dialogVisible"
		title="按出库单明细导入生成入库"
		width="1200px"
		positionCenter
		@close="onDialogClose"
	>
		<template slot="sub">
			出库单:
			<w-link
				@click="goToBillBlank"
			>{{importData.sysBillCode}}</w-link>
		</template>
		<div class="table-container">
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:tableColumn="tableColumn"
				:tableEditColumnProp="tableEditColumnProp"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:canAdd="false"
				:showDeleteBtn="false"
				:showColumnFilterBtn="false"
				:fullScreenBtn="false"
				:tableSearchInput="false"
				:fpOnRowEdit="fpOnRowEdit"
			>
				<template slot="btn-tools-left">
					<el-button
						ref="cancelBtn"
						v-fx-tab:focus.detailsTable
						class="order-btn"
						@click="onCancelClick"
					>取消</el-button>
					<fx-button
						ref="saveBtn"
						type="save"
						v-fx-tab:focus.cancelBtn
						class="order-btn"
						@click="onImportClick"
					>确认导入</fx-button>
				</template>
			</fx-details-table>
		</div>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
const EDIT_INPUT_TYPE = ['inHouse', 'inAmount']
export default {
	name: 'importDetails',
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'item.code', label: '品项编号' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{ prop: 'itemUnit.name', label: '单位', width: '100px' },
				{
					prop: 'inHouse',
					label: '本次入库仓库',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.inHouseRender,
					click: this.onCellClick('inHouse')
				},
				{
					prop: 'inAmount',
					label: '本次入库数量',
					width: '120px',
					editColumn: true,
					fxRender: this.inAmountRender,
					click: this.onCellClick('inAmount')
				},
				{
					prop: 'canImportInAmount',
					label: '剩余入库数量',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.canImportInAmount, this.sysPointSize)
					}
				},
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{ prop: 'productDate', label: '生产时间', width: '150px', required: true },
				{ prop: 'memo', label: '明细备注', width: '120px', required: true }
			],
			tableValiDate: [
				{
					columnProp: 'inAmount',
					rule: (row, success, error) => {
						if (!row.inAmount || row.inAmount === '0') {
							error('入库数量不能为0')
						} else if (row.inAmount > row.canImportInAmount) {
							error(`本次入库数量不可大于${row.canImportInAmount}`)
						} else {
							success()
						}
					}
				}],
			tableData: [],
			importData: {},
			tableEditColumnProp: EDIT_INPUT_TYPE,
			inHouseSelectLoading: false,
			inHouseSelectList: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		})
	},
	methods: {
		open (importData) {
			this.importData = importData
			this.tableData = importData.details
			this.$refs.detailsTable && this.$refs.detailsTable.clear()
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onImportClick () {
			this.checkDetailsUnSaving().then(() => {
				this.$refs.detailsTable.getSelectRows().then(this.onSaveHandler)
			})
		},
		onSaveHandler (items) {
			const params = items.map(item => {
				return {
					billId: this.importData.id,
					detailId: item.id,
					inAmount: item.inAmount,
					inHouseId: item.inHouse.id
				}
			})
			let logger = this.$fxLogger.createInfo('store-manage.in-store-order.importOutStoreDetails', { orderData: { sysBillCode: '' }, ...this.createLogInfo(items) })
			return this.$fxApi('inStore.importOutStoreDetails')({ data: params }).then(res => {
				logger = this.$fxLogger.createInfo('store-manage.in-store-order.importOutStoreDetails', { orderData: res, ...this.createLogInfo(items) })
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.success()
				this.dialogVisible = false
			}).catch(error => {
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.error(error.message)
				return new Promise(() => {})
			})
		},
		createLogInfo (items) {
			const details = items.map(item => {
				return `入库仓库名称:${item.inHouse.name},品项名称:${item.item.name},本次入库数量:${item.inAmount}`
			}).join(';')
			return {
				organName: this.importData.inOrganName,
				details
			}
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
				ref={`storeCode-${$index}`}
				value={row.inHouse.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='inHouse'
				dropdownWidth='300px'
				loading={this.inHouseSelectLoading}
				optionRender={this.optionRender}
				cellText={row.inHouse.name}
				selectOptionList={this.inHouseSelectList}
				fpSelectShow={this.onInHouseSelectShow(row)}
				on-on-change={this.onInHouseSelectChange}
			></fx-list-cell-select>
		},
		onInHouseSelectChange (item, row) {
			row.inHouse = item
		},
		onInHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.inHouseSelectLoading = true
					this.getInHouseSelectList(row).then(res => {
						this.inHouseSelectLoading = false
						this.inHouseSelectList = res
						resolve()
					})
				})
			}
		},
		getInHouseSelectList (row) {
			const ids = [row.inHouse.id]
			return this.$fxApi('inStore.getDefaultHouseSelect', this.importData.inOrganId)({ data: ids, loading: false })
		},
		inAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inAmount-${$index}`}
				vModel={row.inAmount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='inAmount'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inAmount, this.sysPointSize)}
			>
			</fx-list-cell-input-number>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		fpOnRowEdit (row, $index, type) {
			this.$refs.detailsTable.setListCellFocus(type)
			return Promise.resolve()
		},
		goToBillBlank () {
			const id = this.importData.id
			const type = this.importData.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		onDialogClose () {
			this.$emit('on-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.table-container {
	padding 0 10px
	height 80vh
}
</style>
