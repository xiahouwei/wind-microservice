<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="PickList"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">
				<span class="switch-warn">注：以下明细中，存在品项重复的情况，请确认是否需要删除或合并！</span>
				<div style="text-align: right" class="switch-warn">
					<el-radio v-model="repeatItemFlag" :label="0">删除选中</el-radio>
					<el-radio v-model="repeatItemFlag" :label="1">合并全部</el-radio>
				</div>
			</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:selectable="false"
				:showTools="false"
				:stripe="false"
				:canAdd="false"
				:highlightCurrentRow="false"
				border
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
import { mapGetters, mapState } from 'vuex'
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
					width: '150px',
					rowMerge: 'rowspanItemName'
				},
				{
					prop: 'outHouse.name',
					label: '出库仓库',
					width: '150px',
					rowMerge: 'rowspanItemName'
				},
				{
					prop: 'item.code',
					label: '原料编号',
					width: '150px',
					rowMerge: 'rowspanItemName'
				},
				{ prop: 'item.name', label: '原料名称', rowMerge: 'rowspanItemName' },
				{
					prop: 'selectRadio',
					label: '请选择',
					className: 'table-radio',
					fxRender: this.selectRadioRender
				},
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
			repeatItemFlag: 0,
			tableData: [],
			radioGroupMap: {},
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
		computedTableColumn () {
			return this.tableColumn
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType)
		}

	},
	methods: {
		open (tableData) {
			this.repeatItemFlag = 0
			this.tableData = this.getRepetitive(tableData)
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
		selectRadioRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-radio
				vModel={this.radioGroupMap[row.radioGroup]}
				label={row.id}
				canCancel
			>
			</fx-radio>
		},
		onSaveReturnClick () {
			if (!this.repeatItemFlag) {
				if (Object.values(this.radioGroupMap).some(item => {
					return item
				})) {
					this.$fxConfirm({
						message: '当前页面已选中重复品项，是否删除已选中重复品项后再处理下一个异常？',
						option: {
							confirmButtonText: '是',
							cancelButtonText: '否'
						}
					}).then(() => {
						this.getSelectDetails().then(this.deleteDetails).then(() => {
							this.dialogVisible = false
						})
					}).catch(() => {
						this.dialogVisible = false
					})
				} else {
					this.dialogVisible = false
				}
			} else {
				this.$fxConfirm({
					message: '是否合并全部？',
					option: {
						confirmButtonText: '是',
						cancelButtonText: '否'
					}
				}).then(() => {
					return this.$fxApi('pickingList.saveMergeOrder', this.organDetails.id).then(res => {
						this.dialogVisible = false
					})
				}).catch(() => {
					this.dialogVisible = false
				})
			}
		},
		getSelectDetails () {
			return new Promise(resolve => {
				const delIds = []
				const radioGroupIds = Object.keys(this.radioGroupMap)
				radioGroupIds.forEach(item => {
					if (this.radioGroupMap[item]) {
						const selectedIds = this.tableData.filter(_item => _item.radioGroup === item && _item.id === this.radioGroupMap[item]).map(_item => _item.id)
						delIds.push(...selectedIds)
					}
				})
				resolve(delIds)
			})
		},
		onSaveClick () {
			if (!this.repeatItemFlag) {
				if (Object.values(this.radioGroupMap).some(item => {
					return item
				})) {
					this.$fxConfirm({
						message: '当前页面已选中重复品项，是否删除已选中重复品项后再处理下一个异常？',
						option: {
							confirmButtonText: '是',
							cancelButtonText: '否'
						}
					}).then(() => {
						this.getSelectDetails().then(this.deleteDetails).then(() => {
							this.dialogVisible = false
							this.$emit('on-finish', 'RepeatItem')
							return Promise.resolve()
						})
					}).catch(() => {
						this.dialogVisible = false
						this.$emit('on-finish', 'RepeatItem')
					})
				} else {
					this.dialogVisible = false
					this.$emit('on-finish', 'RepeatItem')
				}
			} else {
				this.$fxConfirm({
					message: '是否合并全部？',
					option: {
						confirmButtonText: '是',
						cancelButtonText: '否'
					}
				}).then(() => {
					return this.$fxApi('pickingList.saveMergeOrder', this.organDetails.id).then(res => {
						this.dialogVisible = false
						this.$emit('on-finish', 'RepeatItem')
						return Promise.resolve()
					})
				}).catch(() => {
					this.dialogVisible = false
					this.$emit('on-finish', 'RepeatItem')
				})
			}
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
		deleteDetails (delData) {
			if (delData.length > 0) {
				const deleteItemInfo = this.getDeleteItemInfo(delData)
				const logger = this.$fxLogger.createInfo('production-manage.picking-list.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
				return this.$fxApi('pickingList.delDetailMulity', this.organDetails.id, true)({ data: delData, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return Promise.resolve()
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const inHouse = item.inHouse.name
				const outHouse = item.outHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const actualTotal = item.actualTotal
				const planTotal = item.planTotal
				return `入库仓库:${inHouse},出库仓库:${outHouse},原料名称:${name},单位:${itemUnit},应领数量:${planTotal},已领数量:${actualTotal}`
			}).join(';')
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
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

		.switch-warn {
			display: inline-block
			width:50%
		}
	}
}
</style>
