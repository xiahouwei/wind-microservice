import { get, post, put, del } from '@/js/api/dataSource'
import { EMPTY_TAB_DATA } from '../common'
import app from '@/main.js'
const API_MODULE = 'advancedOrder'

export default {
	// 资金管理-预付单
	advancedOrder: {
		// 分页查询
		getPage () {
			return post({ url: '/finance/advance/v1/page' })
		},
		// 分页查询-付款机构下拉列表(tab分页数据结构)
		getOrganSelectTab () {
			return post({ url: '/finance/advance/v1/payment/organ', data: [] })
		},
		// 分页查询-收款机构下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			return post({ url: '/finance/advance/v1/collection/organ', data: [] })
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
				url: '/finance/advance/v1/types',
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
		// 获取核算部门接口
		getDepartmentList (organId) {
			return post({ url: `/finance/advance/v1/${organId}/departments`, loading: false })
		},
		// 新增单据
		add () {
			return post({
				url: '/finance/advance/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 编辑单据
		edit (id) {
			return put({
				url: `/finance/advance/v1/${id}`,
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
				url: `/finance/advance/v1/${id}`,
				success: res => {
					!res.department && (res.department = {})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 删除预付单接口
		delete (id) {
			return del({ url: `/finance/advance/v1/${id}`, loading: false, autoSuccessMsg: true })
		},
		// 批量删除单据
		deleteMulity () {
			return del({ url: '/finance/advance/v1/delete', autoSuccessMsg: true })
		},
		// 删除空单据
		delEmptyBill (id) {
			return del({ url: `/finance/advance/v1/${id}/silent`, loading: false })
		},
		// 提交
		submit (id) {
			return put({ url: `/finance/advance/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/finance/advance/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({
				url: `/finance/advance/v1/back/${id}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/finance/advance/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/finance/advance/v1/check/${id}`, autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/finance/advance/v1/check', autoSuccessMsg: true })
		},
		// 反审
		uncheck (id) {
			return put({
				url: `/finance/advance/v1/uncheck/${id}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/finance/advance/v1/uncheck', autoSuccessMsg: true })
		},
		// 复审
		recheck (id) {
			return put({ url: `/finance/advance/v1/recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/finance/advance/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `finance/advance/v1/un_recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/finance/advance/v1/un_recheck', autoSuccessMsg: true })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/in_store/v1/${id}/chain` })
		},
		// 获取付款机构支付方式
		getSettlementWayList (billId, organId) {
			return get({
				url: `/finance/advance/${billId}/detail/v1/settlement_way/organ/${organId}`,
				success: res => {
					res.forEach(item => {
						item.id = item.settlementWay
						item.name = item.settlementWay
					})
					return res
				}
			})
		},
		// 查询明细
		getDetails (id) {
			return get({
				url: `/finance/advance/${id}/detail/v1`,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res),
				loading: false
			})
		},
		// 新增单据明细
		addDetail (billId, detailInfo) {
			return post({
				url: `/finance/advance/${billId}/detail/v1`,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId),
					...detailInfo
				},
				success: res => {
					detailInfo.createDate = res.createDate
					detailInfo.createMan = res.createMan
					app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId)
				}
			})
		},
		// 编辑明细
		editDetail (billId) {
			return put({
				url: `/finance/advance/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId)
			})
		},
		// 删除明细
		delDetail (billId, id) {
			return del({ url: `/finance/advance/${billId}/detail/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量删除明细
		delDetailMulity (billId) {
			return del({
				url: `/finance/advance/${billId}/detail/v1/delete`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 明细清空
		clear (billId) {
			return del({
				url: `/finance/advance/${billId}/detail/v1/clear`,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/in_store/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
