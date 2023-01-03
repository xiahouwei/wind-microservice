const createItemMessage = function (item) {
	return `适用品项名称:${item.name}`
}
export default {
	main: [{
		id: 'code',
		label: '分组编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '分组名称',
		type: 'basic'
	}, {
		id: 'relAllGoods',
		label: '适用品项',
		type: 'relAllGoods',
		handler ({ pre, cur }) {
			const preState = pre ? '全部' : '自定义'
			const curState = cur ? '全部' : '自定义'
			return `适用品项由"${preState}"改为"${curState}"`
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
	}]
}
