<template>
	<w-dialog v-model="dialogVisible" width="1000px" title="设置冲减仓库" heightFullscreen @close="close">
		<div class="create-container">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<div class="list-container">
				<fx-details-table
					ref="detailsTable"
					:tableColumn="tableColumn"
					:tableData="tableDataComputed"
					:selectedRows="selectedRows"
					:showPagination="false"
					:showColumnFilterBtn="false"
					:fullScreenBtn="false"
					:showDeleteBtn="false"
					:canAdd="false"
					:searchProps="searchProps"
				>
					<settingMulity
						slot="setting-mulity"
						slot-scope="{ visible }"
						:visible="visible"
						:storeSelectList="storeSelectList"
						@on-save-click="onSettingMulitySave"
						@on-cancel-click="onSettingMulityClose"
					></settingMulity>
				</fx-details-table>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
import settingMulity from './SettingMulity.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'settingStore',
	components: {
		treeContainer,
		settingMulity
	},
	data () {
		return {
			dialogVisible: false,
			areaDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '品项编号', width: '140px' },
				{ prop: 'name', label: '品项名称', width: '200px' },
				{ prop: 'store', label: '冲减仓库', width: '280px', fxRender: this.storeRender }
			],
			tableData: [],
			storeSelectList: [],
			searchProps: ['name', 'code', 'pinYin'],
			selectedRows: []
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType))
			})
		}
	},
	methods: {
		open (areaDetails) {
			this.areaDetails = areaDetails
			this.tableData = []
			this.storeSelectList = []
			this.initOrganTree().then(this.getStoreSelectList).then(this.getItemList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.detailsTable.clear()
			this.selectedRows = []
			this.$emit('on-close')
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.$refs.detailsTable.getSelectRows().then(selectRows => {
				const emptyStore = selectRows.find(item => {
					return !item.offsetHouseId
				})
				if (emptyStore) {
					this.$fxConfirm('冲减仓库存在空数据，是否继续保存？').then(() => this.onSaveHandler(selectRows)).catch(() => {})
				} else {
					this.onSaveHandler(selectRows)
				}
			})
		},
		onSaveHandler (selectRows) {
			const params = selectRows.map(item => {
				return {
					itemId: item.id,
					offsetHouseId: item.offsetHouseId,
					organId: this.areaDetails.organId,
					salesRegionId: this.areaDetails.id
				}
			})
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.setOffsetHouse', this.createLoggerParams(selectRows))
			return this.$fxApi(`${apiName}.setOffsetHouse`)({ data: params, logger }).then(res => {
				this.dialogVisible = false
				return Promise.resolve()
			})
		},
		createLoggerParams (selectRows) {
			return selectRows.map(item => {
				return {
					organName: this.areaDetails.organName,
					salesRegionName: this.areaDetails.name,
					itemName: item.name,
					storeName: this.getStoreName(item.offsetHouseId)
				}
			})
		},
		getStoreName (offsetHouseId) {
			return (this.storeSelectList.find(item => {
				return item.id === offsetHouseId
			}) || {}).name || '/'
		},
		initOrganTree () {
			return this.$fxApi(`${apiName}.getItemTree`).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		getItemList () {
			const params = {
				itemList: [],
				organId: this.areaDetails.organId,
				salesRegionId: this.areaDetails.id
			}
			return this.$fxApi(`${apiName}.getItemList`)({ data: params }).then(res => {
				const defaultStore = this.storeSelectList.find(item => {
					return item.defaultOutFlag
				}) || this.storeSelectList[0] || {}
				res.forEach(item => {
					if (item.offsetHouse && item.offsetHouse.id) {
						item.offsetHouseId = item.offsetHouse.id
					} else {
						item.offsetHouseId = defaultStore.id || ''
					}
				})
				this.tableData = res
				return Promise.resolve()
			})
		},
		getStoreSelectList () {
			return this.$fxApi(`${apiName}.getStoreSelectList`, this.areaDetails.organId).then(res => {
				this.storeSelectList = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		storeRender (h, { row, $index }) {
			h = this.$createElement
			return <w-select
				vModel={row.offsetHouseId}
				optionlist={this.storeSelectList}
				class="form-item-input"
				on-change={this.onOffsetHouseChange(row)}
			></w-select>
		},
		onOffsetHouseChange (row) {
			return (id, item) => {
				const index = this.selectedRows.findIndex(selectItem => {
					return row.id === selectItem.id
				})
				if (!~index) {
					this.selectedRows.push(row)
				}
			}
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				res.forEach(item => {
					item.offsetHouseId = setting.offsetHouseId
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
.create-container {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
	}
}
.form-item-input {
	width 260px
}
</style>
