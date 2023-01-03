export default {
	StockPlanOrder: {
		id: 'stockPlanOrder',
		label: '采购计划单',
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
				title: '申请数量为0',
				mistakeType: 'error'
			}, {
				id: 'ItemHouseRelation',
				title: '仓库与品项关联关系',
				mistakeType: 'error'
			}
		]
	}
}
