<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="复制到其他BOM" heightFullscreen @close="close">
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
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:filter="transferFilter"
				:searchProps="searchProps"
				leftTitle="全部BOM"
				rightTitle="选定BOM"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-bom/Index.vue'
export default {
	name: 'copy-connect',
	components: {
		treeContainer
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
			tableSearchKey: '',
			listSelectIds: [],
			searchProps: ['item.code', 'item.name', 'code', 'name']
		}
	},
	methods: {
		open () {
			this.initOrganTree().then(this.refreshBomList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.classTreeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择一条明细')
				return false
			}
			const logger = this.$fxLogger.createInfo('basic-archives.bom.copy', { selectRows: this.$refs.transfer.getSelectRows(), name: this.bomDetail.name, code: this.bomDetail.code })
			return this.$fxApi('bom.copyBom', this.type, this.bomDetail.id)({ data: this.listSelectIds, logger }).then(res => {
				return Promise.resolve()
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
		refreshBomList () {
			return this.$fxApi('bom.getCopyBomList', this.type, this.bomDetail.id).then(res => {
				this.tableData = res
				this.listSelectIds = []
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.item.itemType)
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
	.tree-container {
		margin-top:21px
	}
}
</style>
