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
