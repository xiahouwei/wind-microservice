<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="设置适用仓库" heightFullscreen @close="onClose">
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
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:filter="transferFilter"
				leftTitle="全部仓库"
				rightTitle="选定仓库"
				ref='transfer'
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from './TakeStockClassCreateDialog.vue'
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
export default {
	name: 'settingStore',
	components: {
		treeContainer
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '仓库编号', required: true },
				{ prop: 'name', label: '仓库名称', required: true },
				{ prop: 'organName', label: '上级机构名称', required: true }
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					const selectRows = this.$refs.transfer.getSelectRows()
					this.fxDataVerification.resetData(selectRows)
				})
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return new Promise(resolve => {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.house', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi(`${apiName}.settingHouse`, this.itemDetails.id)({ data: this.listSelectIds, logger }).then(() => {
					this.fxDataVerification.resetData(selectRows)
					resolve()
				})
			})
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.itemDetails.name,
				code: this.itemDetails.code
			}
		},
		initOrganTree () {
			return this.$fxApi('common.getAllTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshConnectList () {
			return this.$fxApi(`${apiName}.getStoreById`, this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = res.filter(item => {
					return item.depositFlag === 1
				}).map(item => {
					return item.id
				})
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.organId)
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
