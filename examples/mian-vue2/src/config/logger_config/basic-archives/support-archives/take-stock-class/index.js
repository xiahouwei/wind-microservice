import library from './library.js'
export default {
	id: 'take-stock-class',
	label: '盘点分类',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name, code }) {
			return `分类名称:${name}, 分类编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ name }) {
			return `分类名称:${name}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ name }) {
			return `分类名称:${name}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ name }) {
			return `分类名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `分类名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'house',
		label: '适用仓库',
		messageHandler ({ pre, cur, name, code }) {
			return `分类名称:${name},分类编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ house: pre }, { house: cur })
		}
	}, {
		id: 'item',
		label: '适用品项',
		messageHandler ({ pre, cur, name, code }) {
			return `分组名称:${name},分组编号:${code};` +
				this.createUpdateMessageByLibrary(library.connect)(
					{ connectItem: pre.item, connectItemType: pre.itemType },
					{ connectItem: cur.item, connectItemType: cur.itemType }
				)
		}
	}, {
		id: 'must',
		label: '必盘品项',
		messageHandler ({ pre, cur, name, code }) {
			return `分类名称:${name},分类编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ must: pre }, { must: cur })
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ name, code }) {
			return `分类名称:${name}, 分类编号:${code}`
		}
	}, {
		id: 'takeStockSort',
		label: '盘点顺序',
		messageHandler ({ pre, cur, name, code, itemCode, itemName }) {
			return `分类名称:${name},分类编号:${code};品项编号:${itemCode},品项名称:${itemName},修改信息为:盘点顺序号由"${pre.indexNum}"改为"${cur.indexNum}"`
		}
	}]
}
