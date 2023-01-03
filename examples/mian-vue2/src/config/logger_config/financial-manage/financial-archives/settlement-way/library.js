import app from '@/main.js'
export default {
	main: [{
		id: 'code',
		label: '结算方式编码'
	}, {
		id: 'name',
		label: '结算方式名称'
	}, {
		id: 'memo',
		label: '备注'
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
	}]
}
