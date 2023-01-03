import app from '@/main.js'
export function saveOrderRequiredConfig ({ commit }, { params }) {
	return new Promise(resolve => {
		const _params = {
			type: params.type,
			data: JSON.stringify(params.data)
		}
		app.vue.$fxApi('orderRequired.saveOrderRequired')({ data: _params }).then(res => {
			commit('SET_ORDER_REQUIRED_SETTING', res)
			resolve(res)
		})
	})
}

export function getOrderRequiredConfig ({ commit }, { type }) {
	return new Promise(resolve => {
		app.vue.$fxApi('orderRequired.getOrderRequired', type).then(res => {
			commit('SET_ORDER_REQUIRED_SETTING', res)
			resolve(res)
		})
	})
}

export function getOrderRequiredConfigAll ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('orderRequired.getOrderRequiredAll').then(res => {
			commit('SET_ORDER_REQUIRED_SETTING', res)
			resolve(res)
		})
	})
}
