import library from './library.js'
export default {
	id: 'goods-manage',
	label: '商品管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ item, code }) {
			return `商品名称:${item}, 商品编码:${code}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, code }) {
			return `商品名称:${name}, 商品编码:${code};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ names }) {
			return `商品名称:${names}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `商品名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `商品名称:${names}`
		}
	}, {
		id: 'unbind',
		label: '解绑',
		messageHandler ({ names }) {
			return `商品名称:${names}`
		}
	}, {
		id: 'push',
		label: '推送',
		messageHandler ({ names }) {
			return `商品名称:${names}`
		}
	}, {
		id: 'import',
		label: '导入',
		messageHandler ({ item }) {
			return `导入品项:${item}`
		}
	}]
}
