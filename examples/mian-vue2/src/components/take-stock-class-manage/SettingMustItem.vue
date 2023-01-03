<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="设置必盘品项" heightFullscreen @close="onClose">
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
				leftTitle="可选品项"
				rightTitle="选定品项"
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
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'settingItem',
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
				{ prop: 'code', label: '品项编号', required: true },
				{ prop: 'name', label: '品项名称', required: true }
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
			const params = this.listSelectIds.map(item => {
				return {
					itemId: item,
					mustFlag: 1
				}
			})
			return new Promise(resolve => {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.must', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi(`${apiName}.settingMustItem`, this.itemDetails.id)({ data: params, logger }).then(() => {
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
			return this.$fxApi('itemType.getItemTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshConnectList () {
			return this.$fxApi(`${apiName}.getMustItemById`, this.itemDetails.id).then(res => {
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
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
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
