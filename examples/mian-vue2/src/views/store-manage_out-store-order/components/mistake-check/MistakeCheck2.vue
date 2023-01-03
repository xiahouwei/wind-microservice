<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="2" :type="mistakeStepType"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在品项重复的情况，请确认是否正确！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedTableColumn"
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
export default {
	name: 'mistakeCheckStep2',
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
				{ prop: 'outHouse.code', label: '仓库编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'outHouse.name', label: '仓库名称', width: '120px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.code', label: '品项编号', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', width: '120px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', width: '120px', rowMerge: 'rowspanItemName' },
				{
					prop: 'giftFlag',
					label: '是否赠品',
					rowMerge: 'rowspanItemName',
					fxRender: this.giftFlagRender
				},
				{
					prop: 'selectRadio',
					label: '请选择',
					className: 'table-radio',
					fxRender: this.selectRadioRender
				},
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '出库数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesTaxMoney',
					label: '含税销售金额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					formatter: (row) => {
						return (row.salesTaxRate * 100) + '%'
					}
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '110px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					width: '110px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxRateMoney',
					label: '税额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				}
			],
			tableData: [],
			radioGroupMap: {}
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		computedTableColumn () {
			let column = this.tableColumn
			const moneyPower = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'salesTaxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		mistakeStepType () {
			return this.systemParamAmountNegative ? 'OutStore_AmountNegative' : 'OutStore'
		}
	},
	methods: {
		open (tableData) {
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
				const key = `${item.item.id}.${item.outHouse.id}.${item.giftFlag}`
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
		onSaveReturnClick () {
			this.getSelectDetails().then(this.deleteDetails).then(() => {
				this.dialogVisible = false
			})
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
		giftFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <div>
				{row.giftFlag ? '是' : '否'}
			</div>
		},
		deleteDetails (ids) {
			if (ids.length > 0) {
				const deleteItemInfo = this.getDeleteItemInfo(ids)
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
				return this.$fxApi('outStore.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
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
				const storeName = item.outHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.salesTaxPrice
				return `出库仓库:${storeName},品项名称:${name},单位:${itemUnit},出库数量:${amount},含税销售单价:${taxPrice}`
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
