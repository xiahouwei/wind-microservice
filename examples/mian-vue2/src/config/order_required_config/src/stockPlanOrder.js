export default {
	StockPlanOrder: {
		label: '采购计划单',
		billTypes: [
			{
				id: 6000,
				label: '采购计划',
				requiredItems: {
					'billBizType.id': {
						id: 'billBizType.id',
						label: '业务类型',
						required: false
					},
					'stockPlan.id': {
						id: 'stockPlan.id',
						label: '订货方案',
						required: false
					},
					memo: {
						id: 'memo',
						label: '备注',
						required: false
					}
				}
			}
		]
	}
}
