export default {
	OutStore: {
		label: '出库单',
		billTypes: [
			{
				id: 2001,
				label: '销售出库',
				requiredItems: {
					'otherOrgan.id': {
						id: 'otherOrgan.id',
						label: '入库方',
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
				id: 2002,
				label: '其他出库',
				requiredItems: {
					'otherOrgan.id': {
						id: 'otherOrgan.id',
						label: '入库方',
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
				id: 2003,
				label: '报损出库',
				requiredItems: {
					'otherOrgan.id': {
						id: 'otherOrgan.id',
						label: '入库方',
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
			}
		]
	}
}
