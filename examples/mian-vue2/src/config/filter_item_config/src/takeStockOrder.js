export default {
	TakeStockOrder: {
		label: '盘点单',
		mainFilterItem: {
			dateRange: {
				id: 'dateRange',
				type: 'dateRange',
				name: '盘点时间',
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
				name: '盘点机构',
				position: 'basic'
			},
			houseId: {
				id: 'houseId',
				type: 'select',
				name: '盘点仓库',
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
			entryClerk: {
				id: 'entryClerk',
				type: 'select',
				name: '经办人',
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
				name: '盘点时间',
				width: '160px'
			},
			organName: {
				id: 'organName',
				name: '盘点机构',
				width: '120px'
			},
			houseName: {
				id: 'houseName',
				name: '盘点仓库',
				width: '120px'
			},
			checkClassName: {
				id: 'checkClassName',
				name: '盘点分类',
				width: '120px'
			},
			checkWay: {
				id: 'checkWay',
				name: '盘点方式',
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
			sumTaxMoney: {
				id: 'sumTaxMoney',
				name: '实盘总金额',
				width: '120px'
			},
			sumAccountTaxMoney: {
				id: 'sumAccountTaxMoney',
				name: '账存总金额',
				width: '120px'
			},
			diffMoney: {
				id: 'diffMoney',
				name: '差异总金额',
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
