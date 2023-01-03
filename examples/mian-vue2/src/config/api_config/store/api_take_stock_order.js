import { get, post, put, del, file } from '@/js/api/dataSource'
import app from '@/main.js'
const API_MODULE = 'takeStockOrder'

export default {
	// 盘点单
	takeStockOrder: {
		// {{{ 主单据
		// 清空明细
		clearDetails (billId) {
			return del({ url: `/bill/check/${billId}/detail/v1/clear`, data: [], autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/check/v1/submit', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/check/v1/back', autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return put({ url: '/bill/check/v1/remove', autoSuccessMsg: true })
		},
		// 回收站批量还原
		recoverMulity () {
			return put({ url: '/bill/check/v1/restore', autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/check/v1/recheck', autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/check/v1/un_recheck', autoSuccessMsg: true })
		},
		// 分页查询接口
		getPage () {
			return post({ url: '/bill/check/v1/page', query: { del_flag: false } })
		},
		// 回收站分页查询
		getPageRecycling () {
			return post({ url: '/bill/check/v1/page', query: { del_flag: true } })
		},
		// 根据id查询单据详情
		get (id) {
			return get({
				url: `/bill/check/v1/${id}`,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/bill/check/v1/delete', autoSuccessMsg: true })
		},
		// 获取合并盘点单
		getMergeOrder () {
			return put({ url: '/bill/check/v1/merge/bills' })
		},
		// 保存合并盘点单
		saveMergeOrder () {
			return post({ url: '/bill/check/v1/merge/save', autoSuccessMsg: true })
		},
		// 刷新账存
		refreshStock (checkBillId) {
			return put({ url: `/bill/check/v1/refresh_stock/${checkBillId}`, autoSuccessMsg: true })
		},
		// 盘点进度-分页查询
		getCheckProgress () {
			return post({ url: '/bill/check/v1/page/progress' })
		},
		// 盘点进度-详情查询
		getCheckProgressDetail () {
			return post({ url: '/bill/check/v1/progress/detail' })
		},
		// }}}
		// {{{ 明细
		// 提交
		submit (billId) {
			return put({ url: `/bill/check/v1/${billId}/submit`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		beforeSubmit (billId) {
			return get({ url: `/bill/check/v1/${billId}/pre_submit` })
		},
		// 退回
		return (billId) {
			return put({ url: `/bill/check/v1/${billId}/back`, autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (id) {
			return del({ url: `/bill/check/v1/${id}/remove`, autoSuccessMsg: true })
		},
		// 回收站还原
		recover (id) {
			return put({ url: `/bill/check/v1/${id}/restore`, autoSuccessMsg: true })
		},
		// 复审
		recheck (id) {
			return put({ url: `/bill/check/v1/${id}/recheck`, autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `/bill/check/v1/${id}/un_recheck`, autoSuccessMsg: true })
		},
		// 新增单条明细
		addDetails (billId) {
			return post({
				url: `/bill/check/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 保存单条明细
		saveDetails (billId, id) {
			return put({
				url: `/bill/check/${billId}/detail/v1/${id}`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 查询明细
		getDetails (billId) {
			return get({
				url: `/bill/check/v1/${billId}`,
				success: (res) => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details || []
				}
			})
		},
		// 批量新增明细
		addDetailsMulity (billId, data) {
			data = data.map(item => Object.assign({}, app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId), item))
			return post({ url: `/bill/check/${billId}/detail/v1/add`, data, autoSuccessMsg: true })
		},
		// 批量删除明细
		delDetailMulity (billId) {
			return put({ url: `/bill/check/${billId}/detail/v1/delete`, autoSuccessMsg: true, loadingType: 'circle' })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/check/v1/${id}/check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 审核前校验
		beforeCheck (id) {
			return get({ url: `/bill/check/v1/${id}/pre_check` })
		},
		// 反审
		uncheck (id) {
			return put({ url: `/bill/check/v1/${id}/uncheck`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/check/v1/check', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/check/v1/uncheck', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量设置明细
		settingMulity (billId) {
			return put({ url: `/bill/check/${billId}/detail/v1/set`, loading: false, autoSuccessMsg: true })
		},
		// 导入必盘品项接口
		importMustCheckItem (billId) {
			return post({
				url: `/bill/check/${billId}/detail/v1/add/must_check`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 更新必盘品项标记
		updateMustCheckFlag (billId) {
			return put({ url: `/bill/check/${billId}/detail/v1/update_must_check_flag` })
		},
		// 更新必盘品项标记前的保存
		saveBeforeUpdateMustCheckFlag (id) {
			return put({
				url: `/bill/check/v1/${id}`,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, id),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 修改盘点仓库
		changeHouse () {
			return put({ url: '/bill/check/v1/mod_check_house', autoSuccessMsg: true })
		},
		// 导出空白模板
		exportModel (billId) {
			return get({ url: `/excel/check_bill/v1/${billId}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (billId) {
			return get({ url: `/excel/check_bill/v1/${billId}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (id) {
			return file({ url: `/excel/check_bill/v1/${id}/import`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// }}}
		// {{{ 主列表筛选条件
		// 主列表筛选条件：盘点机构下拉列表(tab分页数据结构)
		getOrganSelect () {
			const params = { organTypeList: ['2', '1'] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		//  主列表筛选条件：查询仓库下拉列表(tab分页数据结构)
		getHouseSelect () {
			const params = {
				organTypeList: [2, 1]
			}
			return post({
				url: '/archive/house/v1/manage/simple/tab',
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
		// 分页查询-单据业务类型下拉列表
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/102', data: [] })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getBillDetailBizTypeSelect (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/102/${type}`, loading: false })
		},
		// 分页查询-单据类型下拉列表
		getBilltypeSelect () {
			return get({ url: '/bill/check/v1/types' })
		},
		// 分页查询-录入人下拉列表
		getEmployeeSelect () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// }}}
		// {{{ 详情页面的查询接口
		// 获取盘点仓库列表
		getCheckHouseList (organId) {
			return post({ url: `/archive/bill/house/v1/organ/${organId}/houseList` })
		},
		// 根据盘点仓库查询盘点分类列表
		getCheckClassList () {
			return post({ url: '/bill/check/class/v1/list' })
		},
		// 查询机构会计期
		getAccountingPeriod (organId) {
			return get({ url: `/archive/accounting_period/v1/organ/${organId}`, loading: false })
		},
		// 获取经办人接口
		getAgentList () {
			return post({ url: '/archive/bill/employee/v1/operator_list' })
		},
		// 可盘品项列表
		getCheckItemList () {
			return post({ url: '/bill/check/v1/itemList', loadingType: 'circle' })
		},
		// 盘点机构列表
		getOrganTabList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		// 盘盈原因列表
		getCheckCauseList () {
			return get({ url: '/bill/check/cause/v1/list', loadingType: 'circle' })
		},
		// 新增盘点单
		add () {
			return post({
				url: '/bill/check/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 修改盘点单
		save (id) {
			return put({
				url: `/bill/check/v1/${id}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, id),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 删除接口
		del (billId) {
			return put({ url: `/bill/check/v1/${billId}/delete`, autoSuccessMsg: true })
		},
		// 查询品项的账存、账存金额、最小单位单价
		getItemStock () {
			return post({ url: '/bill/check/v1/item_stock_price' })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/check/v1/${id}/chain` })
		},
		// }}}
		// {{{
		// 防错校验
		// 提交前的防错校验接口
		checkMistake (billId) {
			return post({
				url: `/bill/check/v1/mistake_proofing/${billId}`,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 删除重复品项
		delCheckDetailsMulity (billId) {
			return put({ url: `/bill/check/${billId}/detail/v1/delete` })
		},
		// 批量新增必盘品项
		addMustItemMulity (billId) {
			return post({ url: `/bill/check/${billId}/detail/v1/add/batch`, autoSuccessMsg: true })
		},
		// 批量更新生产日期
		updateProductDate (billId) {
			return put({ url: `/bill/check/${billId}/detail/v1/update_product_date`, autoSuccessMsg: true })
		},
		// }}}
		checkClassPage () {
			return post({ url: 'bill/check/class/v1/page' })
		}
	}
}
