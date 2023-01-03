<template>
	<w-dialog
		v-model="dialogVisible"
		width="1200px"
		title="设置买方机构"
		heightFullscreen
		@close="onClose"
		:beforeClose="onBeforeClose"
	>
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="listData"
				:filter="transferFilter"
				:disabled="disabled"
				leftTitle="全部机构"
				rightTitle="选定机构"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" :disabled="disabled" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
export default {
	name: 'settingBuyer',
	components: {
		treeContainer
	},
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		selectedBuyer: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			dialogVisible: false,
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true }
			],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			tableSearchKey: '',
			listSelectIds: []
		}
	},
	methods: {
		open (item) {
			this.listSelectIds = this.$fxUtils.deepClone(this.selectedBuyer)
			this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.listSelectIds)
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.transfer.refresh()
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			this.$emit('on-save-click', this.listSelectIds)
			this.dialogVisible = false
		},
		initOrganTree () {
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}, {
					type: 'Supplier',
					level: 1
				}, {
					type: 'Customer',
					level: 1
				}]
			}).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
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
	width: 1150px
	height: 700px
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
}
</style>
