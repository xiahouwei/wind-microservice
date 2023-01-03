<template>
	<div class="price-plan-container">
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
		<pricePlanSettingDetail
			ref="pricePlanSettingDetail"
			v-show="showSettingBtn"
			:itemDetails="itemDetails"
			@on-save-detail="onSaveDetail"
		>
		</pricePlanSettingDetail>
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
import pricePlanSettingDetail from './PricePlanSettingDetail.vue'
export default {
	name: 'pricePlanSetting',
	components: {
		pricePlanSettingDetail
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
				title: '已关联价格方案'
			}, {
				id: 'unconnected',
				title: '未关联价格方案'
			}],
			tableColumn: [
				{ prop: 'code', label: '方案编号', required: true, sortable: true, width: '140px' },
				{ prop: 'name', label: '方案名称', required: true, sortable: true },
				{
					prop: 'sellerName',
					label: '卖方机构',
					required: true,
					formatter: (row) => {
						return row.sellerOrganList.map(item => item.organName).join(',')
					}
				},
				{
					prop: 'buyerName',
					label: '买方机构',
					required: true,
					formatter: (row) => {
						return row.buyerOrganList.map(item => item.organName).join(',')
					}
				},
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
					prop: 'billState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
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
		billState () {
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
			this.$refs.pricePlanSettingDetail.initData()
			this.getItemPricePlanList()
		},
		getItemPricePlanList () {
			return this.$fxApi('item.getItemPricePlanList', this.itemDetails.id).then(res => {
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
		billStateRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.billState(row.billState, 'icon')}
				label={this.billState(row.billState, 'label')}
			></fx-list-state-tag>
		},
		onSaveDetail (detail) {
			this.$refs.detailsTable.getSelectRows().then(selectRows => {
				const data = selectRows.map(item => {
					const params = this.$fxUtils.deepClone(detail)
					params.planId = item.id
					params.planName = item.name
					return params
				})
				this.onSaveDetailHandler(data)
			})
		},
		onSaveDetailHandler (data) {
			const settingInfo = this.getAddItemInfo(data)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.setItemPricePlan', { settingInfo })
			this.$fxApi('item.setItemPricePlan')({ data, logger }).then(this.getItemPricePlanList).then(() => {
				this.$refs.detailsTable.clearSelected()
			})
		},
		getAddItemInfo (data) {
			const planNames = data.map(item => item.planName).join(',')
			return `品项名称:${this.itemDetails.name},关联价格方案:${planNames}`
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.price-plan-container {
	flex 1
	display: flex
	flex-direction: column
}
</style>
