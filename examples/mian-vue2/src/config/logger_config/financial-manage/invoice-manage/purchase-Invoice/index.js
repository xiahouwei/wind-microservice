import library from './library.js'
export default {
	id: 'purchase-invoice',
	label: '采购发票',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ code, type }) {
			return `发票号码:${code},发票类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ codes }) {
			return `发票号码:${codes}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ codes }) {
			return `发票号码:${codes}`
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ codes }) {
			return `发票号码:${codes}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, code }) {
			return `发票号码:${code};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler () {
			return '导出空白模板'
		}
	}, {
		id: 'exportData',
		label: '按模板导出数据',
		messageHandler ({ codes }) {
			return `发票号码:${codes}`
		}
	}, {
		id: 'importModel',
		label: '批量导入',
		messageHandler ({ name }) {
			return `文件名称:${name}`
		}
	}]
}
