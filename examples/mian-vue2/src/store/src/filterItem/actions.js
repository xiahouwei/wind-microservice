import app from '@/main.js'

export function getFilterConfigAction ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('customView.getAll').then(res => {
			commit('SET_FILTER_CONFIG_ALL', res)
			resolve(res)
		})
	})
}

export function saveFilterConfigAction ({ commit, state }, params) {
	return new Promise(resolve => {
		const data = {
			mainFilterItem: {
				basic: params.basicFilter,
				more: params.moreFilter,
				hidden: params.hiddenFilter
			},
			mainTableColumn: {
				basic: params.basicColumn,
				hidden: params.hiddenColumn
			}
		}
		const _params = {
			type: params.billType,
			data: JSON.stringify(data)
		}
		const stateConfig = state.appFilterConfig[params.billType]
		if (stateConfig) {
			const paramsData = {
				..._params,
				id: stateConfig.id,
				createDate: stateConfig.createDate,
				createMan: stateConfig.createMan
			}
			app.vue.$fxApi('customView.save', paramsData.id)({ data: paramsData }).then(res => {
				commit('SET_FILTER_CONFIG', res)
				resolve(res)
			})
		} else {
			app.vue.$fxApi('customView.add')({ data: _params }).then(res => {
				commit('SET_FILTER_CONFIG', res)
				resolve(res)
			})
		}
	})
}

export function resetFilterConfigAction ({ commit }, billType) {
	return new Promise(resolve => {
		app.vue.$fxApi('customView.clear', billType).then(res => {
			commit('CLEAR_FILTER_CONFIG', billType)
			resolve(res)
		})
	})
}
