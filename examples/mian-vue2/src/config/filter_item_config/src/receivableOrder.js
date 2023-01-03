export default {
	ReceivableOrder: {
		label: '应收单',
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
				name: '收款机构',
				position: 'basic'
			},
			otherOrganId: {
				id: 'otherOrganId',
				type: 'select',
				name: '付款机构',
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
			invoice: {
				id: 'invoice',
				type: 'input',
				name: '发票号码',
				position: 'basic'
			},
			operator: {
				id: 'operator',
				type: 'select',
				name: '经办人',
				position: 'basic'
			},
			sourceType: {
				id: 'sourceType',
				type: 'select',
				name: '业务来源',
				position: 'basic'
			},
			payWay: {
				id: 'payWay',
				type: 'select',
				name: '客户支付方式',
				position: 'basic'
			},
			memo: {
				id: 'memo',
				type: 'input',
				name: '备注',
				position: 'basic'
			}
		},
		mainTableColumn: {
			sysBillCode: {
				id: 'sysBillCode',
				name: '单据编号',
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
				name: '收款机构',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '付款机构',
				width: '120px'
			},
			departmentName: {
				id: 'departmentName',
				name: '核算部门',
				width: '120px'
			},
			sumTotalMoney: {
				id: 'sumTotalMoney',
				name: '应收金额',
				width: '120px'
			},
			invoiceCode: {
				id: 'invoiceCode',
				name: '发票号码',
				width: '120px'
			},
			sourceTypeName: {
				id: 'sourceTypeName',
				name: '业务来源',
				width: '120px'
			},
			payWay: {
				id: 'payWay',
				name: '客户支付方式',
				width: '120px'
			},
			memoList: {
				id: 'memoList',
				name: '备注',
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
