<template>
	<w-dialog
		v-model="dialogVisible"
		width="1000px"
		title="关联品项档案"
		heightFullscreen
	>
		<div class="right-tool">
			<w-input
				v-model='itemFilter'
				class='item-filter'
				v-fx-enter="refresh"
				clearable
			></w-input>
			<el-button
				ref="saveBtn"
				type="primary"
				@click="refresh"
			>查询</el-button>
		</div>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:selectMulity='false'
			:showColumnFilterBtn='false'
			:defaultSortParam="defaultSortParam"
			rowKey='unitId'
			@on-page-change="onPageChange"
		>
		</fx-list-virtual-table>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				@click="onSaveClick"
			>关联并导入</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'itemArchive',
	data () {
		return {
			dialogVisible: false,
			itemFilter: '',
			tableColumn: [
				{ prop: 'itemCode', label: '编码' },
				{ prop: 'itemName', label: '品项名称' },
				{ prop: 'unitName', label: '单位' },
				{ prop: 'refSellingPrice', label: '建议售价' },
				{ prop: 'refCostPrice', label: '成本价' }
			],
			tableData: [],
			defaultSortParam: { 'item.code': 'asc' },
			row: {}
		}
	},
	methods: {
		open (row) {
			this.row = row
			this.itemFilter = ''
			this.dialogVisible = true
			this.$nextTick(() => {
				this.refresh()
			})
		},
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		getSearchParams () {
			const params = {
				'item.name': this.itemFilter,
				'item.code': this.itemFilter,
				'item.pinyin': this.itemFilter,
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('relateItemList')(params)
			}
		},
		async getListData () {
			return this.$fxApi(`${apiName}.getItemList`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onPageChange () {
			return this.getListData()
		},
		async onSaveClick () {
			const res = await this.$refs.listTable.getSingleSelectedRow()
			const skuRes = await this.importSku(res)
			this.row.sku_id = skuRes.id
			this.row.sku_unit_name = skuRes.unit
			this.row.sku_name = skuRes.name
			this.row.sku_code = skuRes.code
			this.row.filelist = skuRes.pic || []
			this.row.pic = skuRes.pic ? skuRes.pic[0] : ''
			const unitRes = await this.getSkuUnitlist(skuRes.id)
			this.row.itemUnitList = unitRes
			const unit = unitRes.find(item => {
				return item.id === skuRes.unit_id
			})
			this.row.sku_cost_price = unit.cost_price
			this.row.price = unit.sale_price
			this.row.sku_unit_id = skuRes.unit_id
			this.row.exchange = `1 ${unit.name} = ${unit.ratio} ${unit.main_unit_name}`
			this.onCancelClick()
		},
		importSku (data) {
			return this.$fxApi(`${apiName}.importSku`)({
				data: [{
					itemId: data.itemId,
					unitId: data.unitId
				}]
			}).then(res => {
				return Promise.resolve(res)
			})
		},
		getSkuUnitlist (id) {
			return this.$fxApi(`${apiName}.getSkuUnitlist`, id).then(res => {
				return Promise.resolve(res)
			})
		},
		onCancelClick () {
			this.dialogVisible = false
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
}
.right-tool {
	display: flex
	justify-content: flex-end
	align-items center
	.item-filter {
		width: 150px
		margin-right: 20px
	}
}
</style>
