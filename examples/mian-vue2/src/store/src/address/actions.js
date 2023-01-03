import fxApi from '@/js/api/index'

export function syncAreaData ({ commit, state }) {
	return new Promise(resolve => {
		if (state.areaData.length === 0) {
			fxApi('common.getAreaProvinceCity').then(res => {
				commit('SET_ADDRESS', {
					areaData: res
				})
				resolve()
			})
		} else {
			resolve()
		}
	})
}
