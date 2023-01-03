<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="2" type="OrderPlan"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：相同品项可从多个卖家采购，若开启自动分派，则由于系统不确定本次从哪个卖家采购，将导致无法执行自动分派，需手动选择卖家！</div>
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
			>返回</el-button>
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
				{ prop: 'item.code', label: '品项编号', width: '120px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'sellerOrganInfo.name', label: '卖方机构', width: '150px' },
				{ prop: 'unit.name', label: '单位', width: '80px' },
				{
					prop: 'stockWay',
					label: '订货方式',
					width: '100px',
					formatter: (row) => {
						return row.stockWay === 1 ? '直发' : '越库'
					}
				},
				{
					prop: 'crossStockText',
					label: '越库实际供货方',
					width: '180px',
					formatter: (row) => {
						return row.crossOrgans ? row.crossOrgans.map(item => item.crossOrganName).join('，') : '/'
					}
				},
				{
					prop: 'roundingWay',
					label: '订货倍数',
					width: '100px',
					formatter: (row) => {
						return row.roundingWay ? `按${row.roundingNum}倍采购` : '不限制'
					}
				},
				{
					prop: 'supperLimit',
					label: '订货上限',
					width: '100px',
					formatter: (row) => {
						return row.supperLimit ? `上限： ${row.supperLimit}` : '无上限'
					}
				},
				{
					prop: 'lowerLimit',
					label: '订货下限',
					width: '100px',
					formatter: (row) => {
						return row.lowerLimit ? `下限： ${row.lowerLimit}` : '无下限'
					}
				},
				{
					prop: 'mustFlag',
					label: '必订品项',
					width: '80px',
					formatter: (row) => {
						return row.mustFlag ? '必订' : '非必订'
					}
				},
				{
					prop: 'stockCycleText',
					label: '订货周期',
					width: '150px',
					formatter: (row) => {
						switch (row.cycleWay) {
						case 1 :
							return '每天采购'
						case 2 :
							return `每周${row.stockCycle}采购`
						case 3 :
							return `每月${row.stockCycle}日采购`
						case 4 :
							return '月末采购'
						case 5 :
							return `每隔${row.stockCycle}天采购`
						}
					}
				},
				{
					prop: 'arrivalCycle',
					label: '到货周期',
					width: '100px',
					formatter: (row) => {
						return row.arrivalCycle + '小时'
					}
				},
				{
					prop: 'enableFlag',
					label: '启停用',
					width: '80px',
					formatter: (row) => {
						return row.enableFlag ? '已启用' : '已停用'
					}
				}
			],
			tableData: []
		}
	},
	methods: {
		open (tableDetails) {
			this.tableData = this.getRepetitive(tableDetails)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				const key = `${item.itemId}`
				if (!repetMap[key]) {
					repetMap[key] = [item]
				} else {
					repetMap[key].push(item)
				}
			})
			const repetDetails = Object.values(repetMap)
			repetDetails.forEach(item => {
				item.forEach((_item, _index) => {
					_item.rowspanItemName = !_index ? item.length : 0
				})
			})
			return repetDetails.reduce((pre, cur) => {
				return pre.concat(cur)
			}, [])
		},
		onSaveReturnClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.dialogVisible = false
			this.$emit('on-finish', 'RepeatWarn')
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
