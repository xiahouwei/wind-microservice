import utils from '@/js/lib/utils'
let isChineseInputeMethod = false
const onChineseInputEvent = () => {
	if (!utils.isEnterCode(event.code)) {
		return false
	}
	isChineseInputeMethod = utils.isChineseEnterCode(event.keyCode)
}

export default {
	bind: (el, binding, vnode) => {
		if (vnode.componentInstance.$options._componentTag === 'w-select') {
			const fxEnterHandler = function () {
				const { arg, expression } = binding
				const { context } = vnode
				if (arg === 'focus') {
					const refName = Object.keys(binding.modifiers)[0]
					if (refName) {
						const ref = context.$refs[refName]
						if (ref) {
							if (typeof ref.focus === 'function') {
								ref.focus()
							} else {
								ref.$el.focus()
							}
						}
					}
				} else if (!arg && expression) {
					context[expression]()
				}
			}
			el.fxEnterHandler = fxEnterHandler
			vnode.componentInstance.$on('on-select-enter', fxEnterHandler)
		} else {
			const fxEnterHandler = function (event) {
				const { arg, expression } = binding
				const { context } = vnode
				if (!utils.isEnterCode(event.code)) {
					return false
				}
				if (isChineseInputeMethod) {
					return false
				}
				if (arg === 'focus') {
					const refName = Object.keys(binding.modifiers)[0]
					if (refName) {
						const ref = context.$refs[refName]
						if (ref) {
							if (typeof ref.focus === 'function') {
								ref.focus()
							} else {
								ref.$el.focus()
							}
						}
					}
				} else if (!arg && expression) {
					context[expression]()
				}
			}
			el.fxEnterHandler = fxEnterHandler
			el.addEventListener('keydown', onChineseInputEvent)
			el.addEventListener('keyup', fxEnterHandler)
		}
	},
	unbind: (el, binding, vnode) => {
		if (vnode.componentInstance.$options._componentTag === 'w-select') {
			vnode.componentInstance.$off('on-select-enter', el.fxEnterHandler)
		} else {
			el.removeEventListener('keydown', onChineseInputEvent)
			el.removeEventListener('keyup', el.fxEnterHandler)
		}
	}
}
