import { get, post, put } from '@/js/api/dataSource'
export default {
	// 采购计划单分派
	stockPlanAssign: {
		// 步骤一列表分页查询
		getAssignPage () {
			return post({ url: '/bill/stock_plan_assign/v1/page' })
		},
		// 主列表筛选条件：查询买方机构下拉列表(tab分页数据结构)
		getOrganSelectTab (typeList = []) {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 主列表筛选条件：获取业务类型列表
		getBusinessList () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/200' })
		},
		// 主列表筛选条件：查询订货方案下拉列表
		getPurchasePlanSelect () {
			return get({ url: '/plan/stock/v1/list' })
		},
		// 主列表筛选条件：获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 主列表筛选条件：查询品项下拉列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 分页查询-买方仓库下拉列表(tab分页数据结构)
		getBuyerHouseSelectTab () {
			const params = {
				organTypeList: ['2', '1', '5', '6']
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
		// 步骤一
		// 整单放弃
		giveupBills () {
			return put({ url: '/bill/stock_plan_assign/v1/give_up', autoSuccessMsg: true })
		},
		// 获取筛选条件中订货时间的默认值
		getAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 解除锁定
		unlock () {
			return put({ url: '/bill/stock_plan_assign/v1/page/unlock', autoSuccessMsg: true })
		},
		// 查看放弃
		giveUpList () {
			return post({ url: '/bill/stock_plan_assign/v1/page/give_up' })
		},
		// 步骤二
		// 获取详情
		getLockSummary () {
			return post({
				url: '/bill/stock_plan_assign/v1/page/lock_summary',
				autoSuccessMsg: true,
				success: res => {
					res.forEach(item => {
						item.otherOrgan && (item.stockWay = item.otherOrgan.stockWay || 1)
						item.otherOrgan && (item.otherOrgan.sellerOrganId = item.otherOrgan.id)
					})
					return res
				}
			})
		},
		// 获取卖方机构列表
		getSellerListNew () {
			return post({ url: '/archive/bill/employee_organ/v1/seller_organ_list_new' })
		},
		// 单品放弃
		detailsGiveUp () {
			return put({ url: '/bill/stock_plan_assign/v1/details/give_up', autoSuccessMsg: true })
		},
		// 根据买方机构ID和品项ID列表查询品项的可入库仓库列表
		houseIdList () {
			return post({ url: '/bill/in_assign/v1/houseList' })
		},
		// 根据采购方案查询品项的可入库仓库列表
		organListByPlan (planId) {
			return post({ url: `/bill/stock_plan_assign/v1/stock_plan/organ/${planId}` })
		},
		organListAll () {
			const params = { ids: [], names: ['Shop', 'Center', 'Supplier', 'Customer'] }
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list', data: params })
		},
		// 进行分派
		assign () {
			return post({ url: '/bill/stock_plan_assign/v1/assign', autoSuccessMsg: true })
		},
		// 刷新帐存
		refreshAmount () {
			return post({ url: '/bill/stock_plan_assign/v1/refresh/stock/amount', autoSuccessMsg: true })
		},
		// 步骤三
		// 分页查询
		getAssigned () {
			return post({ url: '/bill/stock_plan_assign/v1/page/bill/list' })
		}
	}
}
