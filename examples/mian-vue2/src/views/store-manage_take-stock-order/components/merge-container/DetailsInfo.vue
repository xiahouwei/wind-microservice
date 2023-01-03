<template>
	<w-collapse v-model="collapseVisible" contentHeight="400px" disabled :showArrow="false" title="重复品项">
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:canAdd="false"
				:selectable="false"
				:showColumnFilterBtn="false"
				:showDeleteBtn="false"
				:fullScreenBtn="false"
				:stripe="false"
				:highlightCurrentRow="false"
				border
			>
			<div slot="empty">无重复品项，无需操作该区域数据</div>
			</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'detailsInfo',
	props: {
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		},
		visibleFlag: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{ prop: 'item.name', label: '品项名称', width: '120px', rowMerge: 'rowspanItemName' },
				{ prop: 'item.spec', label: '规格', rowMerge: 'rowspanItemName' },
				{
					prop: 'mergeHandle',
					label: '处理方式',
					fxRender: this.mergeHandlerRender,
					width: '160px',
					rowMerge: 'rowspanItemName'
				},
				{
					prop: 'selectRadio',
					label: '来源盘点单',
					fxRender: this.selectRadioRender,
					width: '160px'
				},
				{ prop: 'batchCode', label: '批次号', width: '200px' },
				{
					prop: 'checkUnit1',
					label: '盘点单位1',
					width: '120px',
					required: true,
					formatter: (row) => {
						return (row.checkUnit1 && row.checkUnit1.name) || ''
					}
				},
				{
					prop: 'realCheckAmount1',
					label: '实盘数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount1, this.sysPointSize)
					}
				},
				{
					prop: 'checkUnit2',
					label: '盘点单位2',
					width: '120px',
					required: true,
					formatter: (row) => {
						return (row.checkUnit2 && row.checkUnit2.name) || ''
					}
				},
				{
					prop: 'realCheckAmount2',
					label: '实盘数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount2, this.sysPointSize)
					}
				},
				{
					prop: 'modifyDate',
					label: '盘点时间',
					required: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				}
			],
			radioGroupMap: {}
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		tableData () {
			return this.getRepetitive(this.tableDetails)
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (val) {
					this.getRadioGroupMap()
				}
			}
		}
	},
	methods: {
		getRadioGroupMap () {
			this.radioGroupMap = this.$fxUtils.fromEntries(this.$fxUtils.arrDedup(this.tableData.map(item => {
				return item.radioGroup
			})).map(item => {
				return [item, { id: '', mergeWay: 0 }]
			}))
		},
		getRepetitive (tableDetails) {
			const repetMap = {}
			tableDetails.forEach(item => {
				const key = `${item.item.id}.${item.batchCode}`
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
		getSelectDetails () {
			return new Promise(resolve => {
				if (Object.values(this.radioGroupMap).some(item => {
					return item.mergeWay ? false : !item.id
				})) {
					this.$fxMessage.warning('请选择需要唯一的重复品项')
				} else {
					Object.keys(this.radioGroupMap).forEach(item => {
						const selectedItem = this.tableData.find(_item => {
							return _item.radioGroup === item
						})
						this.radioGroupMap[item].itemId = selectedItem.item.id || ''
						this.radioGroupMap[item].batchCode = selectedItem.batchCode || ''
					})
					resolve(Object.values(this.radioGroupMap))
				}
			})
		},
		selectRadioRender (h, { row, $index }) {
			h = this.$createElement
			return <el-radio
				vModel={this.radioGroupMap[row.radioGroup].id}
				label={row.id}
				disabled={!!this.radioGroupMap[row.radioGroup].mergeWay}
			>
				{row.sysBillCode}
			</el-radio>
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		mergeHandlerRender (h, { row, $index }) {
			h = this.$createElement
			return <el-radio-group
				vModel={this.radioGroupMap[row.radioGroup].mergeWay}
				on-change={flag => this.onMergeWayChange(flag, row)}
			>
				<el-radio label={ 1 } > 合并 </el-radio>
				<el-radio label={ 0 } > 唯一 </el-radio>
			</el-radio-group>
		},
		onMergeWayChange (flag, row) {
			if (flag) {
				this.radioGroupMap[row.radioGroup].id = ''
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
