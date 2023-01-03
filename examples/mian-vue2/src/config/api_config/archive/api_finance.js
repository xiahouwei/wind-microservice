import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 财务分类接口
	finance: {
		// 新增财务分类
		addFinancel () {
			return post({ url: '/archive/finance_sort/v1/' })
		},
		// 修改财务分类
		editFinancel (id) {
			return put({ url: `/archive/finance_sort/v1/${id}` })
		},
		// 删除财务分类
		delete (id) {
			return del({ url: `/archive/finance_sort/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询财务分类明细
		getFinancelDetails (id) {
			return get({ url: `/archive/finance_sort/v1/${id}` })
		},
		// 查询财务分类list
		getFinancialList () {
			return post({ url: '/archive/finance_sort/v1/search' })
		},
		// 财务分类列表分页查询
		getFinanceList () {
			return post({ url: '/archive/finance_sort/v1/page' })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/finance_sort/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/finance_sort/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/finance_sort/v1/delete', autoSuccessMsg: true })
		},
		// 删除校验接口
		deleteCheck () {
			return put({ url: '/archive/finance_sort/v1/delete/check' })
		}
	}
}
