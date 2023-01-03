export default {
	MoveOrder: {
		label: '调拨单',
		billTypes: [
			{
				id: 3001,
				label: '调拨申请',
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
			},
			{
				id: 3002,
				label: '领用申请',
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
