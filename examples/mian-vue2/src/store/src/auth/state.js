import { getStorageJson } from '../utils'
export default {
	// 模块权限
	moduleAuth: getStorageJson('moduleAuth', {}),
	// 按钮权限
	detailsAuth: getStorageJson('detailsAuth', {}),
	// 租户信息
	tenantInfo: getStorageJson('tenantInfo', {}),
	// 极速订模块权限
	jsdModuleAuth: getStorageJson('jsdModuleAuth', {})
}
