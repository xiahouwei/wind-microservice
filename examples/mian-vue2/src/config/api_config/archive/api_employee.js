import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 员工接口
	employee: {
		// {{{ 主列表筛选条件
		// 获取筛选条件直属机构列表
		getFilterDirectOrganList () {
			return get({ url: '/archive/employee/v1/organ/list' })
		},
		// }}}
		// 查询员工详情
		getDetails (id) {
			return get({ url: `/archive/employee/v1/${id}` })
		},
		// 保存员工详情
		saveDetails (id) {
			return put({ url: `/archive/employee/v1/${id}`, autoSuccessMsg: true })
		},
		// 新增员工
		add (id) {
			return post({ url: '/archive/employee/v1/', autoSuccessMsg: true })
		},
		// 复制员工
		copyEmployee (id) {
			return put({ url: `/archive/employee/v1/employee/copy/${id}`, autoSuccessMsg: true })
		},
		getDefaultCode () {
			return get({ url: '/archive/archive_code/v1/Employee' })
		},
		// 停用员工
		disable (id) {
			return put({ url: `/archive/employee/v1/${id}/disable` })
		},
		// 启用员工
		enable (id) {
			return put({ url: `/archive/employee/v1/${id}/enable` })
		},
		// 删除员工
		delete (id) {
			return del({ url: `/archive/employee/v1/${id}`, autoSuccessMsg: true })
		},
		// 分页查询员工list
		getEmployeeList () {
			return post({ url: '/archive/employee/v1/page' })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/employee/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/employee/v1/disable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/employee/v1/delete', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/employee/v1/model/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取员工直属机构
		getDirectOrgan (organIdList) {
			const params = { organTypeList: ['2', '1', '5', '6', '0'], enableFlag: 1, organIdList }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// 员工管理机构-查询接口
		getConnectOrgan (employeeId) {
			return get({ url: `/archive/employee-organ/v1/organ/${employeeId}` })
		},
		// 员工管理机构-保存接口
		saveConnectOrgan (employeeId) {
			return put({ url: `/archive/employee-organ/v1/organ/${employeeId}`, autoSuccessMsg: true })
		},
		// 员工管理机构-查询除了传入id外的所有员工
		getEmployeeExcludeId (employeeId) {
			return get({ url: `/archive/employee-organ/v1/employee/except/${employeeId}` })
		},
		// 员工管理机构-复制员工机构关联关系到其他员工
		copyConnectWithEmployee (id) {
			return put({ url: `/archive/employee-organ/v1/employee/copy/${id}`, autoSuccessMsg: true })
		},
		// 员工管理机构-与其他员工一致
		copyConnectEmployee2Employee (checkId, targetId) {
			return put({ url: `archive/employee-organ/v1/employee/${checkId}/copy/${targetId}`, autoSuccessMsg: true })
		},
		// 员工管理供货商-查询接口
		getConnectSupplier (employeeId) {
			return get({ url: `/archive/employee-supplier/v1/supplier/${employeeId}` })
		},
		// 员工管理供货商-保存接口
		saveConnectSupplier (employeeId) {
			return put({ url: `/archive/employee-supplier/v1/supplier/${employeeId}`, autoSuccessMsg: true })
		},
		// 员工管理供货商-查询除了传入id外的所有员工
		getEmployeeExcludeIdSupplier (employeeId) {
			return get({ url: `/archive/employee-supplier/v1/employee/except/${employeeId}` })
		},
		// 员工管理供货商-复制员工机构关联关系到其他员工
		copyConnectSupplierWithEmployee (id) {
			return put({ url: `/archive/employee-supplier/v1/employee/copy/${id}`, autoSuccessMsg: true })
		},
		// 员工管理供货商-与其他员工一致
		copyConnectSupplierEmployee2Employee (checkId, targetId) {
			return put({ url: `archive/employee-supplier/v1/employee/${checkId}/copy/${targetId}`, autoSuccessMsg: true })
		},
		// 员工管理客户-查询接口
		getConnectCustomer (employeeId) {
			return get({ url: `/archive/employee_customer/v1/customer/${employeeId}` })
		},
		// 员工管理客户-保存接口
		saveConnectCustomer (employeeId) {
			return put({ url: `/archive/employee_customer/v1/customer/${employeeId}`, autoSuccessMsg: true })
		},
		// 员工管理客户-查询除了传入id外的所有员工
		getEmployeeExcludeIdCustomer  (employeeId) {
			return get({ url: `/archive/employee_customer/v1/employee/except/${employeeId}` })
		},
		// 员工管理客户-复制员工客户关联关系到其他员工
		copyConnectCustomerWithEmployee (id) {
			return put({ url: `/archive/employee_customer/v1/employee/copy/${id}`, autoSuccessMsg: true })
		},
		// 员工管理客户-与其他员工一致
		copyConnectCustomerEmployee2Employee (checkId, targetId) {
			return put({ url: `archive/employee_customer/v1/employee/${checkId}/copy/${targetId}`, autoSuccessMsg: true })
		},
		// 获取员工绑定公众号二维码
		getQrCode (employeeId) {
			return get({ url: `/archive/jsd/wechat/v1/employee/${employeeId}/bind` })
		},
		// 获取员工绑定公众号结果
		getBindResult () {
			return post({ url: '/archive/jsd/wechat/v1/polling/bind/result', loading: false })
		},
		// 查询下属员工
		getSubordinates (employeeId) {
			return get({ url: `/archive/employee_subordinates/v1/subordinates/${employeeId}` })
		},
		// 添加下属员工
		saveSubordinates (employeeId) {
			return put({ url: `/archive/employee_subordinates/v1/subordinates/${employeeId}`, autoSuccessMsg: true })
		},
		// 查询适用店铺
		getStore (employeeId) {
			return get({ url: `/archive/employee_store/v1/store/${employeeId}` })
		},
		// 添加适用店铺
		saveStore (employeeId) {
			return put({ url: `/archive/employee_store/v1/store/${employeeId}`, autoSuccessMsg: true })
		}
	}
}
