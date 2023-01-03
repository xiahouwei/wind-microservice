// import { get, post, put, del } from '@/js/api/dataSource'
import { get, put } from '@/js/api/dataSource'
export default {
	// 部门接口
	section: {
		// 根据部门查询关联品项
		getConnectItem (id) {
			return get({ url: `/archive/itemdepartment/v1/department/${id}` })
		},
		// 查询除了传入id的所有的部门
		getSectionExcludeId (departmentId) {
			return get({ url: `/archive/itemdepartment/v1/department/except/${departmentId}` })
		},
		// 修改部门与品项关联关系接口
		saveConnectItem (id) {
			return put({ url: `/archive/itemdepartment/v1/department/${id}`, autoSuccessMsg: true })
		},
		// 复制关联关系—部门到部门
		copyConnectSection2Section (sourceHouseId, targetHouseId) {
			return put({ url: `/archive/itemdepartment/v1/department/${sourceHouseId}/copy/${targetHouseId}`, autoSuccessMsg: true })
		},
		// 根据部门复制关联品项关系到其他部门接口
		copyConnectWithSection (id) {
			return put({ url: `/archive/itemdepartment/v1/department/copy/${id}`, autoSuccessMsg: true })
		}
	}
}
