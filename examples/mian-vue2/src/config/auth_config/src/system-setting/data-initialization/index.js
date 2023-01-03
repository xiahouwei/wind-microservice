export default {
	'data-initialization': {
		id: 'data-initialization',
		label: '数据初始化',
		code: '0002_0005',
		connectDetails: ['system-setting_data-initialization.initialize-bill', 'system-setting_data-initialization.initialize-bill-archives'],
		child: {
			'initialize-bill': {
				id: 'initialize-bill',
				label: '初始化单据',
				code: '0002_0005_080_001',
				connectModule: ['system-setting_data-initialization'],
				controlled: 'initialize-bill-archives'
			},
			'initialize-bill-archives': {
				id: 'initialize-bill-archives',
				label: '初始化单据+档案',
				code: '0002_0005_080_002',
				decision: ['initialize-bill']
			}
		}
	}
}
