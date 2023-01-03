export default {
	StockOfferOrder: {
		label: '采购报价单',
		mainFilterItem: {
			billCode: {
				id: 'billCode',
				type: 'input',
				name: '单据号',
				position: 'basic'
			},
			state: {
				id: 'state',
				type: 'select',
				name: '审核状态',
				position: 'basic'
			},
			buyerOrgan: {
				id: 'buyerOrgan',
				type: 'select',
				name: '买方机构',
				position: 'basic'
			},
			sellerOrgan: {
				id: 'sellerOrgan',
				type: 'select',
				name: '卖方机构',
				position: 'basic'
			},
			billKind: {
				id: 'billKind',
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
			sendState: {
				id: 'sendState',
				type: 'select',
				name: '发单状态',
				position: 'more'
			},
			memo: {
				id: 'memo',
				type: 'input',
				name: '备注',
				position: 'more'
			}
		},
		mainTableColumn: {
			sysBillCode: {
				id: 'sysBillCode',
				name: '系统单号',
				width: '140px'
			},
			organName: {
				id: 'organName',
				name: '买方机构',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '卖方机构',
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
			sendFlag: {
				id: 'sendFlag',
				name: '发单状态',
				width: '120px'
			},
			billTypeName: {
				id: 'billTypeName',
				name: '单据类型',
				width: '120px'
			},
			userBillCode: {
				id: 'userBillCode',
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
				name: '最新创建人',
				width: '120px'
			},
			createDate: {
				id: 'createDate',
				name: '最新创建时间',
				width: '140px'
			}
		}
	}
}
