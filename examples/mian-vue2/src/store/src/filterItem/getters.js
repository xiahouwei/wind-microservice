import { FILTER_ITEM_CONFIG } from '@/config/filter_item_config'
import utils from '@/js/lib/utils'
const log = utils.fxDebug('fxFilterItem')

function getFilterItem (state, billType) {
	const filterItemConfig = FILTER_ITEM_CONFIG[billType].mainFilterItem
	if (state.appFilterConfig[billType]) {
		const { basic, more, hidden } = state.appFilterConfig[billType].data.mainFilterItem
		const all = {}
		const basicList = []
		const moreList = []
		const hiddenList = []
		basic.forEach(item => {
			all[item.id] = true
			if (filterItemConfig[item.id]) {
				basicList.push(filterItemConfig[item.id])
			}
		})
		more.forEach(item => {
			all[item.id] = true
			if (filterItemConfig[item.id]) {
				moreList.push(filterItemConfig[item.id])
			}
		})
		hidden.forEach(item => {
			all[item.id] = true
			if (filterItemConfig[item.id]) {
				hiddenList.push(filterItemConfig[item.id])
			}
		})
		Object.values(filterItemConfig).forEach(item => {
			if (!all[item.id]) {
				item.position === 'basic' ? basicList.push(item) : moreList.push(item)
			}
		})
		return {
			basic: basicList,
			more: moreList,
			hidden: hiddenList
		}
	} else {
		const basic = []
		const more = []
		const hidden = []
		Object.values(filterItemConfig).forEach(item => {
			item.position === 'basic' ? basic.push(item) : more.push(item)
		})
		return {
			basic,
			more,
			hidden
		}
	}
}
function getTableColumn (state, billType) {
	const filterItemConfig = utils.deepClone(FILTER_ITEM_CONFIG[billType].mainTableColumn)
	if (state.appFilterConfig[billType]) {
		const { basic, hidden } = state.appFilterConfig[billType].data.mainTableColumn
		const all = {}
		const basicList = []
		const hiddenList = []
		basic.forEach(item => {
			all[item.id] = true
			if (filterItemConfig[item.id]) {
				if (item.width) {
					filterItemConfig[item.id].width = item.width
				}
				basicList.push(filterItemConfig[item.id])
			}
		})
		hidden.forEach(item => {
			all[item.id] = true
			if (filterItemConfig[item.id]) {
				if (item.width) {
					filterItemConfig[item.id].width = item.width
				}
				hiddenList.push(filterItemConfig[item.id])
			}
		})
		Object.values(filterItemConfig).forEach(item => {
			if (!all[item.id]) {
				basicList.push(item)
			}
		})
		return {
			basic: basicList,
			hidden: hiddenList
		}
	} else {
		const basic = []
		const hidden = []
		Object.values(filterItemConfig).forEach(item => {
			basic.push(item)
		})
		return {
			basic,
			hidden
		}
	}
}
export default {
	mainFilterItemGetter: state => (filterKey) => {
		return getFilterItem(state, filterKey)
	},
	mainFilterItemRenderGetter: state => function (filterKey) {
		const _this = this
		return function (filterType, filterItemRenderConfig) {
			return getFilterItem(state, filterKey)[filterType].map(item => {
				if (!filterItemRenderConfig[item.id]) {
					log(`mainFilterItemRenderGetter:无法找到此render-${item.id}`)
					return null
				}
				return filterItemRenderConfig[item.id].call(_this, _this.$createElement)
			})
		}
	},
	mainTableColumnGetter: state => (filterKey) => {
		return getTableColumn(state, filterKey)
	},
	mainTableColumnVisibleGetter: state => function (filterKey) {
		return function (columnMap) {
			return getTableColumn(state, filterKey).basic.reduce((pre, cur) => {
				if (!columnMap[cur.id]) {
					log(`mainTableColumnVisibleGetter:无法找到此列-${cur.id}`)
				} else {
					if (cur.width) {
						columnMap[cur.id].width = cur.width
					}
					pre.push(columnMap[cur.id])
				}
				return pre
			}, [])
		}
	}
}
