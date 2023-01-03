export default {
	SaleOrder: {
		label: '销售订单',
		billTypes: [
			{
				id: 5000,
				label: '销售订单',
				requiredItems: {
					'billBizType.id': {
						id: 'billBizType.id',
						label: '业务类型',
						required: false
					},
					'stockPlan.id': {
						id: 'stockPlan.id',
						label: '订货方案',
						required: false,
						relevance: {
							label: '卖方机构',
							relevanceArr: [],
							relevanceOptions: [
								{
									id: '2',
									type: 'shop',
									label: '门店'
								},
								{
									id: '1',
									type: 'rdc',
									label: '中心'
								},
								{
									id: '5',
									type: 'supplier',
									label: '供货商'
								},
								{
									id: '6',
									type: 'customer',
									label: '客户'
								}
							]
						}
					},
					carriageFee: {
						id: 'carriageFee',
						label: '整单运费',
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
