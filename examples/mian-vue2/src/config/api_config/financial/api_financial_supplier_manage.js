import { get, post, put } from '@/js/api/dataSource'
import app from '@/main.js'
export default {
	// 财务档案-供货商列表接口
	financialSupplier: {
		// {{{ 主列表筛选条件
		// 获取供货商列表
		getFilterSupplierSelectList () {
			return get({
				url: '/finance/cw_supplier/v1/page/organ/tab',
				loading: false,
				success: res => {
					return res.listData || []
				}
			})
		},
		// 查询供货商类别list
		getSupplierTypeList () {
			return get({ url: '/finance/cw_supplier_type/v1/search', loading: false })
		},
		// }}}
		// 供货商列表分页查询
		getSupplierList () {
			return post({ url: '/finance/cw_supplier/v1/page' })
		},
		// 查询供货商详情
		getSupplierDetails (id) {
			return get({
				url: `/finance/cw_supplier/v1/${id}`,
				success: res => {
					res.cwSupplierType || (res.cwSupplierType = {})
					res.invoicingTypeId || (res.invoicingTypeId = '')
					res.taxRate || (res.taxRate = 0)
					return res
				}
			})
		},
		// 查询供货商结算信息list
		getDetails (id) {
			return get({
				url: `/finance/cw_supplier/v1/${id}`,
				success: res => {
					return res.settlementWayList || []
				}
			})
		},
		// 修改供货商详情
		saveDetails () {
			return put({ url: '/finance/cw_supplier/v1', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/finance/cw_supplier/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/finance/cw_supplier/v1/enable', autoSuccessMsg: true })
		},
		// 批量导入
		importMulity () {
			return post({ url: '/finance/cw_supplier/v1/sync', autoSuccessMsg: true })
		},
		// 获取发票类型list
		getInvoiceTypeList () {
			return post({ url: '/archive/invoice_type/v1/list4Select' })
		},
		// 获取结算方式列表
		getSettlementWayList () {
			return post({ url: '/finance/settlement/v1/search', data: { enableFlag: 1, hasSysDefault: true }, loading: false })
		},
		// 新增客户结算信息
		addDetail (detailInfo) {
			return post({
				url: '/finance/cw_supplier_settlement_way/v1',
				data: {
					...detailInfo,
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => {
					detailInfo.createDate = res.createDate
					detailInfo.createMan = res.createMan
					return res
				}
			})
		},
		// 编辑客户结算信息
		editDetail () {
			return put({ url: '/finance/cw_supplier_settlement_way/v1' })
		},
		// 批量删除客户结算信息
		delDetailMulity () {
			return post({ url: '/finance/cw_supplier_settlement_way/v1/delete', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/supplier/export', responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
