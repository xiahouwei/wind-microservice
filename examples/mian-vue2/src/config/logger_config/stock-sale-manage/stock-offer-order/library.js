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
		label: '申请时间',
		type: 'basic'
	}, {
		id: 'organName',
		label: '买方机构',
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
		label: '买方仓库',
		type: 'basic'
	}, {
		id: 'operatorName',
		label: '经办人',
		type: 'basic'
	}, {
		id: 'purchasePlanName',
		label: '订货方案',
		type: 'basic'
	}, {
		id: 'urgent',
		label: '采购加急',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '加急' : '不加急'
			const curState = cur ? '加急' : '不加急'
			return `采购加急由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'memo',
		label: '备注',
		type: 'basic'
	}, {
		id: 'linkman',
		label: '联系人',
		type: 'send'
	}, {
		id: 'phone',
		label: '联系电话',
		type: 'send'
	}, {
		id: 'deliveryAddr',
		label: '送货地址',
		type: 'send'
	}, {
		id: 'appendixList',
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
		label: '买方仓库'
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
		label: '申请数量'
	}, {
		id: 'item.assistUnit',
		label: '辅助单位'
	}, {
		id: 'assistUnitAmount',
		label: '辅助数量'
	}, {
		id: 'expectArrivalDate',
		label: '期望到货时间'
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
