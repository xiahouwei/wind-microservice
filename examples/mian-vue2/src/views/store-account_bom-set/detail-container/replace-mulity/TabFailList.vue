<template>
	<div class="organ-manage-container">
		<fx-details-table
			ref="detailsTable"
			:tableSearchInput='false'
			:tableColumn="computedColumn"
			:tableData="tableData"
			:fullScreenBtn='false'
			:canAdd="false"
			:showSummary="false"
			:showMulitySettingBtn="false"
			:showDeleteBtn="false"
			:selectable="false"
			:showColumnFilterBtn="false"
		>
		</fx-details-table>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'tabFailList',
	props: {
		type: String,
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'name', label: '菜品/商品名称', renderHeader: this.renderNameHeader },
				{ prop: 'bomName', label: 'BOM名称' },
				{ prop: 'itemName', label: '一级配料名称' },
				{ prop: 'itemUnit', label: '一级配料单位' },
				{ prop: 'spec', label: '规格', width: '100px' },
				{ prop: 'materialDosage', label: '净料用量' },
				{
					prop: 'materialRate',
					label: '净料率',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.materialRate * 100, this.sysMoneyPointSize) + '%'
					}
				},
				{ prop: 'rawMaterialDosage', label: '毛料用量' },
				{
					prop: 'outputYield',
					label: '标准产出率',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.outputYield * 100, this.sysMoneyPointSize) + '%'
					}
				},
				{
					prop: 'ingredientsType',
					label: '配料类型',
					width: '180px',
					formatter: (row) => {
						return this.getNameById(row.ingredientsType, this.ingredientsTypeList)
					}
				},
				{ prop: 'beginDate', label: '生效日期', width: '200px' },
				{ prop: 'endDate', label: '失效日期', width: '200px' },
				{ prop: 'failReason', label: '失败原因' }
			],
			columnProp: {
				food_bom: ['name', 'bomName', 'itemName', 'itemUnit', 'spec', 'materialDosage', 'materialRate', 'rawMaterialDosage', 'ingredientsType', 'beginDate', 'endDate', 'failReason'],
				compose_bom: ['name', 'bomName', 'itemName', 'itemUnit', 'spec', 'materialDosage', 'materialRate', 'rawMaterialDosage', 'beginDate', 'endDate', 'failReason'],
				split_bom: ['name', 'bomName', 'itemName', 'itemUnit', 'spec', 'outputYield', 'beginDate', 'endDate', 'failReason']
			},
			ingredientsTypeList: this.$fxTypeMiddleware.getCommonTypeList('ingredientsType')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		computedColumn () {
			return this.tableColumn.filter(item => {
				return this.columnProp[this.type].includes(item.prop)
			})
		}
	},
	methods: {
		renderNameHeader (h, column, index) {
			const headName = {
				food_bom: '菜品/商品名称',
				compose_bom: '组合BOM名称',
				split_bom: '拆分BOM名称'
			}
			const content = headName[this.type]
			h = this.$createElement
			return <div>{ content }</div>
		},
		getNameById (id, list) {
			if (!id && id !== 0) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.name : ''
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1;
	display:flex
	flex-direction: column
	overflow: auto
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
	.tools-left {
		flex: 1
	}
}
</style>
