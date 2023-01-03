export default {
	SaleOrder: {
		label: '销售订单',
		mainFilterItem: {
			dateRange: {
				id: 'dateRange',
				type: 'dateRange',
				name: '订货时间',
				position: 'basic',
				disable: true
			},
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
			billKind: {
				id: 'billKind',
				type: 'select',
				name: '单据类型',
				position: 'more'
			},
			purchasePlan: {
				id: 'purchasePlan',
				type: 'select',
				name: '订货方案',
				position: 'more'
			},
			operateMan: {
				id: 'operateMan',
				type: 'select',
				name: '经办人',
				position: 'more'
			},
			inAssignStatus: {
				id: 'inAssignStatus',
				type: 'select',
				name: '入库状态',
				position: 'more'
			},
			outAssignStatus: {
				id: 'outAssignStatus',
				type: 'select',
				name: '出库状态',
				position: 'more'
			},
			supplierState: {
				id: 'supplierState',
				type: 'select',
				name: '发单状态',
				position: 'more'
			},
			urgent: {
				id: 'urgent',
				type: 'select',
				name: '加急状态',
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
				name: '订货时间',
				width: '160px'
			},
			organName: {
				id: 'organName',
				name: '卖方机构',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '买方机构',
				width: '120px'
			},
			stockPlanName: {
				id: 'stockPlanName',
				name: '订货方案',
				width: '120px'
			},
			billBizTypeName: {
				id: 'billBizTypeName',
				name: '业务类型',
				width: '120px'
			},
			urgentFlag: {
				id: 'urgentFlag',
				name: '加急状态',
				width: '120px'
			},
			detailAmount: {
				id: 'detailAmount',
				name: '明细数',
				width: '120px'
			},
			billState: {
				id: 'billState',
				name: '审核状态',
				width: '120px'
			},
			inAssignStatus: {
				id: 'inAssignStatus',
				name: '入库状态',
				width: '120px'
			},
			outAssignStatus: {
				id: 'outAssignStatus',
				name: '出库状态',
				width: '120px'
			},
			sumTaxMoney: {
				id: 'sumTaxMoney',
				name: '含税销售总金额',
				width: '120px'
			},
			sumMoney: {
				id: 'sumMoney',
				name: '非税销售总金额',
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
			printState: {
				id: 'printState',
				name: '打印状态',
				width: '120px'
			},
			generateWay: {
				id: 'generateWay',
				name: '单据来源',
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