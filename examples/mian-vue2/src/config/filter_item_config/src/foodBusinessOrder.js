export default {
	FoodBusinessOrder: {
		label: '菜品营业单据',
		mainFilterItem: {
			dateRange: {
				id: 'dateRange',
				type: 'dateRange',
				name: '营业时间',
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
			offsetStateFilter: {
				id: 'offsetStateFilter',
				type: 'select',
				name: '冲减状态',
				position: 'basic'
			},
			organId: {
				id: 'organId',
				type: 'select',
				name: '营业机构',
				position: 'basic'
			},
			salesRegionId: {
				id: 'salesRegionId',
				type: 'select',
				name: '销售区域',
				position: 'basic'
			},
			item: {
				id: 'item',
				type: 'select',
				name: '菜品',
				position: 'basic'
			},
			billBizTypeId: {
				id: 'billBizTypeId',
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
				name: '营业时间',
				width: '160px'
			},
			organName: {
				id: 'organName',
				name: '营业机构',
				width: '120px'
			},
			salesRegionName: {
				id: 'salesRegionName',
				name: '销售区域',
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
			buyerBillState: {
				id: 'buyerBillState',
				name: '审核状态',
				width: '120px'
			},
			offsetState: {
				id: 'offsetState',
				name: '冲减状态',
				width: '120px'
			},
			salesMoney: {
				id: 'salesMoney',
				name: '折前销售额',
				width: '120px'
			},
			realSalesMoney: {
				id: 'realSalesMoney',
				name: '实际销售额',
				width: '120px'
			},
			dishAmount: {
				id: 'dishAmount',
				name: '菜品总数',
				width: '120px'
			},
			dishNumber: {
				id: 'dishNumber',
				name: '菜品种数',
				width: '120px'
			},
			dataReasource: {
				id: 'dataReasource',
				name: '数据来源',
				width: '120px'
			},
			billCode: {
				id: 'billCode',
				name: '手工单号',
				width: '140px'
			},
			operateManName: {
				id: 'operateManName',
				name: '经办人',
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
