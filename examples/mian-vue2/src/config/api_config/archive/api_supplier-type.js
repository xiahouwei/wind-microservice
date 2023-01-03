import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 供货商接口
	supplierType: {
		// 修改供货商类别
		save (id) {
			return put({ url: `/archive/supplier_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 新增供货商类别
		add () {
			return post({ url: '/archive/supplier_type/v1', autoSuccessMsg: true })
		},
		// 删除供货商类别
		delete (id) {
			return del({ url: `/archive/supplier_type/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询供货商类别list
		getSupplierTypeList () {
			return get({ url: '/archive/supplier_type/v1/search', loading: false })
		}
	}
}
