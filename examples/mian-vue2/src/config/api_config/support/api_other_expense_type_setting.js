import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 其他费用类型接口
	otherExpenseTypeSetting: {
		// 新增其他费用类型
		addExpenseType () {
			return post({ url: '/archive/other_cost_type/v1' })
		},
		// 修改其他费用类型
		editExpenseType (id) {
			return put({ url: `/archive/other_cost_type/v1/${id}` })
		},
		// 删除其他费用类型
		delete (id) {
			return del({ url: `/archive/other_cost_type/v1/delete/${id}`, autoSuccessMsg: true })
		},
		// 查询其他费用类型明细
		getExpenseTypeDetails (id) {
			return get({ url: `/archive/other_cost_type/v1/${id}` })
		},
		// 其他费用类型列表分页查询
		getExpenseTypeList () {
			return post({ url: '/archive/other_cost_type/v1/page' })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/other_cost_type/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/other_cost_type/v1/enabled', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return del({ url: '/archive/other_cost_type/v1/delete', autoSuccessMsg: true })
		}
	}
}

