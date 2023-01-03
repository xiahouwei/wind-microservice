export function mapStates (mapper) {
	const res = {}
	Object.keys(mapper).forEach(key => {
		const value = mapper[key]
		let fn
		if (typeof value === 'string') {
			fn = function () {
				return this.$printstore.states[value]
			}
		} else if (typeof value === 'function') {
			fn = function () {
				return value.call(this, this.$printstore.states)
			}
		} else {
			console.error('invalid value type')
		}
		if (fn) {
			res[key] = fn
		}
	})
	return res
}
