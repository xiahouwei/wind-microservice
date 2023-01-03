<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="存放货位设置" heightFullscreen @close="onClose">
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
					:selectedRows="defaultTableSelect"
					:fpBeforeRowEdit="beforeRowEdit"
					:searchProps="searchProps"
					:tableEditColumnProp="tableEditColumnProp"
					:showColumnFilterBtn="false"
					:canAdd="false"
					:showDeleteBtn="false"
					:fullScreenBtn="false"
				>
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
const EDIT_INPUT_TYPE = ['locationId']
const SEARCH_PROPS = ['organName', 'houseName']
export default {
	name: 'connect-store',
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
				{ prop: 'organName', label: '机构名称', required: true },
				{ prop: 'houseName', label: '仓库名称', required: true },
				{
					prop: 'locationId',
					label: '默认存放货位设置',
					required: true,
					fxRender: this.locationIdRender,
					click: this.onCellClick('locationId')
				}
			],
			tableData: [],
			defaultTableSelect: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCache: this.$fxUtils.fxCache('item-manage'),
			tableEditColumnProp: EDIT_INPUT_TYPE,
			searchProps: SEARCH_PROPS,
			selectOptionProp: {
				name: 'houseItemLocationInfo',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			locationSelectLoading: false,
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
			this.fxCache.clear()
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
					const logger = this.$fxLogger.createInfo('basic-archives.item-manage.connectLocation', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
					return this.$fxApi('item.saveConnectLocation', this.itemDetails.id)({ data: res, logger }).then(res => {
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
			return this.$fxApi('item.getConnectLocation', this.itemDetails.id).then(res => {
				this.tableData = res
				this.tableDataComputed = res
				return Promise.resolve()
			})
		},
		locationIdRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`locationId-${$index}`}
				vModel={row.locationId}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='locationId'
				loading={this.locationSelectLoading}
				cellText={row.houseItemLocationInfo}
				selectOptionProp={this.selectOptionProp}
				selectOptionList={this.locationList}
				fpSelectShow={this.locationSelectShow(row)}
				on-on-change={this.onLocationIdChange}
			></fx-list-cell-select>
		},
		locationSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.locationSelectLoading = true
					this.getLocationList(row).then(res => {
						this.locationSelectLoading = false
						this.locationList = res || []
						resolve()
					})
				})
			}
		},
		onLocationIdChange (item, row) {
			row.locationId = item.id
			row.houseItemLocationInfo = item.houseItemLocationInfo
		},
		getLocationList (row) {
			const key = `locationList.${this.itemDetails.id}.${row.id}`
			const data = {
				houseId: row.id,
				itemId: this.itemDetails.id
			}
			return this.fxCache.cacher(key, this.$fxApi('item.getLocationList')({ data }))
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
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
			&-heightline {
				font-size: 14px
				font-weight: 700
			}
			&-name {
				margin-right: 30px
			}
		}
		>>>.tools-left-left {
			display flex
			justify-content flex-end
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
