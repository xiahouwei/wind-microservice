<template>
	<w-dialog v-model="dialogVisible" width="1000px" title="关联权限" heightFullscreen @close="close">
		<div slot="sub" class="role-name">角色名称：{{itemDetails.name}}</div>
		<div class="create-organ">
			<div class="auth-tree">
				<div class="auth-container-title">菜单权限设置</div>
				<div class="auth-tree_select-count">已选：{{treeSelected.length}} / {{treeTotal}}条</div>
				<treeContainer
					ref="treeContainer"
					:data="tableTreeData"
					:showTreeSearchBar="false"
					:defaultChecked="treeDefaultChecked"
					showCheckbox
					class="auth-tree-container"
					@on-tree-item-click="onTreeItemClick"
					@check="onTreeItemCheck"
				></treeContainer>
			</div>
			<div class="list-container">
				<div class="auth-container-title">按钮权限设置</div>
				<fx-list-virtual-table
					ref="authDetailsListTable"
					:tableColumn="tableColumn"
					:listData="tableDataComputed"
					:listTotal="tableDataComputed.length || 0"
					:selectTotalGlobal="false"
					:showPagination="false"
					:selectedRows.sync="defaultSelect"
					:showColumnFilterBtn="false"
					:selectableHandler="selectableHandler"
					minWidth="100px"
					class="listTable"
					@on-select="onSelectHandler"
				>
					<div slot="btn-tools-right" class="tools-right">
						<w-input
							v-model="tableSearchKey"
							placeholder="请输入内容"
							prefix-icon="el-icon-search"
							size="mini"
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
import treeContainer from '@/components/tree-container/tree-auth/Index.vue'
export default {
	name: 'connect-item',
	components: {
		treeContainer
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			currentTreeItemCodes: [],
			treeDefaultChecked: [],
			tableColumn: [
				{ prop: 'name', label: '权限名称', required: true },
				{ prop: 'fatherWholeName', label: '所属分支', required: true }
			],
			tableData: [],
			defaultSelect: [],
			tableSearchKey: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			treeSelected: [],
			treeTotal: 0
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.currentTreeItemCodes.length === 0 || this.currentTreeItemCodes.includes(item.fatherCode)) && this.$fxUtils.fuzzyQueryObj(item, this.tableSearchKey, ['name'])
			})
		},
		defaultSelectAuthMap () {
			return this.$fxAuth.createAuthDetailsMap(this.defaultSelect)
		},
		treeDataList () {
			return this.$fxUtils.arrFlatten(this.tableTreeData, (item) => item.children)
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					this.$refs.authDetailsListTable.getSelectedRows(false).then(res => {
						this.fxDataVerification.resetData(res)
					})
				})
			})
		},
		close () {
			this.clearFilterInput()
		},
		onCancelClick () {
			this.clearFilterInput()
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.authDetailsListTable.getSelectedRows(false)
				.then(this.saveHandler)
				.then(this.emitAuthRefresh)
		},
		saveHandler (selecteds) {
			const params = [
				...this.$refs.treeContainer.getAllCheckedKeys(),
				...this.$refs.authDetailsListTable.getSelectIds()
			]
			const selectRows = this.$fxUtils.deepClone(selecteds)
			const logger = this.$fxLogger.createInfo('basic-archives.role-manage.connectAuth', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
			return this.$fxApi('role.saveRolesConnectAuth', this.itemDetails.id)({ data: params, logger }).then(res => {
				this.fxDataVerification.resetData(selectRows)
				return Promise.resolve()
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
			return this.$fxApi('role.getAuthTreeByRoleId', this.itemDetails.id).then(res => {
				this.tableTreeData = res
				this.currentTreeItemCodes = []
				this.treeDefaultChecked = function (item) {
					return item.selected === '1'
				}
				const { selecteds, total } = this.initTreeTotalAndSelected(res[0].children)
				this.treeTotal = total
				this.treeSelected = selecteds
				return Promise.resolve()
			})
		},
		initTreeTotalAndSelected (data) {
			let selecteds = []
			const total = data.reduce((pre, cur) => {
				let count = 0
				if (cur.type === 1) {
					count = 1
				}
				if (cur.type === 1 && cur.selected === '1') {
					selecteds.push(cur)
				}
				if (Array.isArray(cur.children) && cur.children.length > 0) {
					count += cur.children.length
					const select = cur.children.filter(item => item.selected === '1')
					selecteds = selecteds.concat(select)
					const { selecteds: selectThird, total: totalThird } = this.initTreeTotalAndSelected(cur.children)
					count += totalThird
					selecteds = selecteds.concat(selectThird)
				}
				return pre + count
			}, 0)
			return {
				total,
				selecteds
			}
		},
		refreshConnectList () {
			return this.$fxApi('role.getAuthConnectByRoleId', this.itemDetails.id).then(res => {
				this.tableData = res
				this.defaultSelect = res.filter(item => {
					return item.selected === '1'
				})
				return Promise.resolve()
			})
		},
		clearFilterInput () {
			this.tableSearchKey = ''
			this.$refs.treeContainer.clearSearchInput()
		},
		onTreeItemClick (itemCodes) {
			this.currentTreeItemCodes = itemCodes
		},
		onTreeItemCheck (data, treeCheckData, flag) {
			this.treeSelected = this.$refs.treeContainer.getAllCheckedKeys()
			this.setConnectDetailsSelect(data, flag)
		},
		setConnectDetailsSelect (data, flag) {
			let connectDetails = []
			if (data.type === 2) {
				connectDetails = this.getConnectDetails([data])
			} else if (data.type === 1) {
				connectDetails = this.getConnectDetails(data.children || [])
			} else if (data.treeType === 'root') {
				connectDetails = this.getConnectDetails(this.treeDataList)
			}
			if (connectDetails.length > 0) {
				const compareArrayUtils = this.$fxUtils.compareArrayUtils(this.tableData, { key: 'code' })
				connectDetails.forEach(item => {
					const code = this.$fxAuth.getCodeByAuthKey(item)
					if (compareArrayUtils.has(code)) {
						const row = compareArrayUtils.get(code)
						const selectIndex = this.defaultSelect.findIndex(item => item.id === row.id)
						if (~selectIndex && !flag) {
							this.defaultSelect.splice(selectIndex, 1)
						} else if (!~selectIndex && flag) {
							this.defaultSelect.push(row)
						}
					}
				})
			}
		},
		getConnectDetails (list) {
			return Array.from(new Set(list.reduce((pre, cur) => {
				const authItem = this.$fxAuth.getAuthByCode(cur.code)
				if (authItem && authItem.connectDetails) {
					pre.push(...authItem.connectDetails)
				}
				return pre
			}, [])))
		},
		selectableHandler (rowItem) {
			const authItem = this.$fxAuth.getAuthByCode(rowItem.code)
			if (authItem.controlled) {
				const { mainModule, subModule, thirdModule } = this.$fxAuth.getAuthKeyByCode(rowItem.code)
				const authCode = thirdModule ? `${mainModule}_${subModule}_${thirdModule}.${authItem.controlled}` : `${mainModule}_${subModule}.${authItem.controlled}`
				return !this.$fxAuth.authGetter(authCode)(this.defaultSelectAuthMap)
			}
			return true
		},
		onSelectHandler ({ selectFlag, row }) {
			if (selectFlag && row) {
				const authItem = this.$fxAuth.getAuthByCode(row.code)
				if (Array.isArray(authItem.decision) && authItem.decision.length > 0) {
					const { mainModule, subModule, thirdModule } = this.$fxAuth.getAuthKeyByCode(row.code)
					this.tableData.forEach(item => {
						const authCode = thirdModule ? `${mainModule}_${subModule}_${thirdModule}.${authItem.decision.join('|')}` : `${mainModule}_${subModule}.${authItem.decision.join('|')}`
						if (this.$fxAuth.authGetter(authCode)(this.$fxAuth.createAuthDetailsMap([item]))) {
							if (!this.defaultSelect.includes(item)) {
								this.defaultSelect.push(item)
							}
						}
					})
				}
			}
			this.setConnectModuleSelect(selectFlag, row)
		},
		setConnectModuleSelect (selectFlag, row) {
			const connectModules = this.getConnectModules(row ? [row] : this.tableDataComputed)
			if (connectModules) {
				connectModules.forEach(item => {
					const _code = this.$fxAuth.getCodeByAuthKey(item)
					const _data = this.treeDataList.find(row => row.code === _code)
					if (_data) {
						this.$refs.treeContainer.setChecked(_data.id, selectFlag)
					}
				})
				this.treeSelected = this.$refs.treeContainer.getAllCheckedKeys()
			}
		},
		getConnectModules (list) {
			return Array.from(new Set(list.reduce((pre, cur) => {
				const authItem = this.$fxAuth.getAuthByCode(cur.code)
				if (authItem && authItem.connectModule) {
					pre.push(...authItem.connectModule)
				}
				return pre
			}, [])))
		},
		emitAuthRefresh () {
			this.$emit('on-auth-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.role-name {
	color: $fxDefaultColor
}
.create-organ {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.auth-tree {
		display: flex;
		flex-direction: column;
		overflow: auto;
		margin-right: 50px
		box-sizing:border-box
		&_select-count {
			height: 28px
			line-height: 28px
			margin: 0 10px;
		}
		.auth-tree-container {
			overflow: auto;
			display: flex;
			flex-direction: column;
			flex: 1
			margin-top: 9px
			width: 400px
			border: 1px solid $fxGray2;
			padding-top: 5px
			padding-left: 5px
			&>>> .organ-manage-tree {
				flex: 1
				width: 100%;
				overflow: auto;
				&__content {
					width: 100%
				}
			}
		}
	}
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
	}
	.auth-container-title {
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		padding-left: 10px
	}
}
</style>
