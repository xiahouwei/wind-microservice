import { get, post, put, del, file } from '@/js/api/dataSource'
import app from '@/main.js'
const API_MODULE = 'saleOrder'
export default {
	// 销售订单
	saleOrder: {
		// {{{ 主列表筛选条件
		// 获取筛选条件中订货时间的默认值
		getAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 主列表筛选条件：查询机构下拉列表
		getOrganSelect () {
			return post({ url: '/archive/organ/v1/simple/all' })
		},
		// 主列表筛选条件：买方\卖方机构下拉列表(tab分页数据结构)
		getOrganSelectTab () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 主列表筛选条件：获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 主列表筛选条件：查询品项下拉列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 分页查询品项下拉列表tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 主列表筛选条件：查询采购方案下拉列表
		getPurchasePlanSelect () {
			return get({ url: '/plan/stock/v1/list' })
		},
		// }}}
		// 获取卖方机构列表
		getSellerList () {
			return post({ url: '/archive/bill/employee_organ/v1/sales_order/seller_organ_list' })
		},
		getSellerListNew () {
			return post({ url: '/archive/bill/employee_organ/v1/seller_organ_list_new' })
		},
		// 获取业务类型列表(销售订单)
		getBusinessList () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/202' })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getDetailBusinessList (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/202/${type}`, loading: false })
		},
		// 获取单据类型列表
		getBillTypeList () {
			return get({ url: '/bill/sales_order/v1/types' })
		},
		// 获取买方机构列表
		getBuyerList () {
			return post({ url: '/archive/bill/employee_organ/v1/sales_order/buyer_organ_list' })
		},
		getBuyerListNew () {
			return post({ url: '/archive/bill/employee_organ/v1/buyer_organ_list_new' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 获取品项列表
		getItemList () {
			return post({ url: '/bill/sales_order/v1/itemList', loadingType: 'circle' })
		},
		// 根据品项获取单位列表
		getItemUnitList (billId, itemId) {
			return post({ url: `/bill/sales_order/${billId}/detail/v1/unitList/${itemId}`, loadingType: 'circle' })
		},
		// 分页查询
		getPage () {
			return post({ url: '/bill/sales_order/v1/page', query: { del_flag: false } })
		},
		getPageRecycling () {
			return post({ url: '/bill/sales_order/v1/page', query: { del_flag: true } })
		},
		// 获取当前登录人及所属机构及机构的默认收货地址
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 新增接口
		add () {
			return post({
				url: '/bill/sales_order/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 保存接口
		save (billId) {
			return put({
				url: `/bill/sales_order/v1/${billId}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, billId),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/bill/sales_order/v1/delete', autoSuccessMsg: true })
		},
		// 删除接口
		del (billId) {
			return put({ url: `/bill/sales_order/v1/${billId}/delete`, autoSuccessMsg: true })
		},
		// 根据单据唯一标识查询单据及其明细
		get (billId) {
			return get({
				url: `/bill/sales_order/v1/${billId}`,
				success: res => {
					res.billBizType || (res.billBizType = { id: '' })
					res.stockPlan.id || (res.stockPlan.id = '')
					res.appendixList || (res.appendixList = [])
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 提交
		submit (billId) {
			return put({
				url: `/bill/sales_order/v1/${billId}/submit`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/sales_order/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (billId) {
			return put({ url: `/bill/sales_order/v1/${billId}/back`, autoSuccessMsg: true })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/sales_order/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (billId) {
			return put({
				url: `/bill/sales_order/v1/check/${billId}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/sales_order/v1/check/batch', autoSuccessMsg: true })
		},
		// 反审
		uncheck (billId) {
			return put({
				url: `/bill/sales_order/v1/uncheck/${billId}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/sales_order/v1/uncheck/batch', autoSuccessMsg: true })
		},
		// 复审
		recheck (billId) {
			return put({
				url: `/bill/sales_order/v1/${billId}/recheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/sales_order/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (billId) {
			return put({ url: `/bill/sales_order/v1/${billId}/un_recheck`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/sales_order/v1/un_recheck', autoSuccessMsg: true })
		},
		// 批量恢复
		recoverMulity () {
			return put({ url: '/bill/sales_order/v1/restore', autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (billId) {
			return del({ url: `/bill/sales_order/v1/${billId}/remove`, autoErrorMsg: true, autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return del({ url: '/bill/sales_order/v1/remove', autoErrorMsg: true, autoSuccessMsg: true })
		},
		// 删除空单据接口
		delEmptyBill (billId) {
			return del({ url: `/bill/sales_order/v1/silent/${billId}`, loading: false, autoErrorMsg: false })
		},
		// 明细
		// 查询明细
		getDetails (billId) {
			return get({
				url: `/bill/sales_order/v1/${billId}`,
				success: (res) => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details || []
				}
			})
		},
		// 新增单条明细
		addDetails (billId) {
			return post({
				url: `/bill/sales_order/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 保存单条明细
		saveDetails (billId) {
			return put({
				url: `/bill/sales_order/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 批量新增明细
		addDetailsMulity (billId, data) {
			data = data.map(item => Object.assign({}, app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId), item))
			return post({ url: `/bill/sales_order/${billId}/detail/v1/batch/add`, data, autoSuccessMsg: true })
		},
		// 删除明细(单条、批量)
		delDetail (billId) {
			return put({ url: `/bill/sales_order/${billId}/detail/v1/delete`, autoSuccessMsg: true, loadingType: 'circle' })
		},
		// 批量设置明细的税率/期望到货时间/明细备注
		settingMulity (billId) {
			return put({
				url: `/bill/sales_order/${billId}/detail/v1/set`,
				loading: false,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 根据单据id清空单据明细
		clearDetails (billId) {
			return put({ url: `/bill/sales_order/v1/clear_details/${billId}`, autoSuccessMsg: true })
		},
		// 获取采购方案列表
		getPlanList () {
			return post({ url: '/plan/stock/v1/stock_plan_list', loading: false })
		},
		// 查询品项价格
		getItemPirce () {
			return post({ url: '/bill/sales_order/v1/price_plan/item_price', loading: false })
		},
		// 导出空白模板
		exportModel (billId) {
			return get({ url: `/excel/sales_order/v1/${billId}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (billId) {
			return get({ url: `/excel/sales_order/v1/${billId}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (id) {
			return file({ url: `/excel/sales_order/v1/${id}/import/model`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// 复制单据
		copyOrder (id, continueFlag) {
			return get({ url: `/bill/sales_order/v1/copy/${id}/${continueFlag}`, responseComplete: true })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/sales_order/v1/${id}/chain` })
		},
		// {{{防错校验
		// 提交前的防错校验接口
		checkMistake (billId) {
			return post({
				url: `/bill/sales_order/v1/mistake_proofing/${billId}`,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 删除重复品项
		delCheckDetailsMulity (billId) {
			return put({ url: `/bill/sales_order/${billId}/detail/v1/delete` })
		},
		// 批量新增必定品项明细
		addMustDetailsMulity (billId, data) {
			data = data.map(item => Object.assign({}, app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId), item))
			return post({ url: `/bill/sales_order/${billId}/detail/v1/batch/add/must`, data, autoSuccessMsg: true })
		},
		// 批量修改明细(与价格档案保持一致)
		saveDetailsMulity (billId) {
			return put({ url: `/bill/sales_order/${billId}/detail/v1/batch/mod`, autoSuccessMsg: true })
		},
		// 批量导出
		exportMulity () {
			return post({ url: '/excel/sales_order/v1/batch/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 查询存在价格差异的明细
		getDiff (billId) {
			return post({
				url: `/bill/sales_order/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['DiffPrice'],
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 查询存在销售数量为0的明细
		getZeroAmount (billId) {
			return post({
				url: `/bill/sales_order/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['ZeroAmount'],
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 查询存在销售价格为0的明细
		getZeroPrice (billId) {
			return post({
				url: `/bill/sales_order/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['ZeroPrice'],
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 单据分派前的验证
		assignCheck (id, type) {
			return get({ url: `/bill/sales_order/v1/assign/valid/${type}/${id}` })
		},
		// 查询出库方为供货商时未关联品项
		getSupplierRefItem (billId) {
			return post({
				url: `/bill/sales_order/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['SupplierItem'],
				loading: false,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		}
		// }}}
	}
}
