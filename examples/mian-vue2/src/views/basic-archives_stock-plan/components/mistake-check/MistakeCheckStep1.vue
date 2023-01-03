<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="OrderPlan"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：相同品项不允许出现买方卖方相同的情况，检测到以下数据不合法，请从中选择一项！</div>
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
				{ prop: 'item.code', label: '品项编号', width: '120px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.name', label: '品项名称', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', width: '150px', rowMerge: 'rowspanItemName' },
				{ prop: 'sellerOrganInfo.name', label: '卖方机构', width: '150px', rowMerge: 'rowspanItemName' },
				{
					prop: 'selectRadio',
					label: '请选择',
					width: '80px',
					className: 'table-radio',
					fxRender: this.selectRadioRender
				},
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
			tableData: [],
			radioGroupMap: {}
		}
	},
	computed: {
		isRadioDisabled () {
			return row => {
				return (this.tableData.find(item => {
					return item.id === this.radioGroupMap[row.radioGroup]
				}) || {}).useFlag
			}
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
			this.setDefaultSelect()
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				const key = `${item.itemId}.${item.sellerOrgan}`
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
		setDefaultSelect () {
			this.tableData.forEach(item => {
				if (item.useFlag) {
					this.radioGroupMap[item.radioGroup] = item.id
				}
			})
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
				disabled={this.isRadioDisabled(row)}
				label={row.id}
			>
			</el-radio>
		},
		deleteDetails (select) {
			const ids = select.map(item => {
				return item.id
			})
			const deleteItemInfo = this.getDeleteItemInfo(select)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.mistakeDeleteDetails', { deleteItemInfo, name: this.organDetails.name })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger, autoSuccessMsg: false }).then(res => {
				this.$fxMessage.success('操作成功')
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (select) {
			return select.map(item => {
				const crossOrganNames = item.crossStockText || '/'
				const stockWay = item.stockWay === 1 ? '直发' : '越库'
				const sellerName = item.sellerOrganInfo.name
				return `卖方机构:${sellerName},品项名称:${item.item.name},订货方式:${stockWay},越库实际供货方:${crossOrganNames}`
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
