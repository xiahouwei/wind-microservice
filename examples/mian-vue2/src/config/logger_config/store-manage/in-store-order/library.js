const createFileMessage = function (file) {
	return file.appendixUrl
}
export default {
	main: [{
		id: 'userBillCode',
		label: '手工单号',
		type: 'basic'
	}, {
		id: 'billTypeName',
		label: '单据类型：',
		type: 'basic'
	}, {
		id: 'billBizTypeName',
		label: '业务类型',
		type: 'basic'
	}, {
		id: 'businessDate',
		label: '入库时间',
		type: 'basic'
	}, {
		id: 'inOrganName',
		label: '入库方',
		type: 'basic'
	}, {
		id: 'singleHouseFlag',
		label: '入库方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '单仓入库' : '多仓入库'
			const curState = cur ? '单仓入库' : '多仓入库'
			return `入库方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'inHouseName',
		label: '入库仓库',
		type: 'basic'
	}, {
		id: 'otherOrganName',
		label: '出库方',
		type: 'basic'
	}, {
		id: 'carriageFee',
		label: '整单运费',
		type: 'basic'
	}, {
		id: 'allotFlag',
		label: '分摊明细',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '分摊到明细' : '不分摊明细'
			const curState = cur ? '分摊到明细' : '不分摊明细'
			return `分摊明细由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'operatorName',
		label: '经办人',
		type: 'basic'
	}, {
		id: 'memo',
		label: '备注',
		type: 'basic'
	}, {
		id: 'appendixes',
		label: '附件资料',
		type: 'other',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '附件资料',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}],
	details: [{
		id: 'inHouse.name',
		label: '入库仓库'
	}, {
		id: 'item.name',
		label: '品项'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'itemUnit.name',
		label: '单位'
	}, {
		id: 'amount',
		label: '入库数量'
	}, {
		id: 'inTaxPrice',
		label: '含税单价'
	}, {
		id: 'inTaxMoney',
		label: '含税金额'
	}, {
		id: 'taxRate',
		label: '税率'
	}, {
		id: 'inPrice',
		label: '非税单价'
	}, {
		id: 'inMoney',
		label: '非税金额'
	}, {
		id: 'inTaxRateMoney',
		label: '税额'
	}, {
		id: 'assistUnitAmount',
		label: '辅助数量'
	}, {
		id: 'houseItemLocation.houseItemLocationInfo',
		label: '收货货位',
		handler ({ pre, cur }) {
			const preState = pre || ''
			const curState = cur || ''
			return `收货货位由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'memo',
		label: '明细备注'
	}, {
		id: 'productDate',
		label: '生产日期'
	}, {
		id: 'giftFlag',
		label: '赠品标记',
		handler ({ pre, cur }) {
			const preState = pre ? '赠品' : '非赠品'
			const curState = cur ? '赠品' : '非赠品'
			return `赠品标记由"${preState}"改为"${curState}"`
		}
	}]
}
