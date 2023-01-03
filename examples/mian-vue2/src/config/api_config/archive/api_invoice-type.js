import { post, put } from '@/js/api/dataSource'
export default {
	// 发票类型接口
	invoiceType: {
		// 分页查询
		getPageList () {
			return post({ url: '/archive/invoice_type/v1/page' })
		},
		// 新增
		add () {
			return post({ url: '/archive/invoice_type/v1', autoSuccessMsg: true })
		},
		// 修改
		edit (id) {
			return put({ url: `/archive/invoice_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/invoice_type/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/invoice_type/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/invoice_type/v1/delete', autoSuccessMsg: true })
		}
	}
}
