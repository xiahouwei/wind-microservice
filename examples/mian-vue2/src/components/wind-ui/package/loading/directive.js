import Vue from 'vue'
import { addClass, removeClass, getStyle } from '../../js/utils/dom'
import Loading from './Loading.vue'
const FxLoading = Vue.extend(Loading)
export default {
	install (Vue) {
		const toggleLoading = (el, binding) => {
			if (binding.value) {
				Vue.nextTick(() => {
					if (binding.modifiers.fullscreen) {
						el.originalPosition = getStyle(document.body, 'position')
						el.originalOverflow = getStyle(document.body, 'overflow')
						addClass(el.mask, 'is-fullscreen')
						insertDom(document.body, el, binding)
					} else {
						insertDom(el, el, binding)
					}
				})
			} else {
				el.domVisible = false
				el.instance.close()
				const target = binding.modifiers.fullscreen || binding.modifiers.body
					? document.body
					: el
				removeClass(target, 'wind-loading-parent--relative')
				removeClass(target, 'wind-loading-parent--hidden')
			}
		}
		const insertDom = (parent, el, binding) => {
			if (el.domVisible && !el.instance.visible) {
				el.instance.visible = true
			} else if (!el.domVisible) {
				if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
					addClass(parent, 'wind-loading-parent--relative')
				}
				if (binding.modifiers.fullscreen && binding.modifiers.lock) {
					addClass(parent, 'wind-loading-parent--hidden')
				}
				el.domVisible = true
				parent.appendChild(el.mask)
				Vue.nextTick(() => {
					el.instance.visible = true
				})
				el.domInserted = true
			}
		}
		Vue.directive('fx-loading', {
			bind: function (el, binding, vnode) {
				const textExr = el.getAttribute('fx-loading-text')
				const spinnerExr = el.getAttribute('fx-loading-spinner')
				const backgroundExr = el.getAttribute('fx-loading-background')
				const customClassExr = el.getAttribute('fx-loading-custom-class')
				const sizeExr = el.getAttribute('fx-loading-size')
				const vm = vnode.context
				const fxLoading = new FxLoading({
					el: document.createElement('div'),
					data: {
						text: (vm && vm[textExr]) || textExr || '小龙人奋力奔跑中~',
						spinner: (vm && vm[spinnerExr]) || spinnerExr,
						background: (vm && vm[backgroundExr]) || backgroundExr,
						customClass: (vm && vm[customClassExr]) || customClassExr,
						fullscreen: !!binding.modifiers.fullscreen,
						size: (vm && vm[sizeExr]) || sizeExr || ''
					}
				})
				el.instance = fxLoading
				el.mask = fxLoading.$el
				el.maskStyle = {}
				binding.value && toggleLoading(el, binding)
			},
			update: function (el, binding, vnode) {
				const vm = vnode.context
				const textExr = el.getAttribute('fx-loading-text')
				el.instance.setText((vm && vm[textExr]) || textExr || '小龙人奋力奔跑中~')
				if (binding.oldValue !== binding.value) {
					toggleLoading(el, binding)
				}
			},
			unbind: function (el, binding) {
				if (el.domInserted) {
					el.mask &&
					el.mask.parentNode &&
					el.mask.parentNode.removeChild(el.mask)
					toggleLoading(el, { value: false, modifiers: binding.modifiers })
				}
				el.instance && el.instance.$destroy()
			}
		})
	}
}
