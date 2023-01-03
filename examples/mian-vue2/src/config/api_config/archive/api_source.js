import { get } from '@/js/api/dataSource'
export default {
	// 来源接口
	source: {
		// 获取来源
		getList (archiveType, chidType, id) {
			return get({ url: `/archive/source/v1/${archiveType}/${chidType}/${id}` })
		},
		// 获取机构来源
		getOrganList (chidType, id) {
			return get({ url: `/archive/source/v1/Organ/${chidType}/${id}` })
		},
		// 获取供货商来源
		getSupplierList (chidType, id) {
			return get({ url: `/archive/source/v1/Supplier/${chidType}/${id}` })
		},
		// 获取客户来源
		getCustomerList (chidType, id) {
			return get({ url: `/archive/source/v1/Customer/${chidType}/${id}` })
		},
		// 获取品项来源
		getItemList (id) {
			return get({ url: `/archive/source/v1/Item/1/${id}` })
		},
		// 获取员工来源
		getEmployeeList (id) {
			return get({ url: `/archive/source/v1/Employee/1/${id}` })
		}
	}
}
