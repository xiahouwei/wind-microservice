export default {
	StockOrder: {
		id: 'stockOrder',
		label: '采购订单',
		selectedList: [],
		mistakeCheckList: [
			{
				id: 'Must',
				title: '必订品项',
				mistakeType: 'error'
			}, {
				id: 'Repeat',
				title: '重复品项',
				mistakeType: 'error'
			}, {
				id: 'ZeroAmount',
				title: '订货数量为0',
				mistakeType: 'error'
			}, {
				id: 'ItemHouse',
				title: '仓库与品项关联关系',
				mistakeType: 'error'
			}, {
				id: 'SupplierItem',
				title: '供货商与品项关联关系',
				mistakeType: 'warn'
			}, {
				id: 'DiffPrice',
				title: '价格差异',
				mistakeType: 'warn'
			}, {
				id: 'ZeroPrice',
				title: '单价为0',
				mistakeType: 'warn'
			}
		]
	}
}
