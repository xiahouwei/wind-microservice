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
		label: '调拨时间',
		type: 'basic'
	}, {
		id: 'organName',
		label: '入库方/调拨机构',
		type: 'basic'
	}, {
		id: 'singleInHouseFlag',
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
		id: 'operatorName',
		label: '经办人',
		type: 'basic'
	}, {
		id: 'otherOrganName',
		label: '出库方',
		type: 'basic'
	}, {
		id: 'singleOutHouseFlag',
		label: '出库方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '单仓出库' : '多仓出库'
			const curState = cur ? '单仓出库' : '多仓出库'
			return `出库方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'otherHouseName',
		label: '出库仓库',
		type: 'basic'
	}, {
		id: 'memo',
		label: '备注',
		type: 'basic'
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
		id: 'outHouse.name',
		label: '出库仓库'
	}, {
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
		label: '调拨数量'
	}, {
		id: 'assistUnitAmount',
		label: '辅助数量'
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
