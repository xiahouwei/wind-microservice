export default {
	InStore: [{
		step: 1,
		title: '入库数量为0',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '仓库与品项关联关系',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '重复品项',
		mistakeType: 'warn'
	}, {
		step: 4,
		title: '单价为0',
		mistakeType: 'warn'
	}, {
		step: 5,
		title: '价格差异',
		mistakeType: 'warn'
	}],
	InStoreWithSupplier: [{
		step: 1,
		title: '入库数量为0',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '仓库与品项关联关系',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '供货商与品项关联关系',
		mistakeType: 'warn'
	}, {
		step: 4,
		title: '重复品项',
		mistakeType: 'warn'
	}, {
		step: 5,
		title: '单价为0',
		mistakeType: 'warn'
	}, {
		step: 6,
		title: '价格差异',
		mistakeType: 'warn'
	}]
}
