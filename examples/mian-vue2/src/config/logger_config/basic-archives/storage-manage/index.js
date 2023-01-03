import library from './library.js'
export default {
	id: 'storage-manage',
	label: '货位管理',
	actions: [{
		id: 'addRack',
		label: '新增货架',
		messageHandler ({ code, name, type }) {
			return `货架编码:${code}, 货架名称:${name}, 货架类型:${type}`
		}
	}, {
		id: 'deleteRack',
		label: '删除货架',
		messageHandler ({ code, name }) {
			return `货架编码:${code}, 货架名称:${name}`
		}
	}, {
		id: 'updateRack',
		label: '修改货架',
		messageHandler ({ pre, cur, code, name }) {
			return `货架编码:${code}, 货架名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.rack)(pre, cur)
		}
	}, {
		id: 'add',
		label: '新增货位',
		messageHandler ({ code, shelfCode, type }) {
			return `货位编码:${code}, 货位编码:${shelfCode}, 货位类型:${type}`
		}
	}, {
		id: 'update',
		label: '修改货位',
		messageHandler ({ pre, cur, code, shelfCode }) {
			return `货位编码:${code}, 货架编码:${shelfCode};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'delete',
		label: '删除货位',
		messageHandler ({ code }) {
			return `货位编码:${code}`
		}
	}, {
		id: 'enable',
		label: '启用货位',
		messageHandler ({ code }) {
			return `货位编码:${code}`
		}
	}, {
		id: 'disable',
		label: '停用货位',
		messageHandler ({ code }) {
			return `货位编码:${code}`
		}
	}, {
		id: 'connectItem',
		label: '关联品项',
		messageHandler ({ pre, cur, code, shelfCode }) {
			return `货位编码:${code}, 货架编码:${shelfCode};` + this.createUpdateMessageByLibrary(library.connect)({ connectItem: pre }, { connectItem: cur })
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出货位档案'
		}
	}, {
		id: 'importData',
		label: '导入',
		messageHandler ({ name }) {
			return `文件名称:${name}`
		}
	}]
}
