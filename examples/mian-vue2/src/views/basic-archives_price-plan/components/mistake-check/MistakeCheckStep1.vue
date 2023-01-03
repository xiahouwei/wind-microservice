<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="PricePlan"></fx-mistake-check-step>
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
				v-if="actionType === 'check'"
				v-fx-tab:focus.saveReturnBtn
				@click="onSaveClick"
			>{{actionText}}</fx-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'mistakeCheckStep1',
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
				{ prop: 'item.code', label: '品项编号', width: '213px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', width: '180px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', width: '180px', rowMerge: 'rowspanItemName' },
				{
					prop: 'selectRadio',
					label: '请选择',
					width: '180px',
					className: 'table-radio',
					fxRender: this.selectRadioRender
				},
				{ prop: 'itemUnit.name', label: '单位', width: '180px' },
				{ prop: 'strategy', label: '价格策略', width: '180px', fxRender: this.strategyRender }
			],
			tableData: [],
			radioGroupMap: {}
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
				if (this.actionType === 'check') {
					this.$fxUtils.vDoRefFocus(this, 'saveBtn')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'saveReturnBtn')
				}
			})
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				const key = `${item.item.id}`
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
					})
					resolve(selectedDetails)
				}
			})
		},
		selectRadioRender (h, { row, $index }) {
			h = this.$createElement
			return <el-radio
				vModel={this.radioGroupMap[row.radioGroup]}
				label={row.id}
			>
			</el-radio>
		},
		strategyRender (h, { row, $index }) {
			h = this.$createElement
			return <div>
				{this.strategyText(row)}
			</div>
		},
		strategyText (row) {
			if (this.$fxTypeMiddleware.isCommonType('strategyType')(['fixed'])(row.strategy)) {
				return '固定价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['cost'])(row.strategy)) {
				return '成本价'
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['proportion'])(row.strategy)) {
				return `成本 + ${row.price}%`
			} else if (this.$fxTypeMiddleware.isCommonType('strategyType')(['price'])(row.strategy)) {
				return `成本 + ${row.price}`
			} else {
				return ''
			}
		},
		deleteDetails (select) {
			const ids = select.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.mistakeDeleteDetails', { name: this.organDetails.name, select })
			return this.$fxApi('planPrice.delCheckDetailsMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
				this.$fxMessage.success('操作成功')
				return Promise.resolve(res)
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
