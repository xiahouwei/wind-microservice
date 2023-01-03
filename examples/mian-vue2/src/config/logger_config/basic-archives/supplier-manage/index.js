import library from './library.js'
export default {
	id: 'supplier-manage',
	label: '供货商管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ supplier, type }) {
			return `供货商名称:${supplier}, 机构类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ supplier }) {
			return `供货商名称:${supplier}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ supplier }) {
			return `供货商名称:${supplier}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ supplier }) {
			return `供货商名称:${supplier}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ supplier }) {
			return `供货商名称:${supplier}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ supplier }) {
			return `供货商名称:${supplier}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, type }) {
			return `供货商名称:${name},机构类型:${type};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'firstBinding',
		label: 'SRM首次绑定',
		messageHandler ({ supplier, type, supplierSrm }) {
			return `供货商名称:${supplier}, 机构类型:${type}; SRM绑定信息:供货商名称:${supplierSrm.name}, 供货商编号:${supplierSrm.code}`
		}
	}, {
		id: 'againBinding',
		label: 'SRM重新绑定',
		messageHandler ({ pre, cur, name, type }) {
			return `供货商名称:${name}, 机构类型:${type};修改SRM绑定信息为:` + this.createUpdateMessageByLibrary(library.binding)(pre, cur)
		}
	}, {
		id: 'unBinding',
		label: 'SRM解除绑定',
		messageHandler ({ supplier, type, supplierSrm }) {
			return `供货商名称:${supplier}, 机构类型:${type}; SRM解绑信息:供货商名称:${supplierSrm.name}, 供货商编号:${supplierSrm.code}`
		}
	}, {
		id: 'connectItem',
		label: '关联品项',
		messageHandler ({ pre, cur, name, type }) {
			return `供货商名称:${name},机构类型:${type};` +
				this.createUpdateMessageByLibrary(library.connect)(
					{ connectItem: pre.item, connectItemType: pre.itemType },
					{ connectItem: cur.item, connectItemType: cur.itemType }
				)
		}
	}, {
		id: 'copyWithStore',
		label: '与其他机构一致',
		messageHandler ({ copyName, name, type }) {
			return `供货商名称:${name},机构类型:${type};与"机构名称:${copyName}"一致`
		}
	}, {
		id: 'copyConnect',
		label: '复制关系',
		messageHandler ({ selectRows, name, type }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `供货商名称:${name},机构类型:${type};复制机构名称:"${_name}"`
		}
	}, {
		id: 'supplierTreeAdd',
		label: '新增类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'supplierTreeDelete',
		label: '删除类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'supplierTreeUpdate',
		label: '修改类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出供货商档案'
		}
	}, {
		id: 'exportConnectItem',
		label: '导出关联关系',
		messageHandler () {
			return '导出品项关联关系'
		}
	}]
}
