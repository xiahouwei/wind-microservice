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
		id: 'organName',
		label: '买方机构',
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
		id: 'item.name',
		label: '品项'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'itemUnit.name',
		label: '单位'
	}, {
		id: 'taxPrice',
		label: '含税单价'
	}, {
		id: 'taxRate',
		label: '税率'
	}, {
		id: 'price',
		label: '非税单价'
	}, {
		id: 'item.assistUnit',
		label: '辅助单位'
	}, {
		id: 'otherOrgan.name',
		label: '卖方机构'
	}, {
		id: 'isUnique',
		label: '是否唯一',
		handler ({ pre, cur }) {
			const preState = pre === 1 ? '是' : '否'
			const curState = cur === 1 ? '是' : '否'
			return `订货方式由"${preState}"改为"${curState}"`
		}
	}]
}
