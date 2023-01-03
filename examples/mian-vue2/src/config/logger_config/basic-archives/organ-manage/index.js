import library from './library.js'
export default {
	id: 'organ-manage',
	label: '机构管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ shop, type }) {
			return `机构名称:${shop}, 机构类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ shop }) {
			return `机构名称:${shop}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ shop }) {
			return `机构名称:${shop}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ shop }) {
			return `机构名称:${shop}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ shop }) {
			return `机构名称:${shop}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ shop }) {
			return `机构名称:${shop}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, type }) {
			return `机构名称:${name},机构类型:${type};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'connectItem',
		label: '关联品项',
		messageHandler ({ pre, cur, name, type }) {
			return `机构名称:${name},机构类型:${type};` +
				this.createUpdateMessageByLibrary(library.connect)(
					{ connectItem: pre.item, connectItemType: pre.itemType },
					{ connectItem: cur.item, connectItemType: cur.itemType }
				)
		}
	}, {
		id: 'copyWithStore',
		label: '与其他机构一致',
		messageHandler ({ copyName, name, type }) {
			return `机构名称:${name},机构类型:${type};与"机构名称:${copyName}"一致`
		}
	}, {
		id: 'copyConnect',
		label: '复制关系',
		messageHandler ({ selectRows, name, type }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `机构名称:${name},机构类型:${type};复制机构名称:"${_name}"`
		}
	}, {
		id: 'organTreeAdd',
		label: '新增区域',
		messageHandler ({ name }) {
			return `区域名称:${name}`
		}
	}, {
		id: 'organTreeDelete',
		label: '删除区域',
		messageHandler ({ name }) {
			return `区域名称:${name}`
		}
	}, {
		id: 'organTreeUpdate',
		label: '修改区域',
		messageHandler ({ name }) {
			return `区域名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出机构档案'
		}
	}, {
		id: 'exportConnectItem',
		label: '导出关联关系',
		messageHandler () {
			return '导出品项关联关系'
		}
	}]
}
