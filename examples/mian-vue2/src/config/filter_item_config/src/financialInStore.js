export default {
	FinancialInStore: {
		label: '财务入库单',
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
				name: '入库方',
				position: 'basic'
			},
			otherOrganId: {
				id: 'otherOrganId',
				type: 'select',
				name: '出库方',
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
			item: {
				id: 'item',
				type: 'select',
				name: '品项',
				position: 'basic'
			},
			inHouse: {
				id: 'inHouse',
				type: 'select',
				name: '入库仓库',
				position: 'basic'
			},
			otherHouse: {
				id: 'otherHouse',
				type: 'select',
				name: '出库仓库',
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
				name: '单据时间',
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
				name: '入库方',
				width: '120px'
			},
			buyerOrganStore: {
				id: 'buyerOrganStore',
				name: '入库仓库',
				width: '120px'
			},
			otherOrganName: {
				id: 'otherOrganName',
				name: '出库方',
				width: '120px'
			},
			sumInTaxMoney: {
				id: 'sumInTaxMoney',
				name: '含税总金额',
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
			checkManName: {
				id: 'checkManName',
				name: '审核人',
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
