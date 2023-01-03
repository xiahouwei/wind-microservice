import app from '@/main'

const focusHandler = function (context) {
	return (refName) => {
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
	}
}
const isCascader = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-cascader'
}
const isWSelect = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-select'
}
const isWSelectTab = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-select-tab'
}
const isWSelectMulity = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-select-mulity'
}
const isWSelectTabMulity = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-select-tab-mulity'
}
const isWSelectCycle = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'w-select-cycle'
}
const isFxDetialsQueueTools = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'fx-detials-queue-tools'
}
const isFxDetialsTable = function (vnode) {
	return vnode.componentInstance.$options._componentTag === 'fx-detials-table'
}
const bindCascaderPopperTabEvent = function (vnode, fxTabHandler) {
	const popperEl = vnode.componentInstance.$refs.cascader.$refs.popper
	popperEl.fxTabHandler = fxTabHandler
	popperEl.addEventListener('keydown', fxTabHandler)
}
const bindWSelectMulityPopperTabEvent = function (vnode, fxTabHandler) {
	const popperEl = vnode.componentInstance.$refs.popper.$refs.popper
	popperEl.fxTabHandler = fxTabHandler
	popperEl.addEventListener('keydown', fxTabHandler)
}
const bindWSelectTabMulityPopperTabEvent = function (vnode, fxTabHandler) {
	const popperEl = vnode.componentInstance.$refs.popper.$refs.popper
	popperEl.fxTabHandler = fxTabHandler
	popperEl.addEventListener('keydown', fxTabHandler)
}
const bindWSelectCycleTabEvent = function (vnode, fxTabHandler) {
	vnode.componentInstance.$on('on-tab', fxTabHandler)
}
const bindFxDetialsQueueToolsEvent = function (vnode, fxTabHandler) {
	vnode.componentInstance.$on('on-tab', fxTabHandler)
}
const bindFxDetialsTableEvent = function (vnode, fxTabHandler) {
	vnode.componentInstance.$on('on-tab', fxTabHandler)
}
export default {
	bind: (el, binding, vnode) => {
		const fxTabHandler = function (event) {
			const { arg, expression } = binding
			const { context } = vnode
			if (event.code === 'Tab') {
				event.preventDefault && event.preventDefault()
				app.vue.$fxUtils.fxDebounce(100, false, false).then(() => {
					if (isWSelect(vnode) || isWSelectTab(vnode) || isWSelectMulity(vnode) || isWSelectTabMulity(vnode)) {
						vnode.componentInstance.handleClose()
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
					} else if (arg === 'loop') {
						const [moduleName, refName] = Object.keys(binding.modifiers)
						app.vue.$fxTabkey.tabChangeHandler(moduleName, refName)
					} else {
						if (expression) {
							context[expression]({
								focus: focusHandler(context),
								loop: app.vue.$fxTabkey.tabChangeHandler
							})
						}
					}
				})
			}
		}
		if (isCascader(vnode)) {
			bindCascaderPopperTabEvent(vnode, fxTabHandler)
		} else if (isWSelectMulity(vnode)) {
			bindWSelectMulityPopperTabEvent(vnode, fxTabHandler)
		} else if (isWSelectCycle(vnode)) {
			bindWSelectCycleTabEvent(vnode, fxTabHandler)
		} else if (isWSelectTabMulity(vnode)) {
			bindWSelectTabMulityPopperTabEvent(vnode, fxTabHandler)
		} else if (isFxDetialsQueueTools(vnode)) {
			bindFxDetialsQueueToolsEvent(vnode, fxTabHandler)
		} else if (isFxDetialsTable(vnode)) {
			bindFxDetialsTableEvent(vnode, fxTabHandler)
		} else {
			el.fxTabHandler = fxTabHandler
			el.addEventListener('keydown', fxTabHandler)
		}
	},
	unbind: (el, binding, vnode) => {
		el.removeEventListener('keydown', el.fxTabHandler)
	}
}
