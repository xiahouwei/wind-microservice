const createConnectEmployeeMessage = function (item) {
	return `员工名称:${item.name}`
}
const createConnectAuthMessage = function (authList) {
	const auth = {}
	authList.forEach(item => {
		if (auth[item.fatherWholeName]) {
			auth[item.fatherWholeName].push(item.name)
		} else {
			auth[item.fatherWholeName] = [item.name]
		}
	})
	const msg = Object.keys(auth).map(item => {
		return `${item}：“${auth[item].join('，')}”`
	}).join('，')
	return msg
}
export default {
	main: [{
		id: 'code',
		label: '角色编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '角色名称',
		type: 'basic'
	}],
	connectEmployee: [{
		id: 'connectEmployee',
		label: '关联员工',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '关联员工',
				pre,
				cur,
				msgHandler: createConnectEmployeeMessage
			})
		}
	}],
	connectAuth: [{
		id: 'connectAuth',
		label: '关联权限',
		type: 'connect',
		handler ({ pre, cur }) {
			const diff = this.compareDiff({
				pre,
				cur,
				getKeyFn: item => item.id
			})
			const addMessage = diff.add ? `新增权限：${createConnectAuthMessage(diff.add)}` : ''
			const delMessage = diff.delete ? `删除权限：${createConnectAuthMessage(diff.delete)}` : ''
			return `${addMessage}${delMessage}`
		}
	}]
}
