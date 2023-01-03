import { get, post, put } from '@/js/api/dataSource'
export default {
	// 出库分派
	outStoreAssign: {
		getPage () {
			return post({ url: '/bill/out_assign/v1/page' })
		},
		// {{{ 主列表筛选条件
		// 主列表筛选条件：查询机构下拉列表
		getOrganSelect () {
			return post({ url: '/archive/organ/v1/simple/all' })
		},
		getOrganSelectTab () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 主列表筛选条件：获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 主列表筛选条件：查询品项下拉列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 主列表筛选条件：查询订货方案下拉列表
		getPurchasePlanSelect () {
			return get({ url: '/plan/stock/v1/list' })
		},
		// }}}
		// 获取卖方机构列表
		getSellerList () {
			return post({ url: '/archive/bill/employee_organ/v1/seller_organ_list_new' })
		},
		// 获取业务类型列表(销售订单)
		getBusinessList () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/202' })
		},
		// 获取买方机构列表
		getBuyerList () {
			return get({ url: '/archive/bill/employee_organ/v1/sales_order/buyer_organ_list' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/enable' })
		},
		// 获取品项列表
		getItemList () {
			return post({ url: '/bill/stock_order/v1/itemList' })
		},
		// 步骤一
		// 整单放弃-单张
		giveupBill (billId) {
			return put({ url: `/bill/out_assign/v1/sales_order/${billId}/give_up`, autoSuccessMsg: true })
		},
		// 整单放弃-批量
		giveupBills () {
			return put({ url: '/bill/out_assign/v1/sales_order/give_up', autoSuccessMsg: true })
		},
		// 获取筛选条件中订货时间的默认值
		getAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 解除锁定
		unlock () {
			return put({ url: '/bill/out_assign/v1/sales_order/unlock', autoSuccessMsg: true })
		},
		// 查看放弃
		giveUpList () {
			return post({ url: '/bill/out_assign/v1/page/give_up' })
		},
		// 恢复
		recover () {
			return put({ url: '/bill/out_assign/v1/sales_order/restore', autoSuccessMsg: true })
		},
		// 步骤二
		// 待分派明细列表查询
		getLockSummary () {
			return post({ url: '/bill/out_assign/v1/page/lock_summary', autoSuccessMsg: true })
		},
		// 单品放弃
		detailsGiveUp () {
			return put({ url: '/bill/out_assign/v1/sales_order/details/give_up', autoSuccessMsg: true })
		},
		// 根据买方机构ID和品项ID列表查询品项的可入库仓库列表
		houseIdList () {
			return post({ url: '/bill/in_assign/v1/houseList' })
		},
		// 刷新帐存
		refreshAmount () {
			return post({ url: '/bill/out_assign/v1/refresh/stock/amount', autoSuccessMsg: true })
		},
		// 进行分派
		assign () {
			return post({ url: '/bill/out_assign/v1/assign', autoSuccessMsg: true })
		},
		// 步骤三
		// 进行分派
		assignedQuery () {
			return post({ url: '/bill/out_assign/v1/assigned/query', autoSuccessMsg: true })
		}
	}
}
