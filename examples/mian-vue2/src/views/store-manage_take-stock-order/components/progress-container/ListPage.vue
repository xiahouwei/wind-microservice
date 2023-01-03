<template>
	<div>
		<el-form :model="params" :rules="rules" ref="form" :inline="true">
			<el-form-item label="盘点时间" prop="checkDate">
				<el-date-picker
					v-model="params.checkDate"
					type="date"
					:clearable="false"
					value-format="yyyy-MM-dd"
					placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="盘点分类" prop="checkClassIds">
				<w-select-mulity
					v-model="params.checkClassIds"
					:optionlist="checkClassSelectList"
					class="form-item-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSearchClick">查询</el-button>
			</el-form-item>
		</el-form>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:selectable="false"
			:showTools="false"
			:selectAndIndexFixed="false"
			@on-page-change="onPageChange"
			showIndex
			minHeight="500px"
		>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'listPage',
	props: {
		checkClassSelectList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			params: {
				checkDate: this.$fxUtils.setDate(),
				checkClassIds: []
			},
			rules: {
				checkDate: [
					{ required: true, message: '请选择盘点时间', trigger: 'blur' }
				]
			},
			tableColumn: [
				{ prop: 'name', label: '盘点分类', width: '240px', align: 'center', headerAlign: 'center' },
				{ prop: 'checkStoreAmount', label: '已盘仓库', width: '90px', align: 'center', headerAlign: 'center' },
				{ prop: 'unCheckStoreAmount', label: '未盘仓库', width: '90px', align: 'center', headerAlign: 'center' },
				{ prop: 'checkProgress', label: '盘点进度', width: '90px', align: 'center', headerAlign: 'center' },
				{ prop: 'more', label: '更多操作', width: '180px', align: 'center', headerAlign: 'center', fxRender: this.moreHandlerRender }
			],
			tableData: []
		}
	},
	methods: {
		moreHandlerRender (h, { row, $index }) {
			h = this.$createElement
			return <w-link on-click={() => this.onClick(row)}>查看详情</w-link>
		},
		onPageChange () {
			return this.onSearch()
		},
		onClick (row) {
			const params = {
				checkClassId: row.id,
				beginDate: `${this.params.checkDate} 00:00:00`,
				endDate: `${this.params.checkDate} 23:59:59`
			}
			this.$emit('on-click', params)
		},
		getParams () {
			return {
				...this.$refs.listTable.getPaginationParams(),
				r: { businessDate: [`${this.params.checkDate} 00:00:00`, `${this.params.checkDate} 23:59:59`] },
				i: this.params.checkClassIds.length ? { checkClassIds: this.params.checkClassIds } : {}
			}
		},
		onSearchClick () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.onSearch()
		},
		onSearch () {
			return this.$refs.form.validate().then(this.onSearchHandler).catch(() => {})
		},
		onRefresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.form.clearValidate()
			this.$refs.form.resetFields()
		},
		onSearchHandler () {
			const params = this.getParams()
			return this.$fxApi(`${apiName}.getCheckProgress`)({ data: params }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
