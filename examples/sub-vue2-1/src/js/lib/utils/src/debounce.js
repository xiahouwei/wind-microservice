/*
 * @ 防抖函数 SHW
 * @ wait 延迟毫秒数
 * @ immediate 立即执行
 */
const debounce = function () {
	let timeout = null
	return function (wait, immediate = true, final = false) {
		return new Promise(resolve => {
			if (timeout) {
				clearTimeout(timeout)
			}
			if (immediate) {
				const immediateAction = !timeout
				timeout = setTimeout(() => {
					if (final && !immediateAction) {
						resolve()
					}
					timeout = null
				}, wait)
				if (immediateAction) {
					resolve()
				}
			} else {
				timeout = setTimeout(() => {
					resolve()
					timeout = null
				}, wait)
			}
		})
	}
}

const fxDebounce = debounce()
export default {
	debounce,
	fxDebounce
}
