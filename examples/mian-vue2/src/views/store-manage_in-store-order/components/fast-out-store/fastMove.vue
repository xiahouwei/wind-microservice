<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="选择快速调拨品项" heightFullscreen @close="onClose">
		<div class="create-organ">
			<div class="list-container">
				<fx-details-table
					ref="detailsTable"
					:tableColumn="tableColumn"
					:tableData="tableData"
					:tableValiDate="tableValiDate"
					:selectedRows="defaultTableSelect"
					:fpBeforeRowEdit="beforeRowEdit"
					:searchProps="searchProps"
					:tableEditColumnProp="tableEditColumnProp"
					:showColumnFilterBtn="false"
					:canAdd="false"
					:showDeleteBtn="false"
					:fullScreenBtn="false"
				>
				</fx-details-table>
			</div>
		</div>
		<template slot="footer">
			<el-button type="primary" @click="onSaveClick">确认出库</el-button>
			<el-button @click="onCancelClick">取消</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
const EDIT_INPUT_TYPE = ['quickAmount', 'quickHouseId']
const SEARCH_PROPS = ['storeCode', 'inHouse.name', 'code', 'item.name']
export default {
	name: 'fast-out-store',
	props: {
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
		}
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableColumn: [
				{ prop: 'inHouse.code', label: '仓库编号', required: true },
				{ prop: 'inHouse.name', label: '仓库名称', required: true },
				{ prop: 'item.code', label: '品项编号', required: true },
				{ prop: 'item.name', label: '品项名称', required: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{ prop: 'itemUnit.name', label: '单位', required: true },
				{ prop: 'amount', label: '本次入库数量', required: true },
				{
					prop: 'quickAmount',
					label: '快速调拨数量',
					required: true,
					editColumn: true,
					fxRender: this.quickAmountRender,
					click: this.onCellClick('quickAmount'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'quickHouseId',
					label: '调拨入库仓库',
					required: true,
					editColumn: true,
					fxRender: this.quickHouseIdRender,
					click: this.onCellClick('quickHouseId')
				}
			],
			tableData: [],
			defaultTableSelect: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			tableEditColumnProp: EDIT_INPUT_TYPE,
			searchProps: SEARCH_PROPS,
			houseSelectLoading: false,
			fastMoveInHouseList: [],
			tableValiDate: [{
				columnProp: 'quickAmount',
				rule: (row, success, error) => {
					if (row.quickAmount === 0) {
						error('快速调拨数量不能为0')
					} else if (row.quickAmount > row.amount) {
						error('快速调拨数量不能大于本次入库数量')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'quickHouseId',
				rule: (row, success, error) => {
					if (row.quickHouseId === '') {
						error('调拨入库仓库不能为空')
					} else {
						success()
					}
				}
			}]
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		})
	},
	methods: {
		open () {
			const tableData = this.$fxUtils.deepClone(this.tableDetails)
			tableData.forEach(item => {
				item.quickAmount = 0
				item.quickHouseId = ''
				item.fastMoveInHouse = {}
			})
			this.tableData = tableData
			this.dialogVisible = true
		},
		onClose () {
			this.defaultTableSelect = []
			this.$refs.detailsTable.clear()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		beforeRowEdit (row) {
			const hasRow = this.defaultTableSelect.find(item => {
				return row.id === item.id
			})
			if (!hasRow) {
				this.defaultTableSelect.push(row)
			}
			return Promise.resolve()
		},
		onSaveClick () {
			return this.checkDetailsUnSaving().then(() => {
				return this.$refs.detailsTable.getSelectRows(false).then(res => {
					const selectRows = this.$fxUtils.deepClone(res)
					selectRows.forEach(item => {
						delete item.isEdit
						delete item.$fxCalculation
						delete item.$fxIndex
					})
					if (selectRows.length <= 0) {
						return this.$fxMessage.warning('请选择快速调拨品项')
					}
					const isZero = selectRows.some(item => {
						return item.quickAmount === 0
					})
					if (isZero) {
						return this.$fxMessage.warning('所选品项快速调拨数量不能为0')
					}
					const isEmpty = selectRows.some(item => {
						return item.quickHouseId === ''
					})
					if (isEmpty) {
						return this.$fxMessage.warning('所选品项调拨入库仓库不能为空')
					}
					const data = this.$fxUtils.deepClone(this.organDetails)
					data.details = res
					const logger = this.$fxLogger.createInfo('store-manage.in-store-order.fastMove', { selectRows, orderData: this.organDetails })
					return this.$fxApi('inStore.fastMove')({ data, logger }).then(res => {
						this.$fxGoToBillBlank(res.billClass, { id: res.id })
						return Promise.resolve()
					})
				})
			})
		},
		quickAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`quickAmount-${$index}`}
				vModel={row.quickAmount}
				isEdit={row.isEdit}
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.quickAmount, this.sysPointSize)}
				row={row}
				rowIndex={$index}
				columnProp='quickAmount'
			></fx-list-cell-input-number>
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		quickHouseIdRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`quickHouseId-${$index}`}
				value={row.quickHouseId}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='quickHouseId'
				dropdownWidth='300px'
				loading={this.houseSelectLoading}
				optionRender={this.optionRender}
				cellText={row.fastMoveInHouse.name}
				selectOptionList={this.fastMoveInHouseList}
				fpSelectShow={this.onHouseSelectShow(row)}
				on-on-change={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		onStoreCodeSelectChange (item, row) {
			row.quickHouseId = item.id
			row.fastMoveInHouse = item
		},
		onHouseSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.houseSelectLoading = true
					this.getInStore(row).then(res => {
						this.houseSelectLoading = false
						this.fastMoveInHouseList = res
						resolve()
					})
				})
			}
		},
		async getInStore (row) {
			const ids = [row.inHouse.id]
			const inStore = await this.$fxApi('inStore.getFastMoveValidStoreList', this.organDetails.inOrgan.id, row.inHouse.id)({ data: ids })
			return Promise.resolve(inStore)
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
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
	flex-direction: row;
	overflow: auto;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
	}
}
.flex-cell{
	display: flex
	.flex-part {
		display inline-block
		width 100px
	}
	.flex-long {
		flex 1
		display inline-block
	}
}
</style>
