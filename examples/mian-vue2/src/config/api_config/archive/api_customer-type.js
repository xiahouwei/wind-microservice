import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 客户类别接口
	customerType: {
		// 新增客户类别
		add () {
			return post({ url: '/archive/customer_type/v1/', autoSuccessMsg: true })
		},
		// 查询客户类别
		get (id) {
			return get({ url: `/archive/customer_type/v1/${id}` })
		},
		// 修改客户类别
		save (id) {
			return put({ url: `/archive/customer_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除客户类别
		delete (id) {
			return del({ url: `/archive/customer_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 客户类别列表查询
		getList () {
			return get({ url: '/archive/customer_type/v1/search', loading: false })
		},
		// 获取上级机构列表
		getFatherList (organLevel, id = 0) {
			return post({ url: `/archive/customer/v1/${organLevel}/${id}/fathers` })
		}
	}
}
