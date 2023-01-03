import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 业务类型接口
	bussinessType: {
		// 分页查询
		getPageList () {
			return post({ url: '/archive/bill_biz_type/v1/page' })
		},
		// 获取单据业务类型详情
		getBillTypeDetail (id) {
			return get({
				url: `/archive/bill_biz_type/v1/${id}`,
				success: (res) => {
					res.billTypeList = res.relBillTypeList ? res.relBillTypeList.map(item => {
						return item.billType
					}) : []
					return res
				}
			})
		},
		// 新增
		add () {
			return post({ url: '/archive/bill_biz_type/v1/', bautoSuccessMsg: true })
		},
		// 修改
		edit (id) {
			return put({ url: `/archive/bill_biz_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除
		delete (id) {
			return del({ url: `/archive/finance_sort/v1/${id}`, autoSuccessMsg: true })
		},
		// 获取单据类型树
		getTree () {
			return get({ url: '/archive/bill_type/v1/tree' })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/bill_biz_type/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/bill_biz_type/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/bill_biz_type/v1/delete', autoSuccessMsg: true })
		},
		// 获取单据类型
		getBillTypeList () {
			return get({ url: '/archive/bill_type/v1/list' })
		},
		// 新增业务类型对应关系
		addOutCorrespondingRelation () {
			return post({ url: '/archive/bill_biz_type/v1/relation/out_in/add', autoSuccessMsg: true })
		},
		// 编辑业务类型对应关系
		editOutCorrespondingRelation () {
			return put({ url: '/archive/bill_biz_type/v1/relation/out_in/mod', autoSuccessMsg: true })
		}
	}
}
