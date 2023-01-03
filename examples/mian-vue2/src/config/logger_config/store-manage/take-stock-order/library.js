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
		label: '盘点时间',
		type: 'basic'
	}, {
		id: 'organName',
		label: '盘点机构',
		type: 'basic'
	}, {
		id: 'houseName',
		label: '盘点仓库',
		type: 'basic'
	}, {
		id: 'checkClassName',
		label: '盘点分类',
		type: 'basic'
	}, {
		id: 'checkWayName',
		label: '盘点方式',
		type: 'basic'
	}, {
		id: 'notCheckName',
		label: '未盘品项',
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
		id: 'appendices',
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
		id: 'item.name',
		label: '品项'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'checkUnit1.name',
		label: '盘点单位1'
	}, {
		id: 'realCheckAmount1',
		label: '实盘数量'
	}, {
		id: 'checkUnit2.name',
		label: '盘点单位2'
	}, {
		id: 'realCheckAmount2',
		label: '实盘数量'
	}, {
		id: 'realCheckMoney',
		label: '实盘金额'
	}, {
		id: 'checkCause.name',
		label: '盘盈原因'
	}, {
		id: 'assistUnitAmount',
		label: '实盘辅助数量'
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
