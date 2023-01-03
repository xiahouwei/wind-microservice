import app from '@/main.js'
const createFileMessage = function (file) {
	return file.appendixUrl
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
		id: 'inOrgan.name',
		label: '入库机构'
	}, {
		id: 'inHouse.name',
		label: '入库仓库'
	}, {
		id: 'outWay',
		label: '出库方式',
		handler ({ pre, cur }) {
			const getOutWayType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('outWayType')
			const preState = getOutWayType(pre).label
			const curState = getOutWayType(cur).label
			return `出库方式由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'outHouse.name',
		label: '耗用仓库'
	}, {
		id: 'memo',
		label: '明细备注'
	}]
}
