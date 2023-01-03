<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="选择员工" heightFullscreen @close="close">
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showAllBtn
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<div class="list-container">
				<div class="list-container__title">注：选择某员工后，当前员工可管理机构的关系会与被选择的员工保持一致</div>
				<fx-list-virtual-table
					ref="listTable"
					:tableColumn="tableColumn"
					:listData="tableDataComputed"
					:listTotal="tableDataComputed.length || 0"
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
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
const SEARCH_PROPS = ['code', 'name', 'username', 'pinYin', 'organCode', 'organName', 'organPinYin']
export default {
	name: 'copy-with-employee',
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
				{ prop: 'code', label: '员工编号', required: true },
				{ prop: 'name', label: '员工名称', required: true },
				{ prop: 'organCode', label: '直属机构编号', required: true },
				{ prop: 'organName', label: '直属机构名称', required: true },
				{
					prop: 'organType',
					label: '直属机构类型',
					required: true,
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('allOrganType')(row.organType).label
					}
				},
				{
					prop: 'manageAllOrgan',
					label: '可管理机构设置',
					required: true,
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('manageAllOrganType')(row.manageAllOrgan).label
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
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.organId)) && this.$fxUtils.fuzzyQueryObj(item, this.tableSearchKey, SEARCH_PROPS)
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
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.listTable.getSingleSelectedRow().then(res => {
				const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.copyWithEmployee_organ', { copyName: res.name, name: this.itemDetails.name, code: this.itemDetails.code })
				return this.$fxApi('employee.copyConnectEmployee2Employee', res.id, this.itemDetails.id)({ logger }).then(() => {
					this.dialogVisible = false
					this.$emit('do-close', res.manageAllOrgan)
					return Promise.resolve()
				})
			})
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
		getConnectList () {
			return this.$fxApi('employee.getEmployeeExcludeId', this.itemDetails.id).then(res => {
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
