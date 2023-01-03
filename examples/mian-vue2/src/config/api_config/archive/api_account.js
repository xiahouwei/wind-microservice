import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 会计期接口
	account: {
		// 获取会计期树
		getAccountTree () {
			return get({ url: '/archive/accounting_period/v1/organ_tree' })
		},
		// 新增会计期
		add () {
			return post({ url: '/archive/accounting_period/v1', autoSuccessMsg: true })
		},
		// 获取全部会计年份接口
		getAccountYears () {
			return get({ url: '/archive/accounting_period/v1/years' })
		},
		// 分页查询
		getPageList () {
			return post({ url: '/archive/accounting_period/v1/page' })
		},
		// 修改会计期接口
		edit (id) {
			return put({ url: `/archive/accounting_period/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity (id) {
			return put({ url: `/archive/accounting_period/v1/${id}/enable`, autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/accounting_period/v1/disable', autoSuccessMsg: true })
		},
		// 获取最大会计年接口
		getAccountMaxYear () {
			return get({ url: '/archive/accounting_period/v1/next/year' })
		},
		// 取消启用机构会计期接口
		cancelEnabel (organId) {
			return put({ url: `/archive/accounting_period/v1/organ/${organId}/disable`, autoSuccessMsg: true })
		},
		// 启用机构会计期接口
		enabel (id, organId) {
			return put({ url: `/archive/accounting_period/v1/${id}/organ/${organId}/enable`, autoSuccessMsg: true })
		},
		// 删除会计期接口
		delete (id) {
			return del({ url: `/archive/accounting_period/v1/${id}`, autoSuccessMsg: true })
		},
		// 判断是否有机构启用会计期接口
		checkAccountOrgan () {
			return get({ url: '/archive/accounting_period/v1/judge/enable/organ' })
		},
		// 判断某机构是否启用会计期接口
		checkAccountByOneOrgan (organId) {
			return get({ url: `/archive/accounting_period/v1/judge/enable/organ/${organId}` })
		}
	}
}
