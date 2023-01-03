import library from './library.js'
export default {
	id: 'item-manage',
	label: '品项管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ item, code }) {
			return `品项名称:${item}, 品项编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, code }) {
			return `品项名称:${name},品项编号:${code};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'connectStore',
		label: '关联仓库',
		messageHandler ({ pre, cur, name, code }) {
			return `品项名称:${name},品项编号:${code};` + this.createUpdateMessageByLibrary(library.connect)({ connectStore: pre }, { connectStore: cur })
		}
	}, {
		id: 'connectLocation',
		label: '默认存放货位',
		messageHandler ({ pre, cur, name, code }) {
			return `品项名称:${name},品项编号:${code};` + this.createUpdateMessageByLibrary(library.location)({ connectLocation: pre }, { connectLocation: cur })
		}
	}, {
		id: 'copyWithItem',
		label: '与其他品项一致',
		messageHandler ({ copyName, name, code }) {
			return `品项名称:${name},品项编号:${code};与"品项名称:${copyName}"一致`
		}
	}, {
		id: 'copyConnect',
		label: '复制关系',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `品项名称:${name},品项编号:${code};复制品项名称:"${_name}"`
		}
	}, {
		id: 'settingFinance',
		label: '设置财务分类',
		messageHandler ({ selectRows, name, code }) {
			const message = selectRows.map(item => {
				return `机构:${item.organName},仓库:${item.houseName},财务分类:${item.financeSortName || ''}`
			}).join(';')
			return `品项名称:${name},品项编号:${code},财务分类自定义设置:${message}`
		}
	}, {
		id: 'itemTypeAdd',
		label: '新增类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'itemTypeDelete',
		label: '删除类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'itemTypeUpdate',
		label: '修改类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出品项档案'
		}
	}, {
		id: 'importModel',
		label: '导入',
		messageHandler ({ name }) {
			return `文件名称:${name}`
		}
	}, {
		id: 'exportModel',
		label: '导出',
		messageHandler () {
			return '导出空白模板'
		}
	}, {
		id: 'settingMulity',
		label: '批量设置',
		messageHandler ({ settingInfo }) {
			return `批量设置信息:${settingInfo}`
		}
	}, {
		id: 'setItemStockPlan',
		label: '品项关联订货方案',
		messageHandler ({ settingInfo }) {
			return `品项关联订货方案信息:${settingInfo}`
		}
	}, {
		id: 'setItemPricePlan',
		label: '品项关联价格方案',
		messageHandler ({ settingInfo }) {
			return `品项关联价格方案信息:${settingInfo}`
		}
	}, {
		id: 'setItemTakeStockClass',
		label: '品项关联盘点分类',
		messageHandler ({ settingInfo }) {
			return `品项关联盘点分类信息:${settingInfo}`
		}
	}]
}
