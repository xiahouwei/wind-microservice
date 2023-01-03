import library from './library.js'
export default {
	id: 'item-custom-group',
	label: '品项自定义分组',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name, code }) {
			return `分组名称:${name}, 分组编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ name }) {
			return `分组名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `分组名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'connectItem',
		label: '适用品项',
		messageHandler ({ pre, cur, name, code }) {
			return `分组名称:${name},分组编号:${code};` +
				this.createUpdateMessageByLibrary(library.connect)(
					{ connectItem: pre.item, connectItemType: pre.itemType },
					{ connectItem: cur.item, connectItemType: cur.itemType }
				)
		}
	}]
}
