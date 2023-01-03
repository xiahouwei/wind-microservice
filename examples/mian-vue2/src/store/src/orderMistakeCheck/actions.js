import app from '@/main.js'
export function saveOrderMistakeCheckConfig ({ commit }, { params }) {
	return new Promise(resolve => {
		const _params = {
			type: params.type,
			data: JSON.stringify(params.data)
		}
		app.vue.$fxApi('orderMistakeCheck.saveOrderMistakeCheck')({ data: _params }).then(res => {
			commit('SET_ORDER_MISTAKE_CHECK_SETTING', res)
			resolve(res)
		})
	})
}

export function getOrderMistakeCheckConfig ({ commit }, { type }) {
	return new Promise(resolve => {
		app.vue.$fxApi('orderMistakeCheck.getOrderMistakeCheck', type).then(res => {
			commit('SET_ORDER_MISTAKE_CHECK_SETTING', res)
			resolve(res)
		})
	})
}

export function getOrderMistakeCheckConfigAll ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('orderMistakeCheck.getOrderMistakeCheckAll').then(res => {
			commit('SET_ORDER_MISTAKE_CHECK_SETTING', res)
			resolve(res)
		})
	})
}
