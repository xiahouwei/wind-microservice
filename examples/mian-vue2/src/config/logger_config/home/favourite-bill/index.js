import library from './library.js'
export default {
	id: 'favourite-bill',
	label: '常用单据',
	actions: [{
		id: 'set',
		label: '设置常用单据',
		messageHandler ({ pre, cur }) {
			return this.createUpdateMessageByLibrary(library.favouriteBill)({ favouriteBill: pre }, { favouriteBill: cur })
		}
	}]
}
