<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="复制关系" heightFullscreen @close="close">
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				class="tree-container"
				@check="onTreeCheck"
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:filter="transferFilter"
				:leftTitle="`全部${organTypeLabel}`"
				:rightTitle="`选定${organTypeLabel}`"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-customer/Index.vue'
export default {
	name: 'copy-connect',
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
				{ prop: 'type', label: '机构类型', required: true }
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: []
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshItemList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择一条明细')
				return false
			}
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.copyConnect', { selectRows: this.$refs.transfer.getSelectRows(), name: this.itemDetails.name, type: this.organTypeLabel })
			return this.$fxApi('customer.copyConnectWithSection', this.itemDetails.organType, this.itemDetails.id)({ data: this.listSelectIds, logger }).then(res => {
				return Promise.resolve()
			})
		},
		initOrganTree () {
			return this.$fxApi('customer.getCustomTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshItemList () {
			return this.$fxApi('customer.getCustomerExcludeId', this.itemDetails.organType, this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = []
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.id)
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
