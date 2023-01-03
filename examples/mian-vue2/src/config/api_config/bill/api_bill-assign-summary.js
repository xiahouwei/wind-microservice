import { get, post, put } from '@/js/api/dataSource'
import app from '@/main.js'
export default {
	// 分派汇总表
	assignSummary: {
		// 买方\卖方机构下拉列表(tab分页数据结构)
		getOrganSelectTab () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 查询采购方案下拉列表
		getStockPlanList () {
			return get({ url: '/plan/stock/v1/list' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 客户类别列表查询
		getCustomerTypeList () {
			return get({ url: '/archive/customer_type/v1/search' })
		},
		// 获取入库/出库仓库下拉列表(tab分页数据结构)
		getHouseList () {
			const params = {
				organTypeList: [2, 1, 5, 6]
			}
			return post({
				url: '/archive/house/v1/all/simple/tab',
				data: params,
				success: res => {
					res.forEach(item => {
						if (!item.listData) {
							item.listData = []
						}
					})
					return res
				}
			})
		},
		// 获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 获取品项自定义分组
		getItemCustomGroup () {
			return post({ url: '/archive/custom_group/v1/search' })
		},
		// 获取品项财务类别关系表
		getItemFinanceType () {
			return post({ url: '/archive/finance_sort/v1/assign' })
		},
		// 分派汇总查询
		getAssignSummary () {
			return post({ url: '/bill/assign_summary/v1/getAssignSummary' })
		},
		// 分派汇总入库明细查询
		getAssignSummaryInStoreDetails () {
			return post({ url: '/bill/in_store/1/detail/v1/assignSummaryDetail' })
		},
		// 分派汇总出库明细查询
		getAssignSummaryOutStoreDetails () {
			return post({ url: '/bill/out_store/1/detail/v1/assignSummaryDetail' })
		},
		// 分派汇总销售明细查询
		getAssignSummarySaleOrderDetails () {
			return post({ url: '/bill/sales_order/1/detail/v1/assignSummaryDetail' })
		},
		// 分派汇总更新入库明细
		updateAssignSummaryInStoreDetails () {
			return post({ url: '/bill/in_store/1/detail/v1/assignSummaryModDetail', autoErrorMsg: false })
		},
		// 分派汇总更新出库明细
		updateAssignSummaryOutStoreDetails () {
			return post({ url: '/bill/out_store/1/detail/v1/assignSummaryModDetail', autoErrorMsg: false })
		},
		// 分派汇总更新销售明细
		updateAssignSummarySaleOrderDetails () {
			return post({ url: '/bill/sales_order/1/detail/v1/assignSummaryModDetail', autoErrorMsg: false })
		},
		// 分派汇总excel导出
		exportAssignSummaryExcel () {
			return post({ url: '/excel/assign_summary/v1/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// {{{ 打印样式
		// 查询打印样式
		getPrintStyleList () {
			return post({
				url: '/bill/assign_summary/v1/print_style/all',
				success: res => {
					res.forEach(item => {
						item.style = app.vue.$fxUtils.JSONparse(item.style, 'object')
					})
					return res
				}
			})
		},
		// 新增打印样式
		addPrintStyle (data) {
			data.style = JSON.stringify(data.style)
			return post({ url: '/bill/assign_summary/v1/print_style', data, autoSuccessMsg: true })
		},
		// 修改打印样式
		updatePrintStyle (data) {
			data.style = JSON.stringify(data.style)
			return put({ url: '/bill/assign_summary/v1/print_style', data, autoSuccessMsg: true })
		},
		// 删除打印样式
		delPrintStyle (id) {
			return put({ url: `/bill/assign_summary/v1/print_style/del/${id}`, autoSuccessMsg: true })
		},
		// }}}
		// {{{ 查询方案
		// 查询查询方案列表
		getSearchPlanList () {
			return post({
				url: '/bill/assign_summary/v1/condition/all',
				success: res => {
					res.forEach(item => {
						item.searchCondition = app.vue.$fxUtils.JSONparse(item.searchCondition, 'object')
					})
					return res
				}
			})
		},
		// 新增查询方案
		addSearchPlan (data) {
			data.searchCondition = JSON.stringify(data.searchCondition)
			return post({ url: '/bill/assign_summary/v1/condition', data, autoSuccessMsg: true })
		},
		// 修改查询方案
		updateSearchPlan (data) {
			data.searchCondition = JSON.stringify(data.searchCondition)
			return put({ url: '/bill/assign_summary/v1/condition', data, autoSuccessMsg: true })
		},
		// 删除查询方案
		delSearchPlan (id) {
			return put({ url: `/bill/assign_summary/v1/condition/del/${id}`, autoSuccessMsg: true })
		}
		// }}}
	}
}
