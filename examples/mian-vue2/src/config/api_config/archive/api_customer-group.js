import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 客户所属企业接口
	customerGroup: {
		// 新增客户所属企业
		add () {
			return post({ url: '/archive/customer_group/v1/', autoSuccessMsg: true })
		},
		// 修改客户所属企业
		save (id) {
			return put({ url: `/archive/customer_group/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询客户所属企业
		get (id) {
			return get({ url: '/archive/customer_group/v1/tree' })
		},
		// 删除客户所属企业
		delete (id) {
			return del({ url: `/archive/customer_group/v1/${id}`, autoSuccessMsg: true })
		},
		// 客户所属企业列表查询
		getList () {
			return get({ url: '/archive/customer_group/v1/search', loading: false })
		}
	}
}
