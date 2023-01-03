<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="MoveApply"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在品项重复的情况，请确认是否正确！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedColumn"
				:tableData="tableData"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
				:stripe="false"
				:highlightCurrentRow="false"
				border
			>
			</fx-details-table>
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
	name: 'mistakeCheckStep2',
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
			dialogVisible: false,
			tableColumn: [
				{ prop: 'outHouse.code', label: '出库仓库编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'outHouse.name', label: '出库仓库', rowMerge: 'rowspanItemName' },
				{ prop: 'inHouse.code', label: '入库仓库编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'inHouse.name', label: '入库仓库', rowMerge: 'rowspanItemName' },
				{ prop: 'item.code', label: '品项编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', rowMerge: 'rowspanItemName' },
				{
					prop: 'selectRadio',
					label: '请选择',
					className: 'table-radio',
					fxRender: this.selectRadioRender
				},
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				}
			],
			tableData: [],
			radioGroupMap: {}
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
		open (tableDetails) {
			this.tableData = this.getRepetitive(tableDetails)
			this.radioGroupMap = this.$fxUtils.fromEntries(this.$fxUtils.arrDedup(this.tableData.map(item => {
				return item.radioGroup
			})).map(item => {
				return [item, '']
			}))
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.doLayout()
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				let key = ''
				if (this.currentApplyType.type === 'instore') {
					key = `${item.item.id}.${item.inHouse.id}`
				} else if (this.currentApplyType.type === 'outstore') {
					key = `${item.item.id}.${item.outHouse.id}`
				} else {
					key = `${item.item.id}.${item.inHouse.id}.${item.outHouse.id}`
				}
				if (!repetMap[key]) {
					repetMap[key] = [item]
				} else {
					repetMap[key].push(item)
				}
			})
			const repetDetails = Object.values(repetMap)
			repetDetails.forEach(item => {
				const radioGroup = this.$fxUtils.createUUID()
				item.forEach((_item, _index) => {
					_item.rowspanItemName = !_index ? item.length : 0
					_item.radioGroup = radioGroup
				})
			})
			return repetDetails.reduce((pre, cur) => {
				return pre.concat(cur)
			}, [])
		},
		onSaveReturnClick () {
			this.getSelectDetails().then(this.deleteDetails).then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			if (Object.values(this.radioGroupMap).some(item => {
				return item
			})) {
				this.$fxConfirm({
					message: '当前页面已选中重复品项，是否保存已选中重复品项后再处理下一个异常？',
					option: {
						confirmButtonText: '是',
						cancelButtonText: '否'
					}
				}).then(() => {
					this.getSelectDetails().then(this.deleteDetails).then(() => {
						this.dialogVisible = false
						this.$emit('on-finish', 'Repeat')
						return Promise.resolve()
					})
				}).catch(() => {
					this.dialogVisible = false
					this.$emit('on-finish', 'Repeat')
				})
			} else {
				this.dialogVisible = false
				this.$emit('on-finish', 'Repeat')
			}
		},
		getSelectDetails () {
			return new Promise(resolve => {
				const delIds = []
				const radioGroupIds = Object.keys(this.radioGroupMap)
				radioGroupIds.forEach(item => {
					if (this.radioGroupMap[item]) {
						const selectedIds = this.tableData.filter(_item => _item.radioGroup === item && _item.id !== this.radioGroupMap[item]).map(_item => _item.id)
						delIds.push(...selectedIds)
					}
				})
				resolve(delIds)
			})
		},
		selectRadioRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-radio
				vModel={this.radioGroupMap[row.radioGroup]}
				label={row.id}
				canCancel
			>
			</fx-radio>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		deleteDetails (ids) {
			if (!ids.length) return Promise.resolve()
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delCheckDetailsMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				this.$fxMessage.success('操作成功')
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
