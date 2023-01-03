import library from './library.js'
export default {
	id: 'dosing-default-house',
	label: '配料默认仓库设置',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ organName, defaultHouseType, houseName }) {
			const defaultHouseTypeLogger = defaultHouseType ? '默认领用出库仓库' : '默认加工出库仓库'
			return `加工机构名称:${organName},默认仓库类型:${defaultHouseTypeLogger},仓库名称:${houseName}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ organName, defaultHouseType, houseName }) {
			const defaultHouseTypeLogger = defaultHouseType ? '默认领用出库仓库' : '默认加工出库仓库'
			return `加工机构名称:${organName},默认仓库类型:${defaultHouseTypeLogger},仓库名称:${houseName}`
		}
	}, {
		id: 'deleteMulity',
		label: '删除',
		messageHandler ({ loggerInfo }) {
			return loggerInfo
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur }) {
			return '修改信息为:' + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}]
}
