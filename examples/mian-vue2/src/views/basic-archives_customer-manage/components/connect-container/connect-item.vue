<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="关联品项" heightFullscreen @close="close">
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
				:tableData="tableData"
				:filter="transferFilter"
				:disabled="!detailsAuthGetter('basic-archives_customer-manage.edit-customer')"
				leftTitle="全部品项"
				rightTitle="选定品项"
			></fx-transfer>
		</div>
		<template slot="footer">
			<w-link icon="copy-single" v-fx-auth:basic-archives_customer-manage.edit-customer @click="onConnectItemWithStore">与其他{{organTypeLabel}}一致</w-link>
			<w-link icon="copy-mulity" v-fx-auth:basic-archives_customer-manage.edit-customer @click="onCopyConnect">复制关系</w-link>
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-fx-auth:basic-archives_customer-manage.edit-customer type="primary" @click="onSaveClick">保存</el-button>
		</template>
		<copyWithStoreDialog ref="copyWithStoreDialog" @do-close="doClose" :organTypeLabel="organTypeLabel"></copyWithStoreDialog>
		<copyConnectDialog ref="copyConnectDialog" :organTypeLabel="organTypeLabel"></copyConnectDialog>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
import copyWithStoreDialog from './copy-with-store.vue'
import copyConnectDialog from './copy-connect.vue'
export default {
	name: 'connect-item',
	components: {
		treeContainer,
		copyWithStoreDialog,
		copyConnectDialog
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
				{ prop: 'typeName', label: '上级类别', required: true },
				{ prop: 'spec', label: '规格', required: true }
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(this.itemDetails.organType).label
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
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return new Promise(resolve => {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.connectItem', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi('customer.saveConnectItem', this.itemDetails.organType, this.itemDetails.id)({ data: this.listSelectIds, logger }).then(() => {
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
				type: this.organTypeLabel
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
			return this.$fxApi('organ.getConnectItem', this.itemDetails.organType, this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = res.filter(item => {
					return item.depositFlag === '1'
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
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.typeId)
		},
		onConnectItemWithStore () {
			this.$refs.copyWithStoreDialog.open(this.itemDetails)
		},
		onCopyConnect () {
			this.onSaveClick().then(() => {
				this.$refs.copyConnectDialog.open(this.itemDetails)
			})
		},
		doClose (relAllGoods) {
			this.itemDetails.relAllGoods = !!relAllGoods
			this.dialogVisible = false
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
