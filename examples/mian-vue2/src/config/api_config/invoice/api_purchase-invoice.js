import { get, post, put, del, file } from '@/js/api/dataSource'
export default {
	// 采购发票
	purchaseInvoice: {
		// {{{ 主列表筛选条件
		// 主列表筛选条件：获取采购方列表
		getBuyerSelectList () {
			const params = { organTypeList: ['1', '2', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 主列表筛选条件：获取销售方列表
		getSellerSelectList () {
			const params = { organTypeList: ['1', '2', '5', '6'] }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 主列表筛选条件：获取发票类型列表
		getInvoiceTypeList () {
			return post({
				url: '/archive/invoice_type/v1/search',
				data: {
					delFlag: 0
				}
			})
		},
		// }}}
		// 分页查询接口
		getPage () {
			return post({ url: '/finance/purchase_invoice/v1/page' })
		},
		// 分页查询接口（回收站）
		getPageRecycling () {
			return post({ url: '/finance/purchase_invoice/v1/page', query: { del_flag: true } })
		},
		// 获取采购方列表
		getBuyerList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		// 获取销售方列表
		getSellerList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		// 删除发票
		del (id) {
			return put({ url: `/finance/purchase_invoice/v1/${id}/delete`, autoSuccessMsg: true })
		},
		// 批量删除发票
		deleteMulity () {
			return put({ url: '/finance/purchase_invoice/v1/delete', autoSuccessMsg: true })
		},
		// 恢复发票
		restore (id) {
			return put({ url: `/finance/purchase_invoice/v1/${id}/restore`, autoSuccessMsg: true })
		},
		// 批量恢复发票
		restoreMulity () {
			return put({ url: '/finance/purchase_invoice/v1/restore', autoSuccessMsg: true })
		},
		// 回收站删除发票
		remove (id) {
			return del({ url: `/finance/purchase_invoice/v1/${id}/remove`, autoSuccessMsg: true })
		},
		// 回收站批量删除发票
		removeMulity () {
			return del({ url: '/finance/purchase_invoice/v1/remove', autoSuccessMsg: true })
		},
		// 获取经办人接口
		getAgentList () {
			return post({ url: '/archive/bill/employee/v1/operator_list' })
		},
		// 获取当前登录人
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 新增发票时获取发票类型列表
		getInvoiceTypeListForCreate () {
			return post({
				url: '/archive/invoice_type/v1/search',
				data: {
					delFlag: 0,
					enableFlag: 1
				}
			})
		},
		// 新增发票
		add () {
			return post({ url: '/finance/purchase_invoice/v1', autoSuccessMsg: true })
		},
		// 编辑保存发票
		save (id) {
			return put({ url: `/finance/purchase_invoice/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询发票
		getDetails (id) {
			return get({ url: `/finance/purchase_invoice/v1/${id}` })
		},
		// 获取发票类型列表
		getInvoiceType4List () {
			return post({ url: '/archive/invoice_type/v1/list4Select' })
		},
		// 获取机构统一社会信用编码资质
		getResource () {
			return post({ url: '/archive/organ_source/v1/batch/get/resource' })
		},
		// 获取采购方会计期
		getAccountingPeriod (organId) {
			return get({ url: `/archive/accounting_period/v1/organ/${organId}`, autoErrorMsg: false, loading: false })
		},
		// 导出空白模板
		exportModel () {
			return get({ url: '/excel/purchase_invoice/v1/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (id) {
			return get({ url: `/excel/purchase_invoice/v1/${id}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData () {
			return file({ url: '/excel/purchase_invoice/v1/import', responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		}
	}
}
