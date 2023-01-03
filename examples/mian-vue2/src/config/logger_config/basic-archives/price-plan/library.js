import app from '@/main.js'
const createFileMessage = function (file) {
	return file.appendixUrl
}
const strategyMessage = function (row) {
	const isCommonType = app.vue.$fxTypeMiddleware.isCommonType('strategyType')
	if (isCommonType(['fixed'])(row.strategy)) {
		return '固定价'
	} else if (isCommonType(['cost'])(row.strategy)) {
		return '成本价'
	} else if (isCommonType(['proportion'])(row.strategy)) {
		return `成本 + ${row.price}%`
	} else if (isCommonType(['price'])(row.strategy)) {
		return `成本 + ${row.price}`
	} else {
		return ''
	}
}
export default {
	main: [{
		id: 'code',
		label: '方案编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '方案名称',
		type: 'basic'
	}, {
		id: 'beginDate',
		label: '起始日期',
		type: 'basic'
	}, {
		id: 'endDate',
		label: '截止日期',
		type: 'basic'
	}, {
		id: 'sellerOrganName',
		label: '卖方机构',
		type: 'basic'
	}, {
		id: 'organName',
		label: '买方机构',
		type: 'basic'
	}, {
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
		id: 'item.code',
		label: '品项编号'
	}, {
		id: 'item.name',
		label: '品项名称'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'itemUnit.name',
		label: '单位'
	}, {
		id: 'strategy',
		label: '价格策略',
		handler ({ pre, cur, preFull, curFull }) {
			return `价格策略由"${strategyMessage(preFull)}"改为"${strategyMessage(curFull)}"`
		}
	}, {
		id: 'price',
		label: '非税单价（元）'
	}, {
		id: 'taxRate',
		label: '税率',
		handler ({ pre, cur, preFull, curFull }) {
			return `税率由"${app.vue.$fxUtils.toFixed(pre * 100)}%"改为"${app.vue.$fxUtils.toFixed(cur * 100)}%"`
		}
	}, {
		id: 'taxPrice',
		label: '含税单价（元）'
	}, {
		id: 'enableFlag',
		label: '启停用',
		handler ({ pre, cur, preFull, curFull }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
