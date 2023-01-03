<template>
	<w-scroll-bar>
		<div class="search-container">
			<el-form ref="form" :model="searchData" size="mini" label-width="111px">
				<basic-info
					ref="basicInfoRef"
					:searchData="searchData"
					@on-datasource-change="onDatasourceChange"
				></basic-info>
				<organ-info
					ref="organInfoRef"
					:searchData="searchData"
				></organ-info>
				<item-info
					ref="itemInfoRef"
					:searchData="searchData"
				></item-info>
				<display-style
					:searchData="searchData"
				></display-style>
			</el-form>
		</div>
	</w-scroll-bar>
</template>

<script>
import basicInfo from './BasicInfo.vue'
import organInfo from './OrganInfo.vue'
import itemInfo from './ItemInfo.vue'
import displayStyle from './DisplayStyle.vue'
const SEARCH_DATA = {
	datasource: 2,
	billType: [],
	billState: 1,
	dateType: 0,
	startDate: '',
	endDate: '',
	stockPlan: [],
	operator: [],
	stockWay: [],
	urgent: null,
	inOrganType: [],
	inOrgan: [],
	customerType: [],
	showCustomerType: 0,
	inHouse: [],
	outOrganType: [],
	outOrgan: [],
	outHouse: [],
	showInHouseName: 0,
	showOutHouseName: 0,
	showHouseAmount: 0,
	itemType: [],
	showItemType: 1,
	itemFinanceSortList: [],
	showItemFinanceSort: 0,
	itemCategory: [],
	showItemCategory: 0,
	itemUnit: 0,
	showItemUnit: 1,
	showItemCode: 0,
	showItemSpec: 0,
	showAssistUnit: 0,
	showShelfLifeDays: 0,
	showItemMemo: 0,
	showPutShelf: 0,
	showType: 2,
	summaryType: 2,
	summaryCategory: 0,
	itemOrderRule: 0,
	inOrderRule: 0,
	outOrderRule: 0,
	showBillDetail: 1,
	showRowIndex: 0,
	showRowSum: 1,
	showInOrgan: 0,
	nullRow: null,
	customGroupIdList: []
}
export default {
	name: 'searchContainer',
	components: {
		basicInfo,
		organInfo,
		itemInfo,
		displayStyle
	},
	data () {
		return {
			searchData: this.$fxUtils.deepClone(SEARCH_DATA)
		}
	},
	methods: {
		initData () {
			this.searchData = this.$fxUtils.deepClone(SEARCH_DATA)
			this.$refs.basicInfoRef.initData()
			this.$refs.organInfoRef.initData()
			this.$refs.itemInfoRef.initData()
		},
		getSearchData () {
			return this.searchData
		},
		onDatasourceChange (id) {
			this.searchData = this.$fxUtils.deepClone(SEARCH_DATA)
			this.searchData.datasource = id
			this.$emit('on-datasource-change')
			switch (id) {
			case 0:
				this.searchData.billType = [1002, 1005]
				this.searchData.showType = 0
				this.searchData.summaryType = 0
				this.searchData.showInOrgan = 0
				break
			case 1:
				this.searchData.billType = [2001, 2005]
				this.searchData.showType = 0
				this.searchData.summaryType = 0
				this.searchData.showInOrgan = 1
				break
			case 2:
				this.searchData.billType = []
				this.searchData.showType = 2
				this.searchData.summaryType = 2
				this.searchData.showInOrgan = 0
				break
			}
		},
		resetSearchData (searchData) {
			if (searchData) {
				this.searchData = this.$fxUtils.deepClone(SEARCH_DATA)
				for (const key in this.searchData) {
					if (Object.hasOwnProperty.call(searchData, key)) {
						this.searchData[key] = searchData[key]
					}
				}
				this.filterSearchData()
			} else {
				this.onDatasourceChange(this.searchData.datasource)
			}
			this.$refs.basicInfoRef.setDateRange()
		},
		filterSearchData () {
			const { stockPlanList, operatorList } = this.$refs.basicInfoRef.parentGetSelectData()
			const { inOrganList, customerTypeList, inHouseList, outOrganList, outHouseList } = this.$refs.organInfoRef.parentGetSelectData()
			const { itemCascaderData, itemFinanceData, itemCustomGroupList } = this.$refs.itemInfoRef.parentGetSelectData()
			this.searchData.stockPlan = this.filterData(this.searchData.stockPlan, stockPlanList)
			this.searchData.operator = this.filterData(this.searchData.operator, operatorList)
			this.searchData.inOrgan = this.filterTabData(this.searchData.inOrgan, inOrganList)
			this.searchData.customerType = this.filterData(this.searchData.customerType, customerTypeList)
			this.searchData.inHouse = this.filterData(this.searchData.inHouse, inHouseList)
			this.searchData.outOrgan = this.filterTabData(this.searchData.outOrgan, outOrganList)
			this.searchData.outHouse = this.filterData(this.searchData.outHouse, outHouseList)
			this.searchData.itemType = this.filterTabData(this.searchData.itemType, itemCascaderData, 'children')
			this.searchData.itemFinanceSortList = this.filterData(this.searchData.itemFinanceSortList, itemFinanceData)
			this.searchData.customGroupIdList = this.filterData(this.searchData.customGroupIdList, itemCustomGroupList)
		},
		filterData (data, list) {
			const listMap = this.$fxUtils.compareArrayUtils(list, { key: 'id' })
			return data.filter(item => {
				return listMap.has(item)
			})
		},
		filterTabData (data, tabList, listData = 'listData') {
			const flattenList = this.$fxUtils.arrFlatten(tabList, (listItem) => {
				return listItem[listData]
			})
			return this.filterData(data, flattenList)
		}
	}
}
</script>

<style lang="stylus" scoped>
.search-container {
	padding-left 20px
}
</style>
