export default {
	MachiningOrder: {
		label: '组合加工单',
		mainFilterItem: {
			dateRang: {
				id: 'dateRang',
				type: 'dateRange',
				name: '业务时间',
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
			billType: {
				id: 'billType',
				type: 'select',
				name: '单据类型',
				position: 'basic'
			},
			// organ: {
			// 	id: 'organ',
			// 	type: 'select',
			// 	name: '机构',
			// 	position: 'basic'
			// },
			// productHouse: {
			// 	id: 'productHouse',
			// 	type: 'select',
			// 	name: '成品仓库',
			// 	position: 'basic'
			// },
			// dosingHouse: {
			// 	id: 'dosingHouse',
			// 	type: 'select',
			// 	name: '配料仓库',
			// 	position: 'basic'
			// },
			product: {
				id: 'product',
				type: 'select',
				name: '成品品项',
				position: 'basic'
			},
			dosing: {
				id: 'dosing',
				type: 'select',
				name: '配料品项',
				position: 'basic'
			},
			operateMan: {
				id: 'operateMan',
				type: 'select',
				name: '经办人',
				position: 'basic'
			},
			checkDate: {
				id: 'checkDate',
				type: 'dateRange',
				name: '审核时间',
				position: 'basic',
				disable: true
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
			checkDateTime: {
				id: 'checkDateTime',
				name: '审核时间',
				width: '140px'
			},
			organName: {
				id: 'organName',
				name: '生产机构',
				width: '120px'
			},
			billTypeName: {
				id: 'billTypeName',
				name: '单据类型',
				width: '120px'
			},
			productDetailAmount: {
				id: 'productDetailAmount',
				name: '成品明细数',
				width: '120px'
			},
			dosingDetailAmount: {
				id: 'dosingDetailAmount',
				name: '配料明细数',
				width: '120px'
			},
			checkState: {
				id: 'checkState',
				name: '审核状态',
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
			memo: {
				id: 'memo',
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
