<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="选择机构" heightFullscreen @close="close">
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<div class="list-container">
				<div class="list-container__title">注：选择某机构后，当前机构与品项的关联关系会与被选择的机构保持一致</div>
				<fx-list-virtual-table
					ref="listTable"
					:tableColumn="tableColumn"
					:listData="tableDataComputed"
					:listTotal="tableDataComputed.length || 0"
					:showPagination="false"
					:selectMulity="false"
					:selectedRows.sync="defaultTableSelect"
					minWidth="100px"
					class="listTable"
				>
					<div slot="btn-tools-right" class="tools-right">
						<w-input
							v-model="tableSearchKey"
							placeholder="请输入内容"
							prefix-icon="el-icon-search"
							size="mini"
							class="search-input"
						>
						</w-input>
					</div>
				</fx-list-virtual-table>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ/Index.vue'
const SEARCH_PROPS = ['name']
export default {
	name: 'copy-with-store',
	components: {
		treeContainer
	},
	props: {
		organTypeLabel: String
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true },
				{ prop: 'fatherName', label: '上级机构', required: true },
				{ prop: 'type', label: '机构类型', required: true },
				{
					prop: 'relAllGoods',
					label: '关联品项设置',
					required: true,
					formatter: (row) => {
						return row.relAllGoods === 1 ? '全部品项' : '自定义'
					}
				}
			],
			tableData: [],
			defaultTableSelect: [],
			tableSearchKey: ''
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.id)) && this.$fxUtils.fuzzyQueryObj(item, this.tableSearchKey, SEARCH_PROPS)
			})
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.getConnectList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
			this.tableSearchKey = ''
			this.$emit('do-close', 0)
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.listTable.getSingleSelectedRow().then(res => {
				const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.copyWithStore', { copyName: res.name, name: this.itemDetails.name, type: this.organTypeLabel })
				return this.$fxApi('organ.copyConnectOrgan2Organ', this.itemDetails.organType, res.id, this.itemDetails.id)({ logger }).then(() => {
					if (res.relAllGoods === 1) {
						this.dialogVisible = false
						this.$emit('do-close', res.relAllGoods)
					}
					return Promise.resolve()
				})
			})
		},
		initOrganTree () {
			return this.$fxApi('organ.getOrganTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		getConnectList () {
			return this.$fxApi('organ.getOrganExcludeId', this.itemDetails.organType, this.itemDetails.id).then(res => {
				this.defaultTableSelect = []
				this.tableData = res
				return Promise.resolve()
			})
		},
		onCellClick (type) {
			return (row, index) => {
				event.stopPropagation()
			}
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
		&__title {
			padding-left: 10px
			color: $fxRed
		}
	}
}
</style>
