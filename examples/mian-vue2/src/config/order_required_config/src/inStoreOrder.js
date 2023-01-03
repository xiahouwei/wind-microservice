export default {
	InStore: {
		label: '入库单',
		billTypes: [
			{
				id: 1002,
				label: '采购入库',
				requiredItems: {
					'otherOrgan.id': {
						id: 'otherOrgan.id',
						label: '出库方',
						required: false
					},
					billBizTypeId: {
						id: 'billBizTypeId',
						label: '业务类型',
						required: false
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
					},
					appendixes: {
						id: 'appendixes',
						label: '附件',
						required: false
					}
				}
			},
			{
				id: 1001,
				label: '期初入库',
				requiredItems: {
					billBizTypeId: {
						id: 'billBizTypeId',
						label: '业务类型',
						required: false
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
					},
					appendixes: {
						id: 'appendixes',
						label: '附件',
						required: false
					}
				}
			},
			{
				id: 1003,
				label: '其他入库',
				requiredItems: {
					'otherOrgan.id': {
						id: 'otherOrgan.id',
						label: '出库方',
						required: false
					},
					billBizTypeId: {
						id: 'billBizTypeId',
						label: '业务类型',
						required: false
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
					},
					appendixes: {
						id: 'appendixes',
						label: '附件',
						required: false
					}
				}
			},
			{
				id: 1007,
				label: '采购退货',
				requiredItems: {
					billBizTypeId: {
						id: 'billBizTypeId',
						label: '业务类型',
						required: false
					},
					memo: {
						id: 'memo',
						label: '备注',
						required: false
					},
					appendixes: {
						id: 'appendixes',
						label: '附件',
						required: false,
						relevance: {
							label: '入库方',
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
								}
							]
						}
					}
				}
			}
		]
	}
}
