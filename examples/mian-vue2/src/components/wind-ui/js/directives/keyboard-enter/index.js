import { initEventUtils, isChineseInputMethod, isEnterCode } from '../../utils/event.js'
const eventUtils = initEventUtils()
const elEnterMap = new WeakMap()
class KeyboardEnterEventClass {
	constructor (el, binding, vnode) {
		this.el = el
		this.binding = binding
		this.vnode = vnode
		this.isChineseInputeMethod = false
		this.keyboardEnterEventType = binding.modifiers.keydown ? 'keydown' : 'keyup'
		this.bind()
	}

	bind () {
		eventUtils.on(this.el, 'keydown', this.onChineseInputMethodGather)
		eventUtils.on(this.el, this.keyboardEnterEventType, this.onKeyboardEnterHandler)
	}

	unbind () {
		eventUtils.off(this.el, 'keydown', this.onChineseInputMethodGather)
		eventUtils.off(this.el, this.keyboardEnterEventType, this.onKeyboardEnterHandler)
	}

	onChineseInputMethodGather = (event) => {
		if (!isEnterCode(event.code)) {
			return false
		}
		this.isChineseInputeMethod = isChineseInputMethod(event.keyCode)
	}

	onKeyboardEnterHandler = (event) => {
		if (!isEnterCode(event.code)) {
			return false
		}
		if (this.isChineseInputeMethod) {
			return false
		}
		if (typeof this.binding.value === 'function') {
			const vm = this.vnode.context
			this.binding.value.call(vm, event)
		}
	}

	setBinding = (binding, vnode) => {
		this.binding = binding
		this.vnode = vnode
	}
}
export default {
	bind: function (el, binding, vnode) {
		const keyboardEnterEvent = new KeyboardEnterEventClass(el, binding, vnode)
		elEnterMap.set(el, keyboardEnterEvent)
	},
	update: function (el, binding, vnode) {
		if (elEnterMap.has(el)) {
			elEnterMap.get(el).setBinding(binding, vnode)
		}
	},
	unbind: function (el, binding) {
		if (elEnterMap.has(el)) {
			elEnterMap.get(el).unbind()
		}
	}
}
