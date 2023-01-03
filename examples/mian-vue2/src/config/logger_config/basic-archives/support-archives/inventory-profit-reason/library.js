import app from '@/main.js'
export default {
	main: [{
		id: 'code',
		label: '盘盈原因编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '盘盈原因名称',
		type: 'basic'
	}, {
		id: 'defaultFlag',
		label: '默认盘盈原因',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `默认盘盈原因由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'generateType',
		label: '盘盈生成方式',
		type: 'basic',
		handler ({ pre, cur }) {
			const getType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('inventoryProfitType')
			const preState = getType(pre).name
			const curState = getType(cur).name
			return `盘盈生成方式由"${preState}"改为"${curState}"`
		}
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
