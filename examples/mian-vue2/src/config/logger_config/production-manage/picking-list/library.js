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
		id: 'operateMan.name',
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
		label: '领料单位'
	}, {
		id: 'planTotal',
		label: '应领数量'
	}, {
		id: 'actualTotal',
		label: '已领数量'
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
