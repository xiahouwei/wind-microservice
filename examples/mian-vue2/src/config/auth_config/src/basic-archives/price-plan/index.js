export default {
	'price-plan': {
		id: 'price-plan',
		label: '价格方案管理',
		code: '0001_0008',
		child: {
			'add-price': {
				id: 'add-price',
				label: '新建价格方案',
				code: '0001_0008_001_001',
				decision: ['edit-price']
			},
			'edit-price': {
				id: 'edit-price',
				label: '编辑价格方案',
				code: '0001_0008_002_001',
				controlled: 'add-price'
			},
			'delete-price': {
				id: 'delete-price',
				label: '删除价格方案',
				code: '0001_0008_004_001'
			},
			'recover-price': {
				id: 'recover-price',
				label: '恢复价格方案',
				code: '0001_0008_005_001'
			},
			'enable-price': {
				id: 'enable-price',
				label: '启用价格方案',
				code: '0001_0008_006_001'
			},
			'disable-price': {
				id: 'disable-price',
				label: '停用价格方案',
				code: '0001_0008_008_001'
			},
			'check-price': {
				id: 'check-price',
				label: '审核价格方案',
				code: '0001_0008_011_001'
			},
			'uncheck-price': {
				id: 'uncheck-price',
				label: '反审价格方案',
				code: '0001_0008_012_001'
			},
			'copybill-price': {
				id: 'copybill-price',
				label: '复制价格方案',
				code: '0001_0008_017_001'
			},
			'import-price': {
				id: 'import-price',
				label: '按模板导入价格方案',
				code: '0001_0008_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白价格方案',
				code: '0001_0008_040_002'
			},
			'export-price': {
				id: 'export-price',
				label: '导出价格方案明细数据',
				code: '0001_0008_040_003'
			}
		}
	}
}
