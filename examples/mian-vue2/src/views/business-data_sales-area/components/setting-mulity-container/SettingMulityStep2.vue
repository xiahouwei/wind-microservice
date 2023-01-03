<template>
	<div class="setting-step2-container">
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
					@on-setting-mulity-show="onSettingMulityShow"
				></settingMulity>
			</fx-details-table>
		</div>
	</div>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ/Index.vue'
import settingMulity from '../setting-container/SettingMulity.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'settingMulityStep2',
	components: {
		treeContainer,
		settingMulity
	},
	data () {
		return {
			itemList: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'organCode', label: '机构编号' },
				{ prop: 'organName', label: '机构名称' },
				{ prop: 'code', label: '销售区域编号' },
				{ prop: 'name', label: '销售区域名称' },
				{ prop: 'store', label: '冲减仓库', width: '280px', fxRender: this.storeRender }
			],
			tableData: [],
			storeSelectList: [],
			searchProps: ['organCode', 'organName', 'code', 'name'],
			selectItemsName: '',
			selectedRows: []
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return (this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.organId))
			})
		}
	},
	methods: {
		open (itemList, selectItemsName) {
			this.tableData = []
			this.itemList = itemList
			this.selectItemsName = selectItemsName
			this.initOrganTree().then(this.getSalesAreaList)
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.detailsTable.clear()
			this.selectedRows = []
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
					itemList: this.itemList,
					offsetHouseId: item.offsetHouseId,
					organId: item.organId,
					salesRegionId: item.id
				}
			})
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.setOffsetHouseMulity', this.createLoggerParams(selectRows))
			return this.$fxApi(`${apiName}.setOffsetHouseMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-save')
				return Promise.resolve()
			})
		},
		createLoggerParams (selectRows) {
			return selectRows.map(item => {
				return {
					organName: item.organName,
					salesRegionName: item.name,
					itemName: this.selectItemsName,
					storeName: this.getStoreName(item.offsetHouseId, item.houseList)
				}
			})
		},
		getStoreName (offsetHouseId, houseList) {
			if (!houseList) return '/'
			return (houseList.find(item => {
				return item.id === offsetHouseId
			}) || {}).name || '/'
		},
		initOrganTree () {
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}]
			}).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		getSalesAreaList () {
			return this.$fxApi(`${apiName}.getSalesAreaList`).then(res => {
				res.forEach(item => {
					item.offsetHouseId = (item.houseList || [{}])[0].id || ''
				})
				this.tableData = res
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
				optionlist={row.houseList || []}
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
		},
		onSettingMulityShow () {
			this.$refs.detailsTable.getSelectRows(false).then(res => {
				if (res.length) {
					const organId = res[0].organId
					const diffOrgan = res.find(item => {
						return item.organId !== organId
					})
					if (diffOrgan) {
						this.$refs.detailsTable.closeMulitySettingPopver()
						this.$fxMessage.warning('请选择相同机构')
					} else {
						this.storeSelectList = res[0].houseList || []
					}
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-step2-container {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: hidden;
	.list-container {
		flex: 1
	}
}
.form-item-input {
	width 260px
}
</style>
