let fxHistoryArr = []
export default {
	resetHistoryArr () {
		fxHistoryArr = []
	},
	getHistoryArr () {
		return fxHistoryArr
	},
	pushHistoryArr () {
		return Array.prototype.push.call(fxHistoryArr, ...arguments)
	},
	spliceHistoryArr (index, len = 1) {
		return Array.prototype.splice.call(fxHistoryArr, index, len)
	},
	hasShowComponet () {
		return fxHistoryArr.length > 0
	},
	hideComponet (to, from) {
		const obj = fxHistoryArr[fxHistoryArr.length - 1]
		const { context, expression, arg } = obj
		if (typeof context[arg] === 'function') {
			context[arg](to, from)
		} else {
			context[expression] = false
		}
	}
}
