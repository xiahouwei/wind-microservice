<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="选择BOM" heightFullscreen @close="close">
		<div class="create-organ">
			<treeContainer
				ref="classTreeContainer"
				:data="typeTreeData"
				readonly
				showCheckbox
				@check="onTreeCheck"
				:showTreeWidthExtendBtn="false"
				class="tree"
			></treeContainer>
			<div class="list-container">
				<div class="list-container__title">注：选择某BOM后，当前BOM的明细会与被选择BOM保持一致</div>
				<fx-list-virtual-table
					ref="listTable"
					:tableColumn="tableColumn"
					:listData="tableDataComputed"
					:listTotal="tableData.length || 0"
					:showPagination="false"
					:selectMulity="false"
					:selectedRows.sync="defaultTableSelect"
					:showColumnFilterBtn="false"
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
import treeContainer from '@/components/tree-container/tree-bom/Index.vue'
const SEARCH_PROPS = ['item.code', 'item.name', 'code', 'name']
export default {
	name: 'copy-with-store',
	components: {
		treeContainer
	},
	data () {
		return {
			dialogVisible: false,
			typeTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'item.code', label: '品项编号', required: true },
				{ prop: 'item.name', label: '品项名称', required: true },
				{ prop: 'code', label: 'BOM编号', required: true },
				{ prop: 'name', label: 'BOM名称', required: true }
			],
			tableData: [],
			defaultTableSelect: [],
			tableSearchKey: ''
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.item.itemType)) && this.$fxUtils.fuzzyQueryObj(item, this.tableSearchKey, SEARCH_PROPS)
			})
		}
	},
	props: {
		type: String,
		bomDetail: {
			type: Object,
			default: () => {
				return {
					default: 1
				}
			}
		}
	},
	methods: {
		open () {
			this.initOrganTree().then(this.getConnectList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.listTable.clearSelected()
			this.$refs.classTreeContainer.clearSearchInput()
			this.tableSearchKey = ''
		},
		onCancelClick () {
			this.$refs.listTable.clearSelected()
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.listTable.getSingleSelectedRow().then(res => {
				const logger = this.$fxLogger.createInfo('basic-archives.bom.copyWithBom', { copyName: res.name, name: this.bomDetail.name, code: this.bomDetail.code })
				return this.$fxApi('bom.copyWithBom', this.type, this.bomDetail.id)({ data: res.id, logger }).then(() => {
					this.dialogVisible = false
					this.$emit('refresh', this.bomDetail)
					return Promise.resolve()
				})
			})
		},
		initOrganTree () {
			return this.$fxApi('bom.getTypeTree', this.type).then(res => {
				this.typeTreeData = [res]
				this.treeCheckedKeys = []
				this.itemTreeData = []
				return Promise.resolve()
			})
		},
		getConnectList () {
			return this.$fxApi('bom.getCopyBomList', this.type, this.bomDetail.id).then(res => {
				this.tableData = res
				this.listSelectIds = []
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
