import app from '@/main.js'
const createConnectItemMessage = function (item) {
	return `品项名称:${item.name}`
}
export default {
	rack: [{
		id: 'organName',
		label: '所属机构',
		type: 'basic'
	}, {
		id: 'houseName',
		label: '所属仓库',
		type: 'basic'
	}, {
		id: 'code',
		label: '货架编码',
		type: 'basic'
	}, {
		id: 'name',
		label: '货架名称',
		type: 'basic'
	}, {
		id: 'shelfType',
		label: '货架类型',
		type: 'basic',
		handler ({ pre, cur }) {
			const getShelfType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('storageRackTypeList')
			const preState = getShelfType(pre).label
			const curState = getShelfType(cur).label
			return `货架类型由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'enableFlag',
		label: '货架状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `货架状态由"${preState}"改为"${curState}"`
		}
	}],
	main: [{
		id: 'organName',
		label: '所属机构',
		type: 'basic'
	}, {
		id: 'houseName',
		label: '所属仓库',
		type: 'basic'
	}, {
		id: 'shelfCode',
		label: '货架编码',
		type: 'basic'
	}, {
		id: 'code',
		label: '货位编码',
		type: 'basic'
	}, {
		id: 'shelfOrder',
		label: '上架顺序',
		type: 'basic'
	}, {
		id: 'pickingOrder',
		label: '捡货顺序',
		type: 'basic'
	}, {
		id: 'locationCategory',
		label: '货位类型',
		type: 'basic',
		handler ({ pre, cur }) {
			const getSpaceType = app.vue.$fxTypeMiddleware.getCommonTypeItemById('storageSpaceTypeList')
			const preState = getSpaceType(pre).label
			const curState = getSpaceType(cur).label
			return `货位类型由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'enableFlag',
		label: '货位状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `货位状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'relAllItem',
		label: '管理品项',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '全部品项' : '自定义'
			const curState = cur ? '全部品项' : '自定义'
			return `管理品项由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'volumeLimit',
		label: '体积限制（M3）',
		type: 'append'
	}, {
		id: 'weightLimit',
		label: '重量限制（KG）',
		type: 'append'
	}, {
		id: 'amountLimit',
		label: '数量限制',
		type: 'append'
	}, {
		id: 'length',
		label: '货位长（M）',
		type: 'append'
	}, {
		id: 'width',
		label: '货位宽（M）',
		type: 'append'
	}, {
		id: 'height',
		label: '货位高（M）',
		type: 'append'
	}],
	connect: [{
		id: 'connectItem',
		label: '关联品项',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '关联品项',
				pre,
				cur,
				msgHandler: createConnectItemMessage
			})
		}
	}]
}
