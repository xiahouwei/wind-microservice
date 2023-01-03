export function mapState (mapper) {
	const res = {}
	Object.keys(mapper).forEach(key => {
		const value = mapper[key]
		let fn
		if (typeof value === 'string') {
			fn = function () {
				// return this.$printstore.state[value]
				return window.$$windMicroStore.state[value]
			}
		} else if (typeof value === 'function') {
			fn = function () {
				// return value.call(this, this.$printstore.state)
				return value.call(this, window.$$windMicroStore.state)
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
