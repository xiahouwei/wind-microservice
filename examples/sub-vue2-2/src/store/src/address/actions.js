import fxApi from '@/js/api/index'
export function syncAreaData (context) {
	return new Promise(resolve => {
		fxApi('common.getAreaProvinceCity').then(res => {
			context.commit('SET_ADDRESS', {
				areaData: res
			})
			resolve()
		})
	})
}
