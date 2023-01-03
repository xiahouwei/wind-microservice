<template>
	<w-dialog
		v-model="dialogVisible"
		width="1000px"
		title="设置财务分类"
		heightFullscreen
		@close="onClose"
	>
		<div class="setting-container">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				showAllBtn
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<div class="list-container">
				<div class="list-container__title">
					<span class="list-container__title-name">品项名称：<i class="list-container__title-heightline">{{itemDetails.name}}</i></span>
				</div>
				<fx-details-table
					ref="detailsTable"
					:tableColumn="tableColumn"
					:tableData="tableDataComputed"
					:searchProps="searchProps"
					:tableEditColumnProp="tableEditColumnProp"
					:selectedRows="selectedRows"
					:showColumnFilterBtn="false"
					:canAdd="false"
					:showDeleteBtn="false"
					:fullScreenBtn="false"
				>
					<settingMulity
						slot="setting-mulity"
						slot-scope="{ visible }"
						:visible="visible"
						:financeSortList="financeSortList"
						@on-save-click="onSettingMulitySave"
						@on-cancel-click="onSettingMulityClose"
					></settingMulity>
				</fx-details-table>
			</div>
		</div>
		<template slot="footer">
			<fx-button @click="onCancelClick">取消</fx-button>
			<fx-button type="primary" @click="onSaveClick">保存</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
import settingMulity from './SettingMulity.vue'
const EDIT_INPUT_TYPE = ['financeSortId']
export default {
	name: 'setting-finance',
	components: {
		treeContainer,
		settingMulity
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'organName', label: '机构名称' },
				{ prop: 'houseName', label: '仓库名称' },
				{
					prop: 'financeSortId',
					label: '财务分类',
					fxRender: this.financeSortRender
				}
			],
			tableData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			tableEditColumnProp: EDIT_INPUT_TYPE,
			searchProps: ['organName', 'houseName'],
			financeSortList: [],
			selectedRows: []
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.id))
			})
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.getStoreList).then(this.getFinancialList).then(() => {
				this.dialogVisible = true
			})
		},
		getFinancialList (tableData) {
			const financeSortIds = this.$fxUtils.arrDedup(tableData.map(item => item.financeSortId))
			return this.$fxApi('finance.getFinancialList')({ data: financeSortIds }).then(res => {
				this.financeSortList = res
				return Promise.resolve(res)
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.detailsTable.clear()
			this.selectedRows = []
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.detailsTable.getSelectRows().then(selectRows => {
				const logger = this.$fxLogger.createInfo('basic-archives.item-manage.settingFinance', this.createLoggerParams(selectRows))
				const params = selectRows.map(item => {
					return {
						financeSortId: item.financeSortId,
						houseId: item.houseId,
						organId: item.organId
					}
				})
				return this.$fxApi('item.settingItemFinance', this.itemDetails.id)({ data: params, logger }).then(() => {
					this.fxDataVerification.resetData(this.tableData)
					return Promise.resolve()
				})
			})
		},
		createLoggerParams (selectRows) {
			return {
				selectRows,
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
		getStoreList () {
			return this.$fxApi('item.getItemFinanceHouse', this.itemDetails.id).then(res => {
				this.tableData = res
				this.fxDataVerification.resetData(this.tableData)
				return Promise.resolve(res)
			})
		},
		financeSortRender (h, { row, $index }) {
			h = this.$createElement
			return <w-select
				vModel={row.financeSortId}
				clearable
				optionlist={this.financeSortList}
				class="form-item-input"
				on-change={this.onFinanceChange(row)}
			></w-select>
		},
		onFinanceChange (row) {
			return (id, item) => {
				row.financeSortName = item.name
				const index = this.selectedRows.findIndex(selectItem => {
					return row.id === selectItem.id
				})
				if (!~index) {
					this.selectedRows.push(row)
				}
			}
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				res.forEach(item => {
					item.financeSortId = setting.financeSortId
					item.financeSortName = setting.financeSortName
				})
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-container {
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
			margin-bottom 10px
			&-heightline {
				font-size: 14px
				font-weight: 700
			}
			&-name {
				margin-right: 30px
			}
		}
		>>>.tools-left{
			flex-direction row-reverse
		}
		>>>.tools-left-left {
			display flex
			justify-content flex-end
			flex unset
		}
	}
}
.form-item-input {
	width 100%
}
</style>
