import { get, post, put, del } from '@/js/api/dataSource'
import app from '@/main.js'

export default {
	// 权限接口
	auth: {
		// 登录
		login () {
			return post({ url: '/auth/v1/login/username' })
		},
		// 手机密码登录
		loginByPhone () {
			return post({ url: '/auth/v1/login/phone' })
		},
		// 刷新token
		refreshToken () {
			return put({ url: '/auth/token/v1/token/refresh' })
		},
		// 登出
		logout () {
			return del({ url: '/auth/v1/logout', autoSuccessMsg: true })
		},
		// 获取当前登陆人权限
		getCurrentAuth (fatherCodeList = '', loading = true) {
			return get({
				url: '/auth/privilege_employee/v1/mes/privilege/employee/tree',
				query: { fatherCodeList, systemSign: 0 },
				success: (res) => {
					return {
						treeModularsData: res.treeModularsData || [],
						haveModulars: res.haveModulars || [],
						havePrivileges: res.havePrivileges || [],
						treeHavePrivilegesData: res.treeHavePrivilegesData || []
					}
				},
				loading
			})
		},
		getWechatInfo (loading = true) {
			return get({ url: `/auth/wechat/v1/bind/${app.vue.$store.state.loginer.hostId}`, loading })
		},
		unbindWechat () {
			return del({ url: `/auth/wechat/v1/bind/${app.vue.$store.state.loginer.hostId}`, autoSuccessMsg: true })
		},
		getTenantInfo () {
			return get({ url: '/archive/tenant/v1/info' })
		},
		// 单据跳转权限校验
		checkBillAuth (billClass, billId) {
			return get({ url: `/bill/privilege/v1/?billClass=${billClass}&billId=${billId}` })
		},
		// 是否开通精益生产
		getGroupSubProduct () {
			return post({ url: '/archive/organ_sub/v1/query/group/getListSubProduct' })
		},
		// 获取员工极速订菜单权限
		getCurrentJSDAuth () {
			return get({
				url: '/archive/employee/v1/jsd/authority',
				success: (res) => {
					return res.map(code => {
						return /^(?!jsd_)/.test(code) ? `jsd_${code}` : code
					})
				},
				loading: false
			})
		},
		// 获取小程序二维码
		getWxMiniQRCode (entCode) {
			return get({ url: `/auth/wechat/v1/qrcode/${entCode}`, responseType: 'blob' })
		}
	}
}
