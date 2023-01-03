export default {
	StockOrder: {
		label: '采购订单',
		billTypes: [
			{
				id: 1,
				label: '采购订单',
				requiredItems: {
					billBizTypeId: {
						id: 'billBizTypeId',
						label: '业务类型',
						required: false
					},
					purchasePlan: {
						id: 'purchasePlan',
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
