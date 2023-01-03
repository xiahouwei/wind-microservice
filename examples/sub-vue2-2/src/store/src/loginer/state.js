import { getLocalStorage } from '../utils'
export default {
	// token
	token: getLocalStorage('token', ''),
	// 登录人信息
	loginerUserName: getLocalStorage('loginerUserName', ''),
	username: getLocalStorage('username', ''),
	authorizationMes: getLocalStorage('authorizationMes', '')
}
