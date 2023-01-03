export default {
	MoveOrder: {
		label: '调拨单',
		mainFilterItem: {
			dateRange: {
				id: 'dateRange',
				type: 'dateRange',
				name: '调拨时间',
				position: 'basic',
				disable: true
			},
			userBillCode: {
				id: 'userBillCode',
				type: 'input',
				name: '单据号',
				position: 'basic'
			},
			billState: {
				id: 'billState',
				type: 'select',
				name: '审核状态',
				position: 'basic'
			},
			organId: {
				id: 'organId',
				type: 'select',
				name: '入库方',
				position: 'basic'
			},
			otherOrganId: {
				id: 'otherOrganId',
				type: 'select',
				name: '出库方',
				position: 'basic'
			},
			agreeState: {
				id: 'agreeState',
				type: 'select',
				name: '同意状态',
				position: 'basic'
			},
			itemType: {
				id: 'itemType',
				type: 'select',
				name: '品项分类',
				position: 'basic'
			},
			item: {
				id: 'item',
				type: 'select',
				name: '品项',
				position: 'basic'
			},
			billBizType: {
				id: 'billBizType',
				type: 'select',
				name: '业务类型',
				position: 'more'
			},
			billType: {
				id: 'billType',
				type: 'select',
				name: '单据类型',
				position: 'more'
			},
			operateMan: {
				id: 'operateMan',
				type: 'select',
				name: '经办人',
				position: 'more'
			},
			inHouse: {
				id: 'inHouse',
				type: 'select',
				name: '入库仓库',
				position: 'more'
			},
			otherHouse: {
				id: 'otherHouse',
				type: 'select',
				name: '出库仓库',
				position: 'more'
			},
			memo: {
				id: 'memo',
				type: 'input',
				name: '备注',
				position: 'more'
			},
			bdmemo: {
				id: 'bdmemo',
				type: 'input',
				name: '明细备注',
				position: 'more'
			},
			source: {
				id: 'source',
				type: 'select',
				name: '来源',
				position: 'more'
			},
			tagKey: {
				id: 'tagKey',
				type: 'input',
				name: '标签',
				position: 'more'
			}
		},
		mainTableColumn: {
			sysBillCode: {
				id: 'sysBillCode',
				name: '系统单号',
				width: '140px'
			},
			businessDate: {
				id: 'businessDate',
				name: '调拨时间',
				width: '160px'
			},
			organName: {
				id: 'organName',
				name: '入库方',
				width: '120px'
			},
			inHouseNames: {
				id: 'inHouseNames',
				name: '入库仓库',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '出库方',
				width: '120px'
			},
			outHouseNames: {
				id: 'outHouseNames',
				name: '出库仓库',
				width: '120px'
			},
			billTypeName: {
				id: 'billTypeName',
				name: '单据类型',
				width: '120px'
			},
			billBizTypeName: {
				id: 'billBizTypeName',
				name: '业务类型',
				width: '120px'
			},
			detailAmount: {
				id: 'detailAmount',
				name: '明细数',
				width: '120px'
			},
			buyerBillState: {
				id: 'buyerBillState',
				name: '审核状态',
				width: '120px'
			},
			moveState: {
				id: 'moveState',
				name: '同意状态',
				width: '120px'
			},
			userBillCodeList: {
				id: 'userBillCodeList',
				name: '手工单号',
				width: '140px'
			},
			operateManName: {
				id: 'operateManName',
				name: '经办人',
				width: '120px'
			},
			memoList: {
				id: 'memoList',
				name: '备注',
				width: '120px'
			},
			printState: {
				id: 'printState',
				name: '打印状态',
				width: '120px'
			},
			modifyManName: {
				id: 'modifyManName',
				name: '最新修改人',
				width: '120px'
			},
			modifyDate: {
				id: 'modifyDate',
				name: '最新修改时间',
				width: '140px'
			},
			createManName: {
				id: 'createManName',
				name: '创建人',
				width: '120px'
			},
			createDate: {
				id: 'createDate',
				name: '创建时间',
				width: '140px'
			}
		}
	}
}
