export default {
	MoveApply: [{
		step: 1,
		title: '调拨数量为0',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '仓库与品项关联关系',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '重复品项',
		mistakeType: 'warn'
	}]
}
