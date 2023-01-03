import { get, post, put } from '@/js/api/dataSource'
import app from '@/main.js'
const API_MODULE = 'stockOfferOrder'
export default {
	// 采购报价单
	stockOfferOrder: {
		// {{{ 主列表筛选条件
		// 主列表筛选条件：查询买方机构下拉列表(tab分页数据结构)
		getOrganSelectTab (typeList = []) {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 主列表筛选条件：查询买方机构下拉列表
		getOrganSelect () {
			return post({ url: '/archive/organ/v1/simple/all' })
		},
		// 主列表筛选条件：卖方机构下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			const params = { organTypeList: ['5'] }
			return post({
				url: '/archive/organ/v1/manage/simple/tab',
				data: params,
				success: res => {
					return res
				}
			})
		},
		// 主列表筛选条件：查询单据类型下拉列表
		getStockOfferTypeSelect () {
			return get({ url: '/bill/stock_offer/v1/types' })
		},
		// }}}
		// 获取业务类型列表
		getBusinessList () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/200' })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getDetailBusinessList (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/200/${type}`, loading: false })
		},
		// 获取买方机构列表
		getBuyerListNew () {
			return post({ url: '/archive/bill/employee_organ/v1/buyer_organ_list_new' })
		},
		getBuyerList () {
			return post({ url: '/archive/bill/employee_organ/v1/buyer_organ_list' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 分页查询
		getPage () {
			return post({ url: '/bill/stock_offer/v1/page', query: { del_flag: false } })
		},
		// 获取当前登录人及所属机构及机构的默认收货地址
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 保存接口
		save (billId) {
			return put({
				url: `/bill/stock_offer/v1/${billId}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, billId),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 根据单据唯一标识查询单据及其明细
		get (id) {
			return get({
				url: `/bill/stock_offer/v1/${id}`,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 提交
		submit (billId) {
			return put({
				url: `/bill/stock_offer/v1/${billId}/submit`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/stock_offer/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (billId) {
			return put({ url: `/bill/stock_offer/v1/${billId}/back`, autoSuccessMsg: true })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/stock_offer/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (billId) {
			return put({
				url: `/bill/stock_offer/v1/${billId}/check`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/stock_offer/v1/check', autoSuccessMsg: true })
		},
		// 反审
		uncheck (billId) {
			return put({
				url: `/bill/stock_offer/v1/${billId}/uncheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/stock_offer/v1/uncheck', autoSuccessMsg: true })
		},
		// 复审
		recheck (billId) {
			return put({
				url: `/bill/stock_offer/v1/${billId}/recheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/stock_offer/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (billId) {
			return put({ url: `/bill/stock_offer/v1/${billId}/un_recheck`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/stock_offer/v1/un_recheck', autoSuccessMsg: true })
		},
		// 批量导出
		exportMulity () {
			return post({ url: '/excel/stock_offer/v1/batch/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 明细
		// 查询明细
		getDetails (id) {
			return get({
				url: `/bill/stock_offer/v1/${id}`,
				success: (res) => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details || []
				}
			})
		},
		// 根据单据id清空单据明细
		clearDetails (billId) {
			return put({ url: `/bill/stock_offer/${billId}/detail/v1/clear`, autoSuccessMsg: true })
		},
		// 按模板导出数据
		exportData (billId) {
			return get({ url: `/excel/stock_offer/v1/${billId}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/stock_offer/v1/${id}/chain` })
		},
		// 获取卖方机构列表
		getSellerListNew () {
			return post({ url: '/archive/bill/employee_organ/v1/seller_organ_list_new' })
		}
	}
}
