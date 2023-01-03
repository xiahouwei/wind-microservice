import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 角色接口
	role: {
		// {{{ 筛选条件
		// 获取角色列表
		getRoleFilterSelectList () {
			return get({ url: '/auth/role/v1/list', loading: false })
		},
		// }}}
		// 分页查询
		getPage () {
			return post({ url: '/auth/role/v1/page' })
		},
		// 新增
		add () {
			return post({ url: '/auth/role/v1', autoSuccessMsg: true })
		},
		// 编辑
		edit (id) {
			return put({ url: `/auth/role/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询
		getDetail (id) {
			return get({ url: `/auth/role/v1/${id}` })
		},
		// 删除
		delete (id) {
			return del({ url: `/auth/role/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/auth/role/v1/delete', autoSuccessMsg: true })
		},
		// 根据角色id查询关联员工
		getConnectRolesById (id) {
			return get({ url: `/auth/role_employee/v1/employee/${id}` })
		},
		// 修改角色与员工关联关系接口
		saveConnectRoles (id) {
			return put({ url: `/auth/role_employee/v1/employee/${id}`, autoSuccessMsg: true })
		},
		// 根据角色id查询关联权限
		getAuthConnectByRoleId (id) {
			return get({ url: `/auth/role_privilege/v1/privilege/${id}` })
		},
		// 修改角色与权限关联关系接口
		saveRolesConnectAuth (id) {
			return put({ url: `/auth/role_privilege/v1/privilege/${id}`, autoSuccessMsg: true })
		},
		// 根据角色id查询权限树
		getAuthTreeByRoleId (roleId) {
			return get({
				url: `/auth/role_privilege/v1/privilege/${roleId}/tree`,
				success: (res) => {
					return [{
						name: '全部',
						treeType: 'root',
						fatherId: null,
						children: res
					}]
				}
			})
		},
		// 角色列表查询
		getRoleSelectList () {
			return get({ url: '/auth/role/v1/list' })
		},
		// 获取默认编号
		getDefaultCode () {
			return get({ url: '/auth/role/v1/getCode/Role' })
		}
	}
}
