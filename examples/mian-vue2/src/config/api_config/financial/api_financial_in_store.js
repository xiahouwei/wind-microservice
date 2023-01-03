import { get, post, put, del } from '@/js/api/dataSource'
import app from '@/main.js'
const API_MODULE = 'financialInStore'

export default {
	// 存货核算-财务入库单
	financialInStore: {
		// 分页查询
		getPage () {
			return post({ url: '/finance/in_store/v1/page' })
		},
		// 分页查询-入库方下拉列表(tab分页数据结构)
		getOrganSelectTab () {
			return post({ url: '/finance/in_store/v1/in_store/organ', data: [] })
		},
		// 分页查询-出库方下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			return post({ url: '/finance/in_store/v1/out_store/organ', data: [] })
		},
		// 分页查询-获取入库仓库下拉列表(tab分页数据结构)
		getInhouseSelect () {
			const params = {
				organTypeList: [2, 1]
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
		// 分页查询-获取品项列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 分页查询-获取业务类型列表
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/100', loading: false })
		},
		// 分页查询-获取单据类型列表
		getBilltypeSelect () {
			return get({ url: '/finance/in_store/v1/billtype' })
		},
		// 分页查询-获取筛选条件中单据时间的默认值
		getFilterAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 删除单据
		delete (id) {
			return del({ url: `/finance/in_store/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/finance/in_store/v1/delete', autoSuccessMsg: true })
		},
		// 获取单据详情
		getBill (id) {
			return get({
				url: `/finance/in_store/v1/${id}`,
				success: res => {
					res.details && res.details.forEach(item => {
						item.inTaxRateMoneyClone = Math.abs(item.inTaxRateMoney)
						item.inTaxMoneyClone = Math.abs(item.inTaxMoney)
					})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 提交
		submit (id) {
			return put({ url: `/finance/in_store/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/finance/in_store/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({ url: `/finance/in_store/v1/back/${id}`, autoSuccessMsg: true })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/finance/in_store/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/finance/in_store/v1/check/${id}`, autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/finance/in_store/v1/check', autoSuccessMsg: true })
		},
		// 反审
		uncheck (id) {
			return put({ url: `/finance/in_store/v1/uncheck/${id}`, autoSuccessMsg: true })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/finance/in_store/v1/uncheck', autoSuccessMsg: true })
		},
		// 复审
		recheck (id) {
			return put({ url: `/finance/in_store/v1/recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/finance/in_store/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `/finance/in_store/v1/un_recheck/${id}`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/finance/in_store/v1/un_recheck', autoSuccessMsg: true })
		},
		// 下推暂估应付单
		pushDownEstimationPayable (id) {
			return put({ url: `/finance/in_store/v1/push/${id}?type=101`, autoSuccessMsg: true })
		},
		// 批量下推暂估应付单
		pushDownEstimationPayableMulity (id) {
			return put({ url: '/finance/in_store/v1/push?type=101', autoSuccessMsg: true })
		},
		// 下推标准应付单
		pushDownStandardPayable (id) {
			return put({ url: `/finance/in_store/v1/push/${id}?type=102`, autoSuccessMsg: true })
		},
		// 批量下推标准应付单
		pushDownStandardPayableMulity (id) {
			return put({ url: '/finance/in_store/v1/push?type=102', autoSuccessMsg: true })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/in_store/v1/${id}/chain` })
		},
		// 编辑明细
		editDetail (billId) {
			return put({
				url: `/finance/in_store/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				autoSuccessMsg: true
			})
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/in_store/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
