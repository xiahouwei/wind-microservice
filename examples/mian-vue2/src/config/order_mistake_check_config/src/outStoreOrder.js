export default {
	OutStore: {
		id: 'outStore',
		label: '出库单',
		selectedList: [],
		mistakeCheckList: [
			{
				id: 'ZeroAmount',
				title: '出库数量为0',
				mistakeType: 'remind'
			}, {
				id: 'Repeat',
				title: '重复品项',
				mistakeType: 'warn'
			}, {
				id: 'RelAllGoods',
				title: '仓库与品项关联关系',
				mistakeType: 'warn'
			}, {
				id: 'StockFkc',
				title: '出库数量为负库存',
				mistakeType: 'remind'
			}, {
				id: 'DistributionMarkNull',
				title: '出库品项未配货',
				mistakeType: 'remind'
			}, {
				id: 'ZeroSalesPrice',
				title: '单价为0',
				mistakeType: 'warn'
			}, {
				id: 'DiffPrice',
				title: '价格差异',
				mistakeType: 'warn'
			}, {
				id: 'SalesPriceLessThanCostPrice',
				title: '销售价格小于成本价格',
				mistakeType: 'warn'
			}
		]
	}
}
