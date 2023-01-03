const createMessage = function (item) {
	const paramsName = item.nickName
	const codeName = item.mparamConfigDetails ? item.mparamConfigDetails.find(_item => _item.code === item.code).nickName : item.code
	return `${paramsName}:${codeName}`
}
export default {
	main: [{
		id: 'code',
		label: '系统参数',
		type: 'basic',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				pre,
				cur,
				msgHandler: createMessage
			})
		}
	}]
}
