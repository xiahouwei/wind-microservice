<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="设置适用机构" heightFullscreen @close="close">
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				class="tree-container"
				@check="onTreeCheck"
				@on-show-all-change='onShowAllChange'
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:filter="transferFilter"
				leftTitle="全部机构"
				rightTitle="选定机构"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ/Index.vue'
export default {
	name: 'connect-item',
	components: {
		treeContainer
	},
	props: {
		type: String,
		bomDetail: Object
	},
	data () {
		return {
			id: '',
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true },
				{
					prop: 'type',
					label: '机构类型',
					required: true,
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('allOrganType')(row.type).label
					}
				}
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: [],
			showAll: false,
			allTableData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxDataVerification_organ: this.$fxUtils.fxDataVerification()
		}
	},
	methods: {
		open (item, id = this.bomDetail.id) {
			this.id = id
			this.itemDetails = item
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					const selectRows = this.$refs.transfer.getSelectRows()
					this.fxDataVerification_organ.resetData(selectRows)
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
			if (this.fxDataVerification.checkData(this.listSelectIds)) {
				this.$fxMessage.success('操作成功')
				return Promise.resolve(this.listSelectIds)
			} else {
				return new Promise(resolve => {
					const selectRows = this.$refs.transfer.getSelectRows()
					const logger = this.$fxLogger.createInfo('basic-archives.bom.manageOrgan', this.createLoggerParams(this.fxDataVerification_organ.getOriginData(), selectRows))
					let data
					if (this.type === 'food_bom') {
						data = {
							detailId: this.id,
							relateAllOrgan: false,
							organIdList: this.listSelectIds
						}
					} else {
						data = this.listSelectIds
					}
					return this.$fxApi('bom.saveConnectOrgan', this.type, this.id)({ data, logger }).then(() => {
						this.$emit('refresh')
						this.fxDataVerification_organ.resetData(selectRows)
						resolve()
					})
				})
			}
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.bomDetail.name,
				code: this.bomDetail.code
			}
		},
		initOrganTree () {
			const shop = this.$fxTypeMiddleware.getTypeEnum('organTypeEnum.shop')
			const rdc = this.$fxTypeMiddleware.getTypeEnum('organTypeEnum.rdc')
			return this.$fxApi('bom.getOrganTree', this.type)({ data: { organTypeList: [shop, rdc] } }).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshConnectList () {
			return this.$fxApi('bom.getConnectOrgan', this.type, this.id).then(res => {
				this.allTableData = res
				this.tableData = res.filter(item => {
					return item.enableFlag === 1
				})
				this.listSelectIds = res.filter(item => {
					return item.related === '1'
				}).map(item => item.id)
				this.fxDataVerification.resetData(this.listSelectIds)
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.organId) || this.treeCheckedKeys.includes(item.id)
		},
		doClose (manageAllOrgan) {
			this.itemDetails.manageAllOrgan = manageAllOrgan
			this.dialogVisible = false
		},
		onShowAllChange (val) {
			this.showAll = val
			if (val) {
				this.tableData = this.allTableData
			} else {
				this.tableData = this.allTableData.filter(item => {
					return item.enableFlag === 1
				})
			}
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
