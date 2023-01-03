import library from './library.js'
export default {
	id: 'sales-area',
	label: '销售区域',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ code, name }) {
			return `销售区域编号:${code},销售区域名称:${name}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ selectRows }) {
			return selectRows.map(item => {
				return `销售区域编号:${item.code},销售区域名称:${item.name}`
			}).join(',')
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, code, name }) {
			return `销售区域编号:${code},销售区域名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ selectRows }) {
			return selectRows.map(item => {
				return `销售区域编号:${item.code},销售区域名称:${item.name}`
			}).join(',')
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ selectRows }) {
			return selectRows.map(item => {
				return `销售区域编号:${item.code},销售区域名称:${item.name}`
			}).join(',')
		}
	}, {
		id: 'setOffsetHouse',
		label: '设置冲减仓库',
		messageHandler (loggerInfo) {
			return loggerInfo.map(item => {
				return `【${item.organName}】的【${item.salesRegionName}】中【${item.itemName}】从【${item.storeName}】进行冲减出库`
			}).join('；')
		}
	}, {
		id: 'setOffsetHouseMulity',
		label: '批量设置冲减仓库',
		messageHandler (loggerInfo) {
			return loggerInfo.map(item => {
				return `【${item.organName}】的【${item.salesRegionName}】中【${item.itemName}】从【${item.storeName}】进行冲减出库`
			}).join('；')
		}
	}]
}
