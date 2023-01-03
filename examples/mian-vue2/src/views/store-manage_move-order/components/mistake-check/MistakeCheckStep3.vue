<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1200px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="2" type="MoveApply"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项为当前仓库未关联品项，请手动全部删除！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedColumn"
				:tableData="tableData"
				:mainId="organDetails.id"
				:canAdd="false"
				:showColumnFilterBtn="false"
				:fpDeleteDetails="onDeleteClick"
				@on-details-refresh="getRel"
			></fx-details-table>
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
import { apiName } from '../../Index.vue'
export default {
	name: 'mistakeCheckStep3',
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
		actionType: String
	},
	data () {
		return {
			collapseVisible: true,
			dialogVisible: false,
			tableColumn: [
				{ prop: 'outHouse.code', label: '出库仓库编号' },
				{ prop: 'outHouse.name', label: '出库仓库' },
				{ prop: 'inHouse.code', label: '入库仓库编号' },
				{ prop: 'inHouse.name', label: '入库仓库' },
				{ prop: 'item.code', label: '品项编号' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '调拨数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '100',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				}
			],
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		computedColumn () {
			let _column = null
			switch (this.currentApplyType.type) {
			case 'instore':
				_column = this.deleteOutStoreColumn(this.tableColumn)
				break
			case 'outstore' :
				_column = this.deleteInStoreColumn(this.tableColumn)
				break
			case 'inside' :
				_column = this.tableColumn
				break
			default :
				_column = this.tableColumn
			}
			return _column
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.doLayout()
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		onSaveReturnClick () {
			if (this.tableData.length !== 0) {
				this.$fxMessage.warning('请删除全部仓库未关联品项')
			} else {
				this.dialogVisible = false
			}
		},
		onSaveClick () {
			if (this.tableData.length !== 0) {
				this.$fxMessage.warning('请删除全部仓库未关联品项')
			} else {
				this.dialogVisible = false
				this.$emit('on-finish')
			}
		},
		getRel () {
			return this.$fxApi(`${apiName}.getRel`, this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
			})
		},
		onDeleteClick (delData) {
			const deleteItemInfo = this.getDeleteItemInfo(delData)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: delData, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const assistUnitAmount = item.assistUnitAmount || ''
				return `品项名称:${name},单位:${itemUnit},调拨数量:${amount},辅助数量:${assistUnitAmount}`
			}).join(';')
		},
		deleteInStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'inHouse.code'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
		},
		deleteOutStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'outHouse.code'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
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
