<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="关联品项" heightFullscreen @close="close">
		<div class="create-container">
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
				:tableData="tableData"
				:filter="transferFilter"
				:disabled="!detailsAuthGetter('basic-archives_storage-manage.edit-space')"
				leftTitle="全部品项"
				rightTitle="选定品项"
			></fx-transfer>
		</div>
		<template slot="footer">
			<!-- <w-link v-fx-auth:basic-archives_storage-manage.edit-space icon="copy-single" @click="onConnectItemWithStore">与其它货位一致</w-link>
			<w-link v-fx-auth:basic-archives_storage-manage.edit-space icon="copy-mulity" @click="onCopyConnect">复制关系</w-link> -->
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-fx-auth:basic-archives_storage-manage.edit-space type="primary" @click="onSaveClick">保存</el-button>
		</template>
		<copyWithStoreDialog ref="copyWithStoreDialog" @do-close="doClose"></copyWithStoreDialog>
		<copyConnectDialog ref="copyConnectDialog"></copyConnectDialog>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
import copyWithStoreDialog from './copy-with-store.vue'
import copyConnectDialog from './copy-connect.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'connect-item',
	components: {
		treeContainer,
		copyWithStoreDialog,
		copyConnectDialog
	},
	props: {
		storageRackList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true },
				{ prop: 'name', label: '品项名称', required: true },
				{ prop: 'itemTypeRef.name', label: '上级类别', required: true },
				{ prop: 'spec', label: '规格', required: true }
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
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
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return new Promise(resolve => {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.connectItem', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi(`${apiName}.saveConnectItem`, this.itemDetails.id)({ data: this.listSelectIds, logger }).then(() => {
					this.$fxMessage.success('保存成功')
					this.fxDataVerification.resetData(selectRows)
					resolve()
				})
			})
		},
		createLoggerParams (pre, cur) {
			const shelfCode = this.storageRackList.find(item => item.id === this.itemDetails.shelfId).code
			return {
				pre,
				cur,
				code: this.itemDetails.code,
				shelfCode
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
			return this.$fxApi(`${apiName}.getConnectItem`, this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = res.filter(item => {
					return item.selected
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
		},
		onConnectItemWithStore () {
			this.$refs.copyWithStoreDialog.open(this.itemDetails)
		},
		onCopyConnect () {
			this.onSaveClick().then(() => {
				this.$refs.copyConnectDialog.open(this.itemDetails)
			})
		},
		doClose (relAllItem) {
			if (relAllItem) {
				this.itemDetails.relAllItem = !!relAllItem
				this.dialogVisible = false
			} else {
				this.refreshConnectList().then(() => {
					const selectRows = this.$refs.transfer.getSelectRows()
					this.fxDataVerification.resetData(selectRows)
				})
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-container {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
}
</style>
