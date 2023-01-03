export default {
	PaymentOrder: {
		label: '付款单',
		mainFilterItem: {
			dateRang: {
				id: 'dateRang',
				type: 'dateRange',
				name: '单据时间',
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
				name: '状态',
				position: 'basic'
			},
			organId: {
				id: 'organId',
				type: 'select',
				name: '付款机构',
				position: 'basic'
			},
			otherOrganId: {
				id: 'otherOrganId',
				type: 'select',
				name: '收款机构',
				position: 'basic'
			},
			billType: {
				id: 'billType',
				type: 'select',
				name: '单据类型',
				position: 'basic'
			},
			billBizTypeId: {
				id: 'billBizTypeId',
				type: 'select',
				name: '业务类型',
				position: 'basic'
			},
			department: {
				id: 'department',
				type: 'select',
				name: '核算部门',
				position: 'basic'
			},
			operator: {
				id: 'operator',
				type: 'select',
				name: '经办人',
				position: 'basic'
			},
			bankAccount: {
				id: 'bankAccount',
				type: 'input',
				name: '付款银行账号',
				position: 'basic',
				labelSize: 'lang'
			},
			memo: {
				id: 'memo',
				type: 'input',
				name: '备注',
				position: 'basic'
			},
			bdmemo: {
				id: 'bdmemo',
				type: 'input',
				name: '明细备注',
				position: 'basic'
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
				name: '业务时间',
				width: '160px'
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
				name: '单据状态',
				width: '120px'
			},
			organName: {
				id: 'organName',
				name: '付款机构',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '收款机构',
				width: '120px'
			},
			sumPayMoney: {
				id: 'sumPayMoney',
				name: '付款金额',
				width: '120px'
			},
			operateManName: {
				id: 'operateManName',
				name: '经办人',
				width: '120px'
			},
			modifyDate: {
				id: 'modifyDate',
				name: '最新修改时间',
				width: '140px'
			}
		}
	}
}
