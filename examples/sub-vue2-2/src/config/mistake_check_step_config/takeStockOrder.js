export default {
	CheckBill: [{
		step: 1,
		title: '必盘品项',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '重复品项',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '仓库与品项关联关系',
		mistakeType: 'warn'
	}, {
		step: 4,
		title: '单价为0',
		mistakeType: 'warn'
	}, {
		step: 5,
		title: '盘盈品项确定生产日期',
		mistakeType: 'remind'
	}]
}
