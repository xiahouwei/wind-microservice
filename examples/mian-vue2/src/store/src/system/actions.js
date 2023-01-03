import app from '@/main.js'
export function systemGetParamsConfig ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('paramConfig.getParamsAll').then(res => {
			commit('SET_SYSTEM', {
				sysParamsConfig: res
			})
			resolve(res)
		})
	})
}

export function systemGetBiubiuorderUrl ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('biubiuorder.getBiubiuorderUrl').then(res => {
			commit('SET_SYSTEM', {
				biubiuorderUrl: res
			})
			resolve(res)
		})
	})
}
export function systemGetMesUrl ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('productionPlan.getMesUrl').then(res => {
			commit('SET_SYSTEM', {
				productionManagerUrl: res
			})
			resolve(res)
		})
	})
}
