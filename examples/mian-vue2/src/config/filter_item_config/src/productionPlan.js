export default {
	ProductionPlan: {
		label: '生产计划',
		mainFilterItem: {
			dateRang: {
				id: 'dateRang',
				type: 'dateRange',
				name: '生产计划时间',
				position: 'basic',
				disable: true,
				labelSize: 'lang'
			},
			userBillCode: {
				id: 'userBillCode',
				type: 'input',
				name: '单据号',
				position: 'basic',
				labelSize: 'lang'
			},
			billState: {
				id: 'billState',
				type: 'select',
				name: '审核状态',
				position: 'basic',
				labelSize: 'lang'
			},
			organ: {
				id: 'organ',
				type: 'select',
				name: '机构',
				position: 'basic',
				labelSize: 'lang'
			},
			// house: {
			// 	id: 'house',
			// 	type: 'select',
			// 	name: '仓库',
			// 	position: 'basic',
			// 	labelSize: 'lang'
			// },
			// item: {
			// 	id: 'item',
			// 	type: 'select',
			// 	name: '品项',
			// 	position: 'basic',
			// 	labelSize: 'lang'
			// },
			createPicking: {
				id: 'createPicking',
				type: 'select',
				name: '生成领料单',
				position: 'basic',
				labelSize: 'lang'
			},
			createMachining: {
				id: 'createMachining',
				type: 'select',
				name: '生成加工单',
				position: 'basic',
				labelSize: 'lang'
			},
			createProcedure: {
				id: 'createProcedure',
				type: 'select',
				name: '生成工序任务',
				position: 'basic',
				labelSize: 'lang'
			}
			// operateMan: {
			// 	id: 'operateMan',
			// 	type: 'select',
			// 	name: '经办人',
			// 	position: 'basic',
			// 	labelSize: 'lang'
			// }
		},
		mainTableColumn: {
			sysBillCode: {
				id: 'sysBillCode',
				name: '系统单号',
				width: '140px'
			},
			businessDate: {
				id: 'businessDate',
				name: '生产计划日期',
				width: '160px'
			},
			organName: {
				id: 'organName',
				name: '生产机构',
				width: '120px'
			},
			buyerBillState: {
				id: 'buyerBillState',
				name: '审核状态',
				width: '120px'
			},
			detailAmount: {
				id: 'detailAmount',
				name: '明细数',
				width: '120px'
			},
			progress: {
				id: 'progress',
				name: '生产进度',
				width: '120px'
			},
			createPickingFlag: {
				id: 'createPickingFlag',
				name: '是否生成领料单',
				width: '120px'
			},
			createMachiningFlag: {
				id: 'createMachiningFlag',
				name: '是否生成加工单',
				width: '120px'
			},
			createProcedureTaskFlag: {
				id: 'createProcedureTaskFlag',
				name: '是否生成工序任务',
				width: '120px'
			},
			pickState: {
				id: 'pickState',
				name: '领料状态',
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
