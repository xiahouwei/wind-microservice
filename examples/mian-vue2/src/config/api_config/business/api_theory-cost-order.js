import { get, post, put } from '@/js/api/dataSource'
import app from '@/main.js'
const API_MODULE = 'theoryCost'
export default {
	// 理论耗用单
	theoryCostOrder: {
		// 获取分页list数据
		getPage () {
			return post({ url: '/bill/theory/v1/page' })
		},
		// {{{ 筛选条件部分
		// 获取筛选条件中订货时间的默认值
		getAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 分页查询-出库方下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 分页查询-获取出库仓库下拉列表(tab分页数据结构)
		getOuthouseSelect () {
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
		// 获取品项list列表数据
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 获取业务类型list数据
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/301', loading: false })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getBillDetailBizTypeSelect (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/301/${type}`, loading: false })
		},
		// 获取单据类型list数据
		getBilltypeSelect () {
			return get({ url: '/bill/theory/v1/types' })
		},
		// }}}
		// {{{ 单据详情部分
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/enable', loading: false })
		},
		// 修改主表
		edit (id) {
			return put({
				url: `/bill/theory/v1/${id}`,
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
				url: `/bill/theory/v1/${id}`,
				success: res => {
					res.outHouse || (res.outHouse = {})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 提交
		submit (id) {
			return put({ url: `/bill/theory/v1/${id}/submit`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/theory/v1/submit', autoSuccessMsg: true })
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/bill/theory/v1/delete', autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({
				url: `/bill/theory/v1/${id}/back`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/theory/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/theory/v1/${id}/check`, autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/theory/v1/check', autoSuccessMsg: true })
		},
		// 反审
		uncheck (id) {
			return put({
				url: `/bill/theory/v1/${id}/uncheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/theory/v1/uncheck', autoSuccessMsg: true })
		},
		// 复审
		recheck (id) {
			return put({ url: `/bill/theory/v1/${id}/recheck`, autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/theory/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `/bill/theory/v1/${id}/un_recheck`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/theory/v1/un_recheck', autoSuccessMsg: true })
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/theory/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 单据业务链
		getBillChain (id) {
			return get({ url: `/bill/theory/v1/${id}/chain` })
		},
		// }}}
		// {{{ 明细部分
		// 查询明细
		getDetails (billId) {
			return get({
				url: `/bill/theory/v1/${billId}`,
				loading: false,
				success: res => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details
				}
			})
		},
		// 编辑明细
		editDetail (billId, id) {
			return put({
				url: `/bill/theory/${billId}/detail/v1/${id}`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId)
			})
		},
		// 删除单据
		delete (id) {
			return put({ url: `/bill/theory/v1/${id}/delete`, autoSuccessMsg: true })
		},
		// 批量设置
		setMulity (billId) {
			return put({
				url: `/bill/theory/${billId}/detail/v1/set`,
				loading: false,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 明细查询库存
		stockAmount (billId, organId) {
			return post({ url: `/bill/theory/${billId}/detail/v1/${organId}/stock/amount`, loading: false })
		}
		// }}}
	}
}
