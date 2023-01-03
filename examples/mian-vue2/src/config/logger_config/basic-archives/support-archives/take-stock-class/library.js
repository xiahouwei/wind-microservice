import app from '@/main.js'
const createHouseMessage = function (item) {
	return `适用仓库名称:${item.name}`
}
const createItemMessage = function (item) {
	return `适用品项名称:${item.name}`
}
const createItemTypeMessage = function (item) {
	return `适用品项类别名称:${item.name}`
}
const createManageCustomerMessage = function (item) {
	return `必盘品项名称:${item.name}`
}
export default {
	main: [{
		id: 'code',
		label: '分类编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '分类名称',
		type: 'basic'
	}, {
		id: 'cycle',
		label: '盘点周期',
		type: 'cycle'
	}, {
		id: 'house',
		label: '适用仓库',
		type: 'house'
	}, {
		id: 'relAllHouses',
		label: '适用仓库',
		type: 'relAllHouses',
		handler ({ pre, cur }) {
			const preState = pre ? '全部' : '自定义'
			const curState = cur ? '全部' : '自定义'
			return `适用仓库由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'relAllItems',
		label: '适用品项',
		type: 'relAllItems',
		handler ({ pre, cur }) {
			const preState = pre ? '全部' : '自定义'
			const curState = cur ? '全部' : '自定义'
			return `适用品项由"${preState}"改为"${curState}"`
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
	}, {
		id: 'memo',
		label: '备注',
		type: 'append'
	}],
	manage: [{
		id: 'house',
		label: '适用仓库',
		type: 'house',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用仓库',
				pre,
				cur,
				msgHandler: createHouseMessage
			})
		}
	}, {
		id: 'item',
		label: '适用品项',
		type: 'item',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用品项',
				pre,
				cur,
				msgHandler: createItemMessage
			})
		}
	}, {
		id: 'must',
		label: '必盘品项',
		type: 'must',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '必盘品项',
				pre,
				cur,
				msgHandler: createManageCustomerMessage
			})
		}
	}],
	connect: [{
		id: 'connectItem',
		label: '适用品项',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用品项',
				pre,
				cur,
				msgHandler: createItemMessage
			})
		}
	}, {
		id: 'connectItemType',
		label: '适用品项类别',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用品项类别',
				pre,
				cur,
				msgHandler: createItemTypeMessage
			})
		}
	}]
}
