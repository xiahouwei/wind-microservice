<template>
	<div class="stock-plan-container">
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
		<stockPlanSettingDetail
			ref="stockPlanSettingDetail"
			v-show="showSettingBtn"
			:itemDetails="itemDetails"
			@on-save-detail="onSaveDetail"
		>
		</stockPlanSettingDetail>
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
import stockPlanSettingDetail from './StockPlanSettingDetail.vue'
export default {
	name: 'stockPlanSetting',
	components: {
		stockPlanSettingDetail
	},
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
				title: '已关联订货方案'
			}, {
				id: 'unconnected',
				title: '未关联订货方案'
			}],
			tableColumn: [
				{ prop: 'code', label: '方案编号', required: true, sortable: true, width: '140px' },
				{ prop: 'name', label: '方案名称', required: true, sortable: true },
				{ prop: 'buyerName', label: '买方机构', required: true },
				{
					prop: 'beginDate',
					label: '起始日期',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.setDate(row.beginDate)
					}
				},
				{
					prop: 'endDate',
					label: '截止日期',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.setDate(row.endDate)
					}
				},
				{
					prop: 'planState',
					label: '审核状态',
					required: true,
					fxRender: this.planStateRender
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'memo', label: '备注' }
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
		},
		planState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('planState')(val)[key]
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
			this.$refs.stockPlanSettingDetail.initData()
			this.getItemStockPlanList()
		},
		getItemStockPlanList () {
			return this.$fxApi('item.getItemStockPlanList', this.itemDetails.id).then(res => {
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
		planStateRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.planState(row.planState, 'icon')}
				label={this.planState(row.planState, 'label')}
			></fx-list-state-tag>
		},
		onSaveDetail (detail) {
			this.$refs.detailsTable.getSelectRows().then(selectRows => {
				detail.stockCycle = detail.cycleWay === 5 ? detail.stockCycle : detail.cycleDay.join(',')
				const data = selectRows.map(item => {
					const params = this.$fxUtils.deepClone(detail)
					params.planId = item.id
					params.planName = item.name
					params.itemId = params.item.id
					params.itemName = params.item.name
					params.sellerName = params.sellerOrganInfo.name
					delete params.sellerOrganInfo
					delete params.sellerHouseInfo
					delete params.item
					delete params.itemUnit
					return params
				})
				this.onSaveDetailHandler(data)
			})
		},
		onSaveDetailHandler (data) {
			const settingInfo = this.getAddItemInfo(data)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.setItemStockPlan', { settingInfo })
			this.$fxApi('item.setItemStockPlan')({ data, logger }).then(this.getItemStockPlanList).then(() => {
				this.$refs.detailsTable.clearSelected()
			})
		},
		getAddItemInfo (data) {
			const params = data[0]
			const planNames = data.map(item => item.planName).join(',')
			const crossOrganNames = params.crossStockText || '/'
			const stockWay = params.stockWay === 1 ? '直发' : '越库'
			const sellerName = params.sellerName
			const defaultCrossStock = params.defaultCrossStock || '/'
			return `卖方机构:${sellerName},品项名称:${params.itemName},订货方式:${stockWay},越库实际供货方:${crossOrganNames},默认越库实际供货方:${defaultCrossStock};关联订货方案:${planNames}`
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.stock-plan-container {
	flex 1
	display: flex
	flex-direction: column
}
</style>
