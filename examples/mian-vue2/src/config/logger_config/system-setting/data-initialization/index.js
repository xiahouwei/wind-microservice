export default {
	id: 'data-initialization',
	label: '数据初始化',
	actions: [{
		id: 'initializeBill',
		label: '初始化单据',
		messageHandler () {
			return '初始化单据'
		}
	}, {
		id: 'initializeBillAndArchives',
		label: '初始化单据+档案',
		messageHandler () {
			return '初始化单据+档案'
		}
	}]
}
