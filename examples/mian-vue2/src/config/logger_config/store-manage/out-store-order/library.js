// import app from '@/main.js'
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
		label: '出库时间',
		type: 'basic'
	}, {
		id: 'organName',
		label: '出库方',
		type: 'basic'
	}, {
		id: 'singleHouseFlag',
		label: '出库方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '单仓出库' : '多仓出库'
			const curState = cur ? '单仓出库' : '多仓出库'
			return `出库方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'outHouseName',
		label: '出库仓库',
		type: 'basic'
	}, {
		id: 'otherOrganName',
		label: '入库方',
		type: 'basic'
	}, {
		id: 'carriageFee',
		label: '整单运费',
		type: 'basic'
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
		id: 'outHouse.name',
		label: '出库仓库'
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
		label: '出库数量'
	}, {
		id: 'salesTaxPrice',
		label: '含税销售单价'
	}, {
		id: 'salesTaxMoney',
		label: '含税销售金额'
	}, {
		id: 'salesTaxRate',
		label: '销项税率'
	}, {
		id: 'salesPrice',
		label: '非税销售单价'
	}, {
		id: 'salesMoney',
		label: '非税销售金额'
	}, {
		id: 'inTaxRateMoney',
		label: '税额'
	}, {
		id: 'assistUnitAmount',
		label: '辅助数量'
	}, {
		id: 'distributeFlag',
		label: '配货标记',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `配货标记由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'outReason.name',
		label: '出库原因',
		handler ({ pre, cur }) {
			const preState = pre || ''
			const curState = cur || ''
			return `出库原因由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'memo',
		label: '明细备注'
	}, {
		id: 'giftFlag',
		label: '赠品标记',
		handler ({ pre, cur }) {
			const preState = pre ? '赠品' : '非赠品'
			const curState = cur ? '赠品' : '非赠品'
			return `赠品标记由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'batchCode',
		label: '批次号'
	}]
}
