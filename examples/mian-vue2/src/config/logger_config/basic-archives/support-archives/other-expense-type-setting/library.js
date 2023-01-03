import app from '@/main.js'
export default {
	main: [{
		id: 'code',
		label: '其他费用类型编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '其他费用类型名称',
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
	}]
}
