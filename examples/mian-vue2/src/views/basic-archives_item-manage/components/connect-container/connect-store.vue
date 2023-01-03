<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="存放仓库设置" heightFullscreen @close="onClose">
		<div class="create-organ">
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
					<span>报表默认单位：<i class="list-container__title-heightline">{{mainUnitName}}</i></span>
				</div>
				<fx-details-table
					ref="detailsTable"
					:tableColumn="tableColumn"
					:tableData="tableDataComputed"
					:tableValiDate="tableValiDate"
					:selectedRows="defaultTableSelect"
					:fpBeforeRowEdit="beforeRowEdit"
					:searchProps="searchProps"
					:tableEditColumnProp="tableEditColumnProp"
					:showColumnFilterBtn="false"
					:canAdd="false"
					:showDeleteBtn="false"
					:fullScreenBtn="false"
				>
					<settingMulity
						slot="setting-mulity"
						slot-scope="{ visible }"
						:visible="visible"
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
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
import settingMulity from './SettingMulity.vue'
const EDIT_INPUT_TYPE = ['optimalStore', 'maxStoreFlag', 'maxStore', 'minStoreFlag', 'minStore']
const SEARCH_PROPS = ['organName', 'houseName']
export default {
	name: 'connect-store',
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
				{ prop: 'organName', label: '机构名称', required: true },
				{ prop: 'houseName', label: '仓库名称', required: true },
				{
					prop: 'optimalStore',
					label: '最佳库存',
					width: '118px',
					required: true,
					fxRender: this.optimalStoreRender,
					click: this.onCellClick('optimalStore')
				},
				{
					prop: 'maxStore',
					label: '库存上限',
					width: '250px',
					required: true,
					fxRender: this.maxStoreRender,
					click: this.onCellClick('maxStoreFlag')
				},
				{
					prop: 'minStore',
					label: '库存下限',
					width: '250px',
					required: true,
					fxRender: this.minStoreRender,
					click: this.onCellClick('minStoreFlag')
				}
			],
			tableData: [],
			defaultTableSelect: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			tableEditColumnProp: EDIT_INPUT_TYPE,
			searchProps: SEARCH_PROPS,
			tableValiDate: [{
				columnProp: 'maxStore',
				rule (row, success, error) {
					if (row.maxStoreFlag === '1' && row.minStoreFlag === '1' && (row.maxStore < row.minStore)) {
						error('库存上限不能小于库存下限')
					} else if (row.maxStoreFlag === '1' && !row.maxStore) {
						error('库存上限不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'minStore',
				rule (row, success, error) {
					if (row.minStoreFlag === '1' && !row.minStore) {
						error('库存下限不能为0')
					} else {
						success()
					}
				}
			}],
			tableDataComputed: []
		}
	},
	watch: {
		treeCheckedKeys: {
			handler (val, oldValue) {
				this.tableDataComputed = this.tableData.filter(item => {
					return (val.length === 0 || val.includes(item.id))
				})
			}
		}
	},
	computed: {
		mainUnitName () {
			let unit = (this.itemDetails.itemUnitList || []).find(item => {
				return item.reportFlag === 1
			})
			if (!unit) {
				unit = (this.itemDetails.itemUnitList || []).find(item => {
					return item.mainFlag === 1
				}) || {}
			}
			return unit.name
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.dialogVisible = true
			})
		},
		onClose () {
			this.defaultTableSelect = []
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.detailsTable.clear()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		refresh () {
			this.initOrganTree().then(this.refreshConnectList)
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		beforeRowEdit (row) {
			const hasRow = this.defaultTableSelect.find(item => {
				return row.id === item.id
			})
			if (!hasRow) {
				this.defaultTableSelect.push(row)
			}
			return Promise.resolve()
		},
		onSaveClick () {
			return this.checkDetailsUnSaving().then(() => {
				return this.$refs.detailsTable.getSelectRows(false).then(res => {
					const selectRows = this.$fxUtils.deepClone(res)
					selectRows.forEach(item => {
						delete item.isEdit
						delete item.$fxCalculation
						delete item.$fxIndex
					})
					const logger = this.$fxLogger.createInfo('basic-archives.item-manage.connectStore', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
					return this.$fxApi('item.saveConnectStore', this.itemDetails.id)({ data: res, logger }).then(res => {
						this.fxDataVerification.resetData(selectRows)
						return Promise.resolve()
					})
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
			return this.$fxApi('item.getConnectStore', this.itemDetails.id).then(res => {
				this.tableData = res
				this.tableDataComputed = res
				return Promise.resolve()
			})
		},
		optimalStoreRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`optimalStore-${$index}`}
				vModel={row.optimalStore}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='optimalStore'
			></fx-list-cell-input-number>
		},
		maxStoreRender (h, { row, $index }) {
			h = this.$createElement
			const selectOption = [{
				id: '0',
				name: '无上限'
			}, {
				id: '1',
				name: '有上限'
			}]
			return <section class='flex-cell'><fx-list-cell-select
				class='flex-part'
				ref={`maxStoreFlag-${$index}`}
				vModel={row.maxStoreFlag}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='maxStoreFlag'
				cellText={this.maxStoreText(row)}
				selectOptionList={selectOption}
				on-on-change={this.onMaxStoreFlagChange}
				on-on-select-enter={this.onMaxStoreFlagEnter}
				asyncClick={this.onMaxStoreFlagClick}
			></fx-list-cell-select><fx-list-cell-input-number
				class='flex-long'
				ref={`maxStore-${$index}`}
				vModel={row.maxStore}
				isEdit={row.isEdit}
				row={row}
				disabled={row.maxStoreFlag === '0'}
				cellText={''}
				rowIndex={$index}
				columnProp='maxStore'
				pointSize='4'
			>
			</fx-list-cell-input-number></section>
		},
		maxStoreText (row) {
			let text
			if (row.maxStoreFlag === '0') {
				text = '无上限'
			} else {
				text = `上限：${row.maxStore}`
			}
			return text
		},
		onMaxStoreFlagChange (item, row) {
			if	(item.id === '0') {
				row.maxStore = 0
			}
		},
		onMaxStoreFlagEnter (row) {
			this.$nextTick(() => {
				if (row.maxStoreFlag === '0') {
					this.$refs.detailsTable.setListCellFocus('minStoreFlag')
				} else {
					this.$refs.detailsTable.setListCellFocus('maxStore')
				}
			})
		},
		onMaxStoreFlagClick (item, row) {
			return new Promise(() => {
				this.onMaxStoreFlagEnter(row)
			})
		},
		minStoreRender (h, { row, $index }) {
			h = this.$createElement
			const selectOption = [{
				id: '0',
				name: '无下限'
			}, {
				id: '1',
				name: '有下限'
			}]
			return <section class='flex-cell'><fx-list-cell-select
				class='flex-part'
				ref={`minStoreFlag-${$index}`}
				vModel={row.minStoreFlag}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='minStoreFlag'
				cellText={this.minStoreText(row)}
				selectOptionList={selectOption}
				on-on-change={this.onMinStoreFlagChange}
				on-on-select-enter={this.onMinStoreFlagEnter}
				asyncClick={this.onMinStoreFlagClick}
			></fx-list-cell-select><fx-list-cell-input-number
				class='flex-long'
				ref={`minStore-${$index}`}
				vModel={row.minStore}
				isEdit={row.isEdit}
				row={row}
				disabled={row.minStoreFlag === '0'}
				cellText={''}
				rowIndex={$index}
				columnProp='minStore'
				pointSize='4'
			>
			</fx-list-cell-input-number></section>
		},
		minStoreText (row) {
			let text
			if (row.minStoreFlag === '0') {
				text = '无下限'
			} else {
				text = `下限：${row.minStore}`
			}
			return text
		},
		onMinStoreFlagChange (item, row) {
			if	(item.id === '0') {
				row.minStore = 0
			}
		},
		onMinStoreFlagEnter (row) {
			this.$nextTick(() => {
				if (row.minStoreFlag !== '0') {
					this.$refs.detailsTable.setListCellFocus('minStore')
				} else {
					this.$refs.detailsTable.doRowEditEnter()
				}
			})
		},
		onMinStoreFlagClick (item, row) {
			return new Promise(() => {
				this.onMinStoreFlagEnter(row)
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				let flag = false
				if (setting.type === 1) {
					flag = res.some(item => {
						return item.minStoreFlag === '1' && setting.maxStoreFlag === '1' && (setting.maxStore < item.minStore)
					})
				} else if (setting.type === 2) {
					flag = res.some(item => {
						return item.maxStoreFlag === '1' && setting.minStoreFlag === '1' && (item.maxStore < setting.minStore)
					})
				}
				if (flag) {
					this.$fxMessage.warning('库存上限不能小于库存下限')
					return
				}
				res.forEach(item => {
					if (setting.type === 0) {
						item.optimalStore = setting.optimalStore
					} else if (setting.type === 1) {
						item.maxStoreFlag = setting.maxStoreFlag
						item.maxStore = setting.maxStore
					} else if (setting.type === 2) {
						item.minStoreFlag = setting.minStoreFlag
						item.minStore = setting.minStore
					}
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
			&-heightline {
				font-size: 14px
				font-weight: 700
			}
			&-name {
				margin-right: 30px
			}
		}
		>>>.tools-left{
			flex-direction: row-reverse
		}
		>>>.tools-left-left {
			display flex
			justify-content flex-end
			flex 0
		}
	}
}
.flex-cell{
	display: flex
	.flex-part {
		display inline-block
		width 100px
	}
	.flex-long {
		flex 1
		display inline-block
	}
}
</style>
