<template>
	<div class="take-stock-class-container">
		<el-tabs
			v-model="currentTag"
			type="card"
		>
			<el-tab-pane
				v-for="item in tagData"
				:key="item.id"
				:label="item.title"
				:name="item.id"
			>
			</el-tab-pane>
		</el-tabs>
		<w-link
			v-show="showSettingBtn"
			type="primary"
			icon="table-details-setting"
			class="setting-link"
			@click="onSaveClick"
		>
			设置为关联盘点分类
		</w-link>
		<fx-details-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:tableData="currentTableData"
			:canAdd="false"
			:showTools="false"
			:defaultSortParam="defaultSortParam"
		>
		</fx-details-table>
	</div>
</template>

<script>
export default {
	name: 'takeStockClassSetting',
	props: {
		itemDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			noItemData: [],
			hasItemData: [],
			currentTag: 'connected',
			tagData: [{
				id: 'connected',
				title: '已关联盘点分类'
			}, {
				id: 'unconnected',
				title: '未关联盘点分类'
			}],
			tableColumn: [
				{ prop: 'code', label: '分类编号', required: true, sortable: true },
				{ prop: 'name', label: '分类名称', required: true },
				{
					prop: 'inHouseNames',
					label: '适用仓库',
					required: true,
					formatter: row => {
						return row.relAllHouses === 1 ? '全部仓库' : row.checkClassHouse.map(item => {
							return item.houseName
						}).join(',')
					}
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'memo', label: '整单备注' }
			],
			defaultSortParam: { code: 'asc' }
		}
	},
	computed: {
		currentTableData () {
			return this.currentTag === 'connected' ? this.hasItemData : this.noItemData
		},
		showSettingBtn () {
			return this.currentTag === 'unconnected'
		},
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		}
	},
	watch: {
		currentTag () {
			this.$refs.detailsTable.clearSelected()
		}
	},
	methods: {
		initData () {
			this.currentTag = 'connected'
			this.$refs.detailsTable.clearSelected()
			this.getItemTakeStockClassList()
		},
		getItemTakeStockClassList () {
			return this.$fxApi('item.getItemTakeStockClassList', this.itemDetails.id).then(res => {
				const { noItemData, hasItemData } = res
				this.noItemData = noItemData
				this.hasItemData = hasItemData
				return Promise.resolve()
			})
		},
		enableRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></fx-list-state-tag>
		},
		onSaveClick () {
			this.$refs.detailsTable.getSelectRows().then(selectRows => {
				this.onSaveDetailHandler(selectRows)
			})
		},
		onSaveDetailHandler (selectRows) {
			const settingInfo = this.getAddItemInfo(selectRows)
			const data = selectRows.map(item => {
				return { id: item.id }
			})
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.setItemTakeStockClass', { settingInfo })
			this.$fxApi('item.setItemTakeStockClass', this.itemDetails.id)({ data, logger }).then(this.getItemTakeStockClassList).then(() => {
				this.$refs.detailsTable.clearSelected()
			})
		},
		getAddItemInfo (selectRows) {
			const planNames = selectRows.map(item => item.name).join(',')
			return `品项名称:${this.itemDetails.name};关联盘点分类:${planNames}`
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.take-stock-class-container {
	flex 1
	display: flex
	flex-direction: column
	.setting-link {
		display inline-block
		margin-top 5px
		margin-bottom 15px
	}
}
</style>
