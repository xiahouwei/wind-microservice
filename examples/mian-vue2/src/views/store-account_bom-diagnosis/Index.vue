<template>
	<w-app-container>
		<fx-page-header title="BOM成本卡诊断"></fx-page-header>
		<w-app-container direction="column" class="fx-page-first-container">
			<el-form size="mini" label-width="50px" inline label-position="left">
					<el-form-item label="菜品">
						<w-select-mulity
							v-model="foodBomIds"
							:optionlist="foodsSelectList"
							:showEmpty='false'
							:loading="foodSelectLoading"
							class="form-input"
							@visible-change="onFoodSelectVisibleChange"
						>
						</w-select-mulity>
					</el-form-item>
					<el-button type="primary" @click="onSearchClick">查询</el-button>
			</el-form>
			<fx-list-virtual-table
				ref="listTable"
				:tableColumn="tableColumn"
				:listData="tableData"
				:selectable="false"
				:selectAndIndexFixed="false"
				:showTools="false"
				:stripe="false"
				:highlightCurrentRow="false"
				:showPagination="false"
				:loading="loading"
				:rowStyle="rowStyle"
				showIndex
				border
			>
			</fx-list-virtual-table>
		</w-app-container>
	</w-app-container>
</template>
<script>
export const apiName = 'bomDiagnosis'
export default {
	name: 'bomDiagnosis',
	data () {
		return {
			foodBomIds: [],
			foodsSelectList: [],
			tableColumn: [
				{ prop: 'code', label: '菜品编号', width: '120px', rowMerge: 'foodRowSpan', align: 'center', headerAlign: 'center' },
				{ prop: 'name', label: '菜品名称', width: '120px', rowMerge: 'foodRowSpan', align: 'center', headerAlign: 'center' },
				{ prop: 'consumptionMethod', label: '菜品冲减方式', width: '120px', rowMerge: 'foodRowSpan', align: 'center', headerAlign: 'center' },
				{ prop: 'unitName', label: '菜品单位名称', width: '120px', rowMerge: 'unitRowSpan', align: 'center', headerAlign: 'center' },
				{
					prop: 'unitBomName',
					label: '菜品单位BOM名称',
					width: '120px',
					rowMerge: 'unitRowSpan',
					align: 'center',
					headerAlign: 'center',
					formatter: (row) => {
						return row.unitBomName || '---'
					}
				},
				{
					prop: 'pmName',
					label: '做法名称',
					width: '120px',
					align: 'center',
					headerAlign: 'center',
					formatter: (row) => {
						return row.pmName || '---'
					}
				},
				{
					prop: 'pmBomName',
					label: '做法BOM名称',
					width: '120px',
					align: 'center',
					headerAlign: 'center',
					formatter: (row) => {
						return row.pmBomName || '---'
					}
				},
				{ prop: 'diagnosisInfo', label: '检测结果', headerAlign: 'center', width: '500px', fxRender: this.diagnosisInfoRender }
			],
			tableData: [],
			foodSelectLoading: false,
			loading: false
		}
	},
	mounted () {
		this.onBomDiagnose()
	},
	methods: {
		getFoodsSelectList () {
			this.foodSelectLoading = true
			this.$fxApi(`${apiName}.getFoodsSelectList`).then(res => {
				this.foodsSelectList = res
				this.foodSelectLoading = false
			})
		},
		onBomDiagnose () {
			this.tableData = []
			this.loading = true
			this.$fxApi(`${apiName}.onBomDiagnose`)({ data: this.foodBomIds }).then(res => {
				this.tableData = res
				this.loading = false
			})
		},
		onSearchClick () {
			this.onBomDiagnose()
		},
		onFoodSelectVisibleChange (val) {
			val && this.getFoodsSelectList()
		},
		diagnosisInfoRender (h, { row, $index }) {
			h = this.$createElement
			let className = 'fx-ellipsis'
			if (row.diagnosisStatus === 2) {
				className += ' red'
			} else if (row.diagnosisStatus === 0) {
				className += ' green'
			} else if (row.diagnosisStatus === 1) {
				className += ' orange'
			}
			return <div class={className}>{row.diagnosisInfo}</div>
		},
		rowStyle (item, index) {
			return {
				position: 'relative',
				zIndex: this.tableData.length - index
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-page-first-container {
	padding 20px 50px 50px
}
.form-input {
	width: 170px
}
.red {
	color $fxRed6
}
.green {
	color $fxGreen5
}
.orange {
	color $fxOrange4
}
</style>
