/*
 * @ 节流函数 SHW
 * @ wait 延迟毫秒数
 */
const throttle = function () {
	let previous = 0
	let timeout = null
	return function (wait, final) {
		return new Promise(resolve => {
			const now = Date.now()
			if (now - previous > wait) {
				if (timeout) {
					clearTimeout(timeout)
				}
				previous = now
				resolve()
			}
			if (final) {
				if (timeout) {
					clearTimeout(timeout)
				}
				timeout = setTimeout(() => {
					resolve()
				}, wait)
			}
		})
	}
}

const fxThrottle = throttle()

export default {
	throttle,
	fxThrottle
}
