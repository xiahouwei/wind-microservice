export default {
	MachiningOrder: [{
		step: 1,
		title: '实际数量为0',
		mistakeType: 'error'
	}, {
		step: 2,
		title: '自动导入的配料品项仓库为空',
		mistakeType: 'error'
	}, {
		step: 3,
		title: '仓库与品项关联关系',
		mistakeType: 'error'
	}, {
		step: 4,
		title: '重复品项',
		mistakeType: 'error'
	}, {
		step: 5,
		title: '成品未添加配料',
		mistakeType: 'error'
	}, {
		step: 6,
		title: '费用为0',
		mistakeType: 'warn'
	}]
}
