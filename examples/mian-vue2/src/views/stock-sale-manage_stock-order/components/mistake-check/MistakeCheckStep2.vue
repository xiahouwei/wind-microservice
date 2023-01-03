<template>
	<w-dialog v-model="dialogVisible" width="1400px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="2" type="StockOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在重复品项，请仅保留唯一项！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
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
import { apiName } from '../../Index.vue'
import { mapState } from 'vuex'
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
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'inHouse.name', label: '仓库名称', rowMerge: 'rowspanItemName' },
				{ prop: 'item.code', label: '品项编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', rowMerge: 'rowspanItemName' },
				{ prop: 'giftFlag', label: '是否赠品', rowMerge: 'rowspanItemName', fxRender: this.giftFlagRender },
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
		})
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
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				const key = `${item.item.id}.${item.inHouse.id}.${item.giftFlag}`
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
			this.getSelectDetails().then(this.deleteDetails).then(() => {
				this.dialogVisible = false
				this.$emit('on-finish')
			})
		},
		getSelectDetails () {
			return new Promise(resolve => {
				if (Object.values(this.radioGroupMap).some(item => {
					return !item
				})) {
					this.$fxMessage.warning('请选择重复品项')
				} else {
					const selectedIds = Object.values(this.radioGroupMap)
					const selectedDetails = this.tableData.filter(item => {
						return !selectedIds.includes(item.id)
					}).map(item => {
						return item.id
					})
					resolve(selectedDetails)
				}
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
		giftFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <div>
				{row.giftFlag ? '是' : '否'}
			</div>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		deleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delCheckDetailsMulity`)({ data: ids, logger }).then(res => {
				this.$fxMessage.success('操作成功')
				return Promise.resolve(res)
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
				const giftFlag = item.giftFlag ? '赠品' : '非赠品'
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},采购数量:${amount},赠品标记:${giftFlag}`
			}).join(';')
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
