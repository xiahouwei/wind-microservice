export default {
	VerificationOrder: {
		label: '应付核销',
		mainFilterItem: {
			dateRang: {
				id: 'dateRang',
				type: 'dateRange',
				name: '单据日期',
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
			writeOffWay: {
				id: 'writeOffWay',
				type: 'select',
				name: '核销方式',
				position: 'basic'
			},
			department: {
				id: 'department',
				type: 'select',
				name: '核算部门',
				position: 'basic'
			},
			writeOffMan: {
				id: 'writeOffMan',
				type: 'input',
				name: '核销人',
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
			writeOffWay: {
				id: 'writeOffWay',
				name: '核销方式',
				width: '120px'
			},
			billState: {
				id: 'billState',
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
			departmentName: {
				id: 'departmentName',
				name: '核算部门',
				width: '120px'
			},
			writeOffMoney: {
				id: 'writeOffMoney',
				name: '本次核销金额',
				width: '120px'
			},
			writeOffMan: {
				id: 'writeOffMan',
				name: '核销人',
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
