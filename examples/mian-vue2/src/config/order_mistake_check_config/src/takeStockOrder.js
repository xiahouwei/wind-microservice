export default {
	TakeStockOrder: {
		id: 'takeStockOrder',
		label: '盘点单',
		selectedList: [],
		mistakeCheckList: [
			{
				id: 'MustItem',
				title: '必盘品项',
				mistakeType: 'error'
			}, {
				id: 'Repeat',
				title: '重复品项',
				mistakeType: 'error'
			}, {
				id: 'ItemHouse',
				title: '仓库与品项关联关系',
				mistakeType: 'warn'
			}, {
				id: 'PyZeroPrice',
				title: '单价为0',
				mistakeType: 'warn'
			}, {
				id: 'PyModProductDate',
				title: '盘盈品项确定生产日期',
				mistakeType: 'remind'
			}
		]
	}
}
