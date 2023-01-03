<template>
	<w-app-container>
		<div class="header-container">
			<fx-page-header title="分派汇总查询"></fx-page-header>
			<div class="btn-container" v-show="showSearch">
				<div class="search-plan-select">
					选择查询方案
					<w-select
						v-model="searchPlan"
						:optionlist="searchPlanList"
						clearable
						class="form-item-input"
						@change="onSearchPlanChange"
					>
					</w-select>
				</div>
				<el-button type="primary" @click="onSaveSearchPlanClick">保存查询方案</el-button>
				<el-button type="danger" :disabled="!searchPlan" @click="onDelSearchPlanClick">删除查询方案</el-button>
				<el-button class="search-btn" type="primary" @click="onSearchClick">查询</el-button>
			</div>
			<div class="btn-container" v-show="showTable">
				<div class="business-date-text">{{businessDateText}}：{{beginDateText}} - {{endDateText}}</div>
				<el-button v-if="showCheckStock" class="search-btn" type="primary" @click="onCheckStockClick">查询库存</el-button>
				<el-button class="search-btn" plain @click="onPrintClick">打印</el-button>
				<el-button class="search-btn" type="primary" @click="onExportClick">导出</el-button>
				<el-button class="search-btn" plain @click="onBackClick">返回</el-button>
			</div>
		</div>
		<w-app-container direction="row" class="fx-page-first-container">
			<search-container
				ref="searchContainer"
				v-show="showSearch"
				@on-datasource-change="onDatasourceChange"
			></search-container>
			<table-container
				ref="tableContainer"
				v-show="showTable"
				:summaryData="summaryData"
				:searchData="searchData"
				@on-refresh="onSearchClick"
			></table-container>
		</w-app-container>
		<searchPlanCreateDialog
			ref="searchPlanCreateDialog"
			@on-save-plan="onSaveSearchPlan"
			@on-del-plan="onDelSearchPlan"
		></searchPlanCreateDialog>
	</w-app-container>
</template>
<script>
import searchContainer from './components/search-container/Index.vue'
import tableContainer from './components/table-container/Index.vue'
import searchPlanCreateDialog from './components/SearchPlanCreateDialog.vue'
export const apiName = 'assignSummary'
export default {
	name: 'assignSummarySheet',
	components: {
		searchContainer,
		tableContainer,
		searchPlanCreateDialog
	},
	data () {
		return {
			showSearch: true,
			showTable: false,
			searchData: {},
			summaryData: { columnData: [], tableData: [] },
			searchPlan: '',
			searchPlanList: []
		}
	},
	computed: {
		businessDateText () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('dateType')(this.searchData.dateType).name
		},
		beginDateText () {
			return this.searchData.startDate
		},
		endDateText () {
			return this.searchData.endDate
		},
		exportDisabled () {
			return !this.summaryData.tableData.length
		},
		showCheckStock () {
			return !!this.searchData.showInHouseName || !!this.searchData.showOutHouseName || this.searchData.summaryType === 1
		},
		currentSearchPlanObj () {
			return this.searchPlanList.find(item => {
				return item.id === this.searchPlan
			})
		}
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.initData()
			this.getSearchPlanList()
		}
	},
	methods: {
		initData () {
			this.showSearch = true
			this.showTable = false
			this.$refs.searchContainer.initData()
		},
		onSearchClick () {
			this.searchData = this.$refs.searchContainer.getSearchData()
			this.searchData.showHouseAmount = 0
			return this.$fxApi(`${apiName}.getAssignSummary`)({ data: this.searchData }).then(res => {
				this.summaryData = res.tableData ? res : { columnData: [], tableData: [] }
				this.showSearch = false
				this.showTable = true
				this.$nextTick(() => {
					this.$refs.tableContainer.setTableData()
				})
			})
		},
		onExportClick () {
			if (this.exportDisabled) {
				this.$fxMessage.warning('当前无明细，不允许导出！')
				return false
			}
			this.searchData.showHouseAmount = 0
			return this.$fxApi(`${apiName}.exportAssignSummaryExcel`)({ data: this.searchData }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onBackClick () {
			this.showSearch = true
			this.showTable = false
		},
		onCheckStockClick () {
			this.searchData.showHouseAmount = 1
			return this.$fxApi(`${apiName}.getAssignSummary`)({ data: this.searchData }).then(res => {
				this.summaryData = res.tableData ? res : { columnData: [], tableData: [] }
				this.$nextTick(() => {
					this.$refs.tableContainer.setTableData()
				})
			})
		},
		onPrintClick () {
			this.$refs.tableContainer.onPrint()
		},
		getSearchPlanList (id = '') {
			return this.$fxApi(`${apiName}.getSearchPlanList`).then(res => {
				this.searchPlanList = res
				this.searchPlan = id
			})
		},
		onSearchPlanChange (id, plan) {
			this.$refs.searchContainer.resetSearchData(plan.searchCondition)
		},
		onSaveSearchPlanClick () {
			if (this.searchPlan) {
				this.$refs.searchPlanCreateDialog.open(this.currentSearchPlanObj.name, 'edit')
			} else {
				this.$refs.searchPlanCreateDialog.open('', 'add')
			}
		},
		onDelSearchPlanClick () {
			this.$refs.searchPlanCreateDialog.open(this.currentSearchPlanObj.name, 'del')
		},
		onDatasourceChange () {
			this.searchPlan = ''
		},
		getSearchPlan (name, isAdd) {
			const searchPlan = isAdd ? { name, searchCondition: {} } : this.$fxUtils.deepClone(this.currentSearchPlanObj)
			searchPlan.name = name
			searchPlan.searchCondition = this.$refs.searchContainer.getSearchData()
			return searchPlan
		},
		onSaveSearchPlan (name) {
			const isAdd = !this.searchPlan
			const	saveApi = isAdd ? 'addSearchPlan' : 'updateSearchPlan'
			const logger = this.$fxLogger.createInfo(`stock-sale-manage.assign-summary-sheet.${saveApi}`, { name })
			return this.$fxApi(`${apiName}.${saveApi}`, this.getSearchPlan(name, isAdd))({ logger }).then(res => {
				this.getSearchPlanList(res.id)
			})
		},
		onDelSearchPlan (name) {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-summary-sheet.delSearchPlan', { name })
			return this.$fxApi(`${apiName}.delSearchPlan`, this.searchPlan)({ logger }).then(() => {
				this.$refs.searchContainer.resetSearchData()
				this.getSearchPlanList()
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.header-container {
	position relative
	display flex
	justify-content space-between
	align-items center
	padding-right 20px
	&:after {
		content: ''
		position absolute
		bottom 0
		left 10px
		height 1px
		width calc( 100% - 30px )
		background-color $fxBorder
	}
	.btn-container {
		display flex
		align-items center
		.business-date-text {
			margin-right 50px
		}
		.search-plan-select {
			margin-right 15px
			.form-item-input {
				margin-left 10px
				width 180px
			}
		}
	}
}
</style>
