import app from '@/main.js'
export function syncLoginer ({ commit }, hostId) {
	return new Promise(resolve => {
		app.vue.$fxApi('common.getCurrentUser').then(res => {
			const userData = {
				tenantId: res.currentUser.tenantId,
				employeeName: res.currentUser.name,
				organName: res.currentOrgan.name,
				organId: res.currentOrgan.id,
				username: res.currentUser.username,
				userId: res.currentUser.id,
				hostname: window.location.hostname,
				systemFlag: res.currentUser.systemFlag,
				haveMoneyPower: res.currentUser.haveMoneyPower,
				haveCostPower: res.currentUser.haveCostPower,
				hostId,
				entCode: res.currentTenant.entCode
			}
			commit('SET_LOGINER', userData)
			app.vue.$fxLogger.setUserInfo(userData)
			resolve(res)
		})
	})
}
export function syncGetProduction ({ commit }) {
	return app.vue.$fxApi('auth.getGroupSubProduct')({ data: { subProduct: ['SCJG_PRO'] } }).then(res => {
		if (res.length > 0) {
			commit('SET_PRODUCTION_VERSION', 'pro')
			app.vue.$store.dispatch('systemGetMesUrl')
		} else {
			commit('SET_PRODUCTION_VERSION', 'basics')
		}
		return Promise.resolve()
	})
}
