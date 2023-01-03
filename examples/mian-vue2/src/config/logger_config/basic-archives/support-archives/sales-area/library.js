import app from '@/main.js'
export default {
	main: [{
		id: 'subOrganName',
		label: '所属机构',
		type: 'basic'
	}, {
		id: 'code',
		label: '销售区域编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '销售区域名称',
		type: 'basic'
	}, {
		id: 'pinYin',
		label: '销售区域助记符',
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
