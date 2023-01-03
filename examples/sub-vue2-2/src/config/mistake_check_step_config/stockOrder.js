export default {
	StockOrder: [{
		step: 1,
		title: '必订品项',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '重复品项',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '订货数量为0',
		mistakeType: 'error'
	}, {
		step: 4,
		title: '仓库与品项关联关系',
		mistakeType: 'error'
	}, {
		step: 5,
		title: '供货商与品项关联关系',
		mistakeType: 'warn'
	}, {
		step: 6,
		title: '价格差异',
		mistakeType: 'warn'
	}, {
		step: 7,
		title: '单价为0',
		mistakeType: 'warn'
	}]
}
