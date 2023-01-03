export default {
	TakeStockOrder: {
		label: '盘点单',
		billTypes: [
			{
				id: 4001,
				label: '盘点',
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
					}
				}
			}
		]
	}
}
