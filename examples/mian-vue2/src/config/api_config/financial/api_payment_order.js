import { get, post, put, del } from '@/js/api/dataSource'
import { EMPTY_TAB_DATA } from '../common'
import app from '@/main.js'
const API_MODULE = 'paymentOrder'

export default {
	// 资金管理-付款单
	paymentOrder: {
		// 分页查询
		getPage () {
			return post({ url: '/finance/payment/v1/page' })
		},
		// 分页查询-付款机构下拉列表(tab分页数据结构)
		getOrganSelect () {
			return post({ url: '/finance/payment/v1/payment/organ', data: [] })
		},
		// 分页查询-收款机构下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			return post({ url: '/finance/payment/v1/collection/organ', data: [] })
		},
		// 分页查询-核算机构下拉列表(tab分页数据结构)
		getDepartmentSelect () {
			const params = { organTypeList: ['2', '1'] }
			return post({
				url: '/archive/finance/department/v1/all/simple/tab',
				data: params,
				loading: false,
				success: res => {
					res.forEach(item => {
						if (!item.listData) {
							item.listData = []
						}
					})
					res.push(EMPTY_TAB_DATA)
					return res
				}
			})
		},
		// 分页查询-获取业务类型列表
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/100', loading: false })
		},
		// 分页查询-获取单据类型列表
		getBillTypeSelect () {
			return get({
				url: '/finance/payment/v1/types',
				success: res => {
					return res[0]
				}
			})
		},
		// 分页查询-获取筛选条件中单据时间的默认值
		getFilterAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 获取经办人列表
		getAgentList () {
			return post({ url: '/archive/bill/employee/v1/operator_list' })
		},
		// 获取当前登录人及所属机构
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 付款机构下拉列表(tab分页数据结构)
		getOrganList () {
			return post({ url: '/finance/payment/v1/payment/organ' })
		},
		// 收款机构下拉列表(tab分页数据结构)
		getOtherOrganList () {
			return post({ url: '/finance/payment/v1/collection/organ' })
		},
		// 获取核算部门接口
		getDepartmentList (organId) {
			return post({ url: `/finance/payment/v1/${organId}/departments`, loading: false })
		},
		// 批量删除单据
		deleteMulity () {
			return del({ url: '/finance/payment/v1/delete', autoSuccessMsg: true })
		},
		// 单个删除单据
		del (id) {
			return del({ url: `/finance/payment/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除空单据
		delEmptyBill (id) {
			return del({ url: `/finance/payment/v1/${id}/silent`, loading: false })
		},
		// 新增单据
		add () {
			return post({
				url: '/finance/payment/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 编辑单据
		edit (id) {
			return put({
				url: `/finance/payment/v1/${id}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, id),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 获取单据详情
		getBill (id) {
			return get({
				url: `/finance/payment/v1/${id}`,
				success: res => {
					!res.department && (res.department = {})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 查询管理单据明细
		getConnectBillDetails (id) {
			return get({
				url: `/finance/payment/v1/${id}`,
				success: res => {
					app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return res.mpaymentPayableDetails
				},
				loading: false
			})
		},
		// 查询结算明细
		getSettlementDetails (id) {
			return get({
				url: `/finance/payment/v1/${id}`,
				success: res => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details
				},
				loading: false
			})
		},
		// 提交
		submit (id) {
			return put({ url: `/finance/payment/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/finance/payment/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({
				url: `/finance/payment/v1/back/${id}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/finance/payment/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/finance/payment/v1/check/${id}`, autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/finance/payment/v1/check', autoSuccessMsg: true })
		},
		// 反审
		uncheck (id) {
			return put({
				url: `/finance/payment/v1/uncheck/${id}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/finance/payment/v1/uncheck', autoSuccessMsg: true })
		},
		// 复审
		recheck (id) {
			return put({ url: `/finance/payment/v1/recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/finance/payment/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `finance/payment/v1/un_recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/finance/payment/v1/un_recheck', autoSuccessMsg: true })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/in_store/v1/${id}/chain` })
		},
		// 获取付款机构支付方式
		getSettlementWayList (billId, organId) {
			return get({
				url: `/finance/payment/${billId}/detail/v1/settlement_way/organ/${organId}`,
				success: res => {
					res.forEach(item => {
						item.id = item.settlementWay
						item.name = item.settlementWay
					})
					return res
				}
			})
		},
		// 新增结算明细
		addDetail (billId, detailInfo) {
			return post({
				url: `/finance/payment/${billId}/detail/v1`,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId),
					...detailInfo
				},
				success: res => {
					detailInfo.createDate = res.createDate
					detailInfo.createMan = res.createMan
					return app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId)
				}
			})
		},
		// 编辑结算明细
		editDetail (billId) {
			return put({
				url: `/finance/payment/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId)
			})
		},
		// 批量删除结算明细
		delDetailMulity (billId) {
			return del({
				url: `/finance/payment/${billId}/detail/v1/delete`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 结算明细清空
		clearSettlementDetails (billId) {
			return del({ url: `/finance/payment/${billId}/detail/v1/clear` })
		},
		// 获取应付单列表接口
		getPayableOrderPage (billId) {
			return post({ url: `/finance/pay_write_off/v1/${billId}/payable/write_off` })
		},
		// 新增关联单据明细
		addPayableOrderDetails (billId) {
			return post({ url: `/finance/payment/${billId}/detail/v1/payableBill` })
		},
		// 批量删除关联单据
		deleteConnectBillDetails (billId) {
			return del({
				url: `/finance/payment/${billId}/detail/v1/delete/payableBill`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 关联单据明细清空
		clearConnectBillDetails (billId) {
			return del({ url: `/finance/payment/${billId}/detail/v1/payableBill/clear` })
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/in_store/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
