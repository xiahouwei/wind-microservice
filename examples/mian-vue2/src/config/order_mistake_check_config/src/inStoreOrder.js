export default {
	InStore: {
		id: 'inStore',
		label: '入库单',
		selectedList: [],
		mistakeCheckList: [
			{
				id: 'ZeroAmount',
				title: '入库数量为0',
				mistakeType: 'error'
			}, {
				id: 'RelAllGoods',
				title: '仓库与品项关联关系',
				mistakeType: 'error'
			}, {
				id: 'SupplierItem',
				title: '供货商与品项关联关系',
				mistakeType: 'warn'
			}, {
				id: 'RepeatItem',
				title: '重复品项',
				mistakeType: 'warn'
			}, {
				id: 'ZeroPrice',
				title: '单价为0',
				mistakeType: 'warn'
			}, {
				id: 'DiffPrice',
				title: '价格差异',
				mistakeType: 'warn'
			}
		]
	}
}
