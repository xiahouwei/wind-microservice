

export default {
	bind: (el, binding, vnode) => {
		if (vnode.componentInstance.$options._componentTag === 'w-select') {
			const fxEnterHandler = function () {
				const { arg, expression } = binding
				const { context } = vnode
				if (arg === 'focus') {
					const refName = Object.keys(binding.modifiers)[0]
					if (refName) {
						context.$refs[refName] && context.$refs[refName].focus()
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
				if (event.code === 'Enter' || event.code === 'NumpadEnter') {
					if (arg === 'focus') {
						const refName = Object.keys(binding.modifiers)[0]
						if (refName) {
							context.$refs[refName] && context.$refs[refName].focus()
						}
					} else if (!arg && expression) {
						context[expression]()
					}
				}
			}
			el.fxEnterHandler = fxEnterHandler
			el.addEventListener('keyup', fxEnterHandler)
		}
	},
	unbind: (el, binding, vnode) => {
		if (vnode.componentInstance.$options._componentTag === 'w-select') {
			vnode.componentInstance.$off('on-select-enter', el.fxEnterHandler)
		} else {
			el.removeEventListener('keyup', el.fxEnterHandler)
		}
	}
}
