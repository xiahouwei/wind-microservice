import library from './library.js'
export default {
	id: 'system-params',
	label: '系统参数',
	actions: [{
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `系统参数种类:${name};` + this.createUpdateMessageByLibrary(library.main)({ code: pre }, { code: cur })
		}
	}]
}
