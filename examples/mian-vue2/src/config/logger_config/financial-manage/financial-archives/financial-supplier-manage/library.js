import app from '@/main.js'
export default {
	main: [{
		id: 'enableFlag',
		label: '启停状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'legalMan',
		label: '法人代表',
		type: 'invoice'
	}, {
		id: 'taxPayerNum',
		label: '纳税人识别号',
		type: 'invoice'
	}, {
		id: 'taxTypeName',
		label: '税务分类',
		type: 'invoice'
	}, {
		id: 'bank',
		label: '开户行',
		type: 'invoice'
	}, {
		id: 'bankAccount',
		label: '开户账号',
		type: 'invoice'
	}, {
		id: 'taxRate',
		label: '默认税率',
		type: 'invoice'
	}, {
		id: 'invoiceAddress',
		label: '开票地址',
		type: 'invoice'
	}, {
		id: 'phone',
		label: '联系电话',
		type: 'invoice'
	}, {
		id: 'invoicingTypeName',
		label: '发票类型',
		type: 'invoice'
	}],
	details: [{
		id: 'settlementWay.name',
		label: '结算方式'
	}, {
		id: 'accountName',
		label: '账户名称'
	}, {
		id: 'bankAccount',
		label: '银行账户'
	}, {
		id: 'bank',
		label: '开户银行'
	}, {
		id: 'revenType',
		label: '收支属性',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxTypeMiddleware.getCommonTypeItemById('balancePropertiesList')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `收支属性由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'defaultFlag',
		label: '是否默认',
		handler ({ pre, cur }) {
			const preState = pre ? '默认' : '非默认'
			const curState = cur ? '默认' : '非默认'
			return `是否默认由"${preState}"改为"${curState}"`
		}
	}]
}
